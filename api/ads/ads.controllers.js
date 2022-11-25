const Ad = require("../../models/Ad");

exports.fetchAd = async (adId, next) => {
  try {
    const ad = await Ad.findById(adId);
    return ad;
  } catch (error) {
    next(error);
  }
};

exports.adCreate = async (req, res, next) => {
  const { spotId } = req.params;
  req.body.spot = spotId;
  try {
    const newAd = await Ad.create({ spot: spotId });
    res.status(201).json(newAd);
  } catch (error) {
    next(error);
  }
};
exports.adRemove = async (req, res, next) => {
  const { spotId } = req.params;
  req.body.spot = spotId;
  try {
    await Ad.remove({ spot: spotId });
    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

exports.getAds = async (req, res, next) => {
  try {
    const ads = await Ad.find().populate("spot");
    res.json(ads);
  } catch (error) {
    next(error);
  }
};
