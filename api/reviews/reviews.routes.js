const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  fetchReview,
  reviewCreate,
  getReviews,
} = require("./reviews.controllers");

router.param("reviewId", async (req, res, next, reviewId) => {
  const review = await fetchReview(reviewId, next);
  if (review) {
    req.review = review;
    next();
  } else {
    const err = new Error("Review Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/:spotId",
  passport.authenticate("userJWT", { session: false }),
  reviewCreate
);
router.get("/", getReviews);

module.exports = router;
