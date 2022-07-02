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
router.put("/", upload.single("image"), updateUser);

router.put(
  "/spots/:spotId",
  passport.authenticate("jwt", { session: false }),
  spotAdd
);

router.put(
  "/remove/:spotId",
  passport.authenticate("jwt", { session: false }),
  removeSpot
);

router.get("/", getUsers);
module.exports = router;
