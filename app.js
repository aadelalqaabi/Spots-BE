const connectDb = require("./database");
const express = require("express");
const { GoogleStrategy } = require("./middleware/GooglePassport");
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
const applicationRoutes = require("./api/applications/applications.routes");
const cors = require("cors");
const {
  localStrategyUser,
  jwtStrategyUser,
} = require("./middleware/userPassport");
const {
  localStrategyOrg,
  jwtStrategyOrg,
} = require("./middleware/organizerPassport");
const session = require("express-session");
const { JWT_SECRET } = require("./config/keys");
const { AppleStrategy } = require("./middleware/ApplePassport");

const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
connectDb();
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: JWT_SECRET,
  })
);
app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use("user", localStrategyUser);
passport.use("org", localStrategyOrg);
passport.use("userJWT", jwtStrategyUser);
passport.use("orgJWT", jwtStrategyOrg);
passport.use("google", GoogleStrategy);
passport.use("apple", AppleStrategy);

//google
app.get(
  "/user/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/user/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  (req, res) => {
    res.redirect(
      `exp://127.0.0.1:19000/--/login?email=${req.user.email}/sub=${req.user.sub}`
    );
  }
);

//apple
app.get("/auth/apple", passport.authenticate("apple"));

app.get(
  "/auth/apple/callback",
  passport.authenticate("apple", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(
      `exp://127.0.0.1:19000/--/login?email=${req.user.email}/sub=${req.user.sub}`
    );
  }
);

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
applicationRoutes;
app.use("/ads", adRoutes);
app.use("/application", applicationRoutes);
//
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong...");
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

app.listen(port, () => {
  console.log("The application is running on localhost:3000");
});
