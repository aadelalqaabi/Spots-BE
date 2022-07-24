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

exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    next(error);
  }
};
