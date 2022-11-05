const connectDb = require("./database");
const express = require("express");
const passport = require("passport");
const path = require("path");
const userRoutes = require("./api/users/users.routes");
const organizerRoutes = require("./api/organizers/organizers.routes");
const categoryRoutes = require("./api/categories/categories.routes");
const spotRoutes = require("./api/spots/spots.routes");
const reviewRoutes = require("./api/reviews/reviews.routes");
const offerRoutes = require("./api/offers/offers.routes");
const rewardRoutes = require("./api/rewards/reward.routes");
const ticketRoutes = require("./api/tickets/tickets.routes");
const pointRoutes = require("./api/points/points.routes");
const adRoutes = require("./api/ads/ads.routes");
const cors = require("cors");
const {
  localStrategyUser,
  jwtStrategyUser,
} = require("./middleware/userPassport");
const {
  localStrategyOrg,
  jwtStrategyOrg,
} = require("./middleware/organizerPassport");

const app = express();

//middleware
app.use(cors());
connectDb();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(passport.initialize());
passport.use("user", localStrategyUser);
passport.use("org", localStrategyOrg);
passport.use("userJWT", jwtStrategyUser);
passport.use("orgJWT", jwtStrategyOrg);

//Routes
app.use("/user", userRoutes);
app.use("/organizer", organizerRoutes);
app.use("/category", categoryRoutes);
app.use("/spot", spotRoutes);
app.use("/review", reviewRoutes);
app.use("/offer", offerRoutes);
app.use("/ticket", ticketRoutes);
app.use("/reward", rewardRoutes);
app.use("/point", pointRoutes);
app.use("/ads", adRoutes);
//
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//
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
