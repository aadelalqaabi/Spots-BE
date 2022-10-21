const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/multer");
const router = express.Router();

const {
  register,
  login,
  getUsers,
  fetchUser,
  updateUser,
  spotAdd,
  removeSpot,
  rewardAdd,
  changePassword,
  forgotPassword,
  generateOTP,
  getUsernames
} = require("./users.controllers");

router.param("userId", async (req, res, next, userId) => {
  const user = await fetchUser(userId, next);
  if (user) {
    req.user = user;
    next();
  } else {
    const err = new Error("User Not Found");
    err.status = 404;
    next(err);
  }
});

router.post("/register", upload.single("image"), register);
router.post("/login", passport.authenticate("user", { session: false }), login);
router.put(
  "/update",
  upload.single("image"),
  passport.authenticate("userJWT", { session: false }),
  updateUser
);
router.put(
  "/change",
  passport.authenticate("userJWT", { session: false }),
  changePassword
);
router.put(
  "/forgot", forgotPassword
);
router.get(
  "/OTP", generateOTP
);
router.put(
  "/spots/:spotId",
  passport.authenticate("userJWT", { session: false }),
  spotAdd
);
router.put(
  "/rewards/:rewardId",
  passport.authenticate("userJWT", { session: false }),
  rewardAdd
);

router.put(
  "/remove/:spotId",
  passport.authenticate("userJWT", { session: false }),
  removeSpot
);

router.get("/", getUsers);
router.get("/usernames", getUsernames);
module.exports = router;
