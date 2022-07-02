const connectDb = require("./database");
const express = require("express");
const passport = require("passport");
const path = require("path");
const userRoutes = require("./api/users/users.routes");
const organizerRoutes = require("./api/organizers/organizers.routes");
const categoryRoutes = require("./api/categories/categories.routes");
const spotRoutes = require("./api/spots/spots.routes");
const reviewRoutes = require("./api/reviews/reviews.routes");
const cors = require("cors");
const {
  organizerStrategy,
  userStrategy,
  jwtStrategy,
} = require("./middleware/passport");

const app = express();
app.use(cors());
connectDb();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(passport.initialize());
passport.use("user", userStrategy);
passport.use("organizer", organizerStrategy);
passport.use(jwtStrategy);
app.use("/user", userRoutes);
app.use("/organizer", organizerRoutes);
app.use("/category", categoryRoutes);
app.use("/spot", spotRoutes);
app.use("/review", reviewRoutes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
