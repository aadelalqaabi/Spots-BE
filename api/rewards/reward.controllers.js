const Reward = require("../../models/Reward");
const Spot = require("../../models/Spot");

exports.fetchReward = async (rewardId, next) => {
  try {
    const reward = await Reward.findById(rewardId);
    return reward;
  } catch (error) {
    next(error);
  }
};

exports.rewardCreate = async (req, res, next) => {
  const { spotId } = req.params;
  req.body.spot = spotId;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  try {
    const newReward = await Reward.create(req.body);
    await Spot.findByIdAndUpdate(spotId, {
      $push: { rewards: newReward._id },
    });
    res.status(201).json(newReward);
  } catch (error) {
    next(error);
  }
};

exports.deleteReward = async (req, res, next) => {
  const { rewardId } = req.params;
  try {
    await Reward.findByIdAndRemove({ _id: rewardId });
    await Spot.findByIdAndUpdate(req.user._id, {
      $pull: { rewards: rewardId },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.getRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    next(error);
  }
};