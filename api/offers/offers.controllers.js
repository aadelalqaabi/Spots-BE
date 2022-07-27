const Offer = require("../../models/Offer");
const Spot = require("../../models/Spot");

exports.fetchOffer = async (offerId, next) => {
  try {
    const offer = await Offer.findById(offerId);
    return offer;
  } catch (error) {
    next(error);
  }
};

exports.offerCreate = async (req, res, next) => {
  const { spotId } = req.params;
  req.body.spot = spotId;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  try {
    const newOffer = await Offer.create(req.body);
    await Spot.findByIdAndUpdate(spotId, {
      $push: { offers: newOffer._id },
    });
    res.status(201).json(newOffer);
  } catch (error) {
    next(error);
  }
};

exports.deleteOffer = async (req, res, next) => {
  const { offerId } = req.params;
  try {
    await Offer.findByIdAndRemove({ _id: offerId });
    await Spot.findByIdAndUpdate(req.user._id, {
      $pull: { offers: offerId },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    next(error);
  }
};
