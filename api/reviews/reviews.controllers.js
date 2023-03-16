const Review = require("../../models/Review");
const Spot = require("../../models/Spot");

exports.fetchReview = async (reviewId, next) => {
  try {
    const review = await Review.findById(reviewId);
    return review;
  } catch (error) {
    next(error);
  }
};

exports.reviewCreate = async (req, res, next) => {
  const { spotId } = req.params;
  req.body.user = req.user._id;
  req.body.spot = spotId;
  try {
    const newReview = await Review.create(req.body);
    await Spot.findByIdAndUpdate(spotId, {
      $push: { reviews: newReview._id },
    });
    res.status(201).json(newReview);
    return;
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate("user");
    res.json(reviews);
    return;
  } catch (error) {
    next(error);
  }
};
