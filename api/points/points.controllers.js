const Ticket = require("../../models/Ticket");
const User = require("../../models/User");
const Point = require("../../models/Point");

exports.fetchPoint = async (pointId, next) => {
  try {
    const point = await Point.findById(pointId);
    return point;
  } catch (error) {
    next(error);
  }
};

exports.pointCreate = async (req, res, next) => {
  const { spotId } = req.params;
  req.body.spot = spotId;
  req.body.user = req.user._id;
  try {
    const newPoint = await Point.create(req.body);
    res.status(200).json(newPoint);
    return;
  } catch (error) {
    next(error);
  }
};

exports.updatePoint = async (req, res, next) => {
  const pointId = req.params.pointId;
  try {
    const point = await Point.findByIdAndUpdate(pointId, req.body, {
      new: true,
    });
    res.status(200).json(point);
    return;
  } catch (err) {
    next(err);
  }
};

exports.getPoints = async (req, res, next) => {
  try {
    const points = await Point.find();
    res.json(points);
    return;
  } catch (error) {
    next(error);
  }
};
