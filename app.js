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
const pushNotificationRoutes = require("./api/pushNotification/pushNotification.routes");
const forgetOrganizersRoutes = require("./api/forgetOrganizers/forgetOrganizers.routes");
const reportRoutes = require("./api/reports/reports.routes");
const popularRoutes = require("./api/populars/populars.routes");
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
const { AppleStrategy } = require("./middleware/ApplePassport");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
connectDb();
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.JWT_SECRET,
  })
);

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: "100mb", extended: true }));
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
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
  "/universal/user/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/universal/user/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  (req, res) => {
    res.redirect(
      `com.dest.kuwait://Login/email=${req.user.email}/sub=${req.user.sub}`
    );
  }
);

//apple
app.get("/api/universal/auth/apple/callback", passport.authenticate("apple"));

app.get(
  "/universal/auth/apple/callback/callback",
  passport.authenticate("apple", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(
      `https://destkw.com/universal/Login?email=${req.user.email}/sub=${req.user.sub}`
    );
  }
);

//Routes
app.use("/api/user", userRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/spot", spotRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/reward", rewardRoutes);
app.use("/api/point", pointRoutes);
applicationRoutes;
app.use("/api/ads", adRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/pushNotification", pushNotificationRoutes);
app.use("/api/forgetOrganizer", forgetOrganizersRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/popular", popularRoutes);
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
  console.log(`The application is running on localhost:${port}`);
});
