const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/multer");
const router = express.Router();

const { fetchOffer, offerCreate, getOffers } = require("./offers.controllers");

router.param("offerId", async (req, res, next, offerId) => {
  const offer = await fetchOffer(offerId, next);
  if (offer) {
    req.offer = offer;
    next();
  } else {
    const err = new Error("Offer Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/:spotId",
  passport.authenticate("orgJWT", { session: false }),
  upload.single("image"),
  offerCreate
);
router.get("/", getOffers);

module.exports = router;
