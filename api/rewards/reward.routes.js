const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/multer");
const router = express.Router();

const {
  fetchReward,
  rewardCreate,
  getRewards,
  deleteReward,
} = require("./reward.controllers");

router.param("rewardId", async (req, res, next, rewardId) => {
  const reward = await fetchReward(rewardId, next);
  if (reward) {
    req.reward = reward;
    next();
  } else {
    const err = new Error("Reward Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/:spotId",
  passport.authenticate("orgJWT", { session: false }),
  upload.single("image"),
  rewardCreate
);
router.get("/", getRewards);

router.delete(
  "/delete/:rewardId",
  passport.authenticate("orgJWT", { session: false }),
  deleteReward
);

module.exports = router;
