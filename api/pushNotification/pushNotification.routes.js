const express = require("express");
const passport = require("passport");
const router = express.Router();

const { fetchpushNotification, pushNotificationCreate, getPushNotifications, deletePushNotification } = require("./pushNotification.controllers");

router.param("pushNotificationId", async (req, res, next, pushNotificationId) => { 
  const pushNotification = await fetchpushNotification(pushNotificationId, next);
  if (pushNotification) {
    req.pushNotification = pushNotification;
    next();
  } else {
    const err = new Error("Push Notification Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/create",
  passport.authenticate("orgJWT", { session: false }),
  pushNotificationCreate
);

router.get("/", getPushNotifications);

router.delete("/delete/:pushNotificationId", passport.authenticate("orgJWT", { session: false }), deletePushNotification);

module.exports = router;
