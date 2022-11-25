const express = require("express");
const passport = require("passport");
const router = express.Router();

const { fetchAd, adCreate, getAds, adRemove } = require("./ads.controllers");

router.param("adId", async (req, res, next, adId) => {
  const ad = await fetchAd(adId, next);
  if (ad) {
    req.ad = ad;
    next();
  } else {
    const err = new Error("Ad Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", getAds);
router.post(
  "/add/:spotId",
  passport.authenticate("orgJWT", { session: false }),
  adCreate
);
router.delete(
  "/remove/:spotId",
  passport.authenticate("orgJWT", { session: false }),
  adRemove
);

module.exports = router;
