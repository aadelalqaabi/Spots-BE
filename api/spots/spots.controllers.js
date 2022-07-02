const Spot = require("../../models/Spot");
const Organizer = require("../../models/Organizer");
const Category = require("../../models/Category");

exports.getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find().populate("category");
    res.status(201).json(spots);
  } catch (err) {
    next(err);
  }
};

exports.spotsCreate = async (req, res, next) => {
  const { categoryId } = req.params;
  //   req.body.organizer = req.organizer._id;
  req.body.category = categoryId;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  try {
    const completeSpot = await days(req.body);
    const newSpot = await Spot.create(completeSpot);
    console.log(completeSpot);
    // await Organizer.findByIdAndUpdate(req.organizer._id, {
    //   $push: { spots: newSpot._id },
    // });
    await Category.findByIdAndUpdate(categoryId, {
      $push: { spots: newSpot._id },
    });
    res.status(201).json(newSpot);
  } catch (error) {
    next(error);
  }
};

exports.updateSpot = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    const spot = await Spot.findByIdAndUpdate(req.spot._id, req.body, {
      new: true,
    });
    res.status(200).json(spot);
  } catch (err) {
    next(err);
  }
};

exports.deleteSpot = async (req, res, next) => {
  try {
    await Spot.findByIdAndRemove({ _id: req.spot._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.fetchSpot = async (spotId, next) => {
  try {
    const spot = await Spot.findById(spotId);
    return spot;
  } catch (err) {
    next(err);
  }
};

days = (newSpot) => {
  // console.log(newSpot);
  for (let i = 0; i < newSpot.numOfDays; i++) {
    newSpot.days.push({
      day: newSpot.startDate + i,
      seats: newSpot.seats,
    });
  }
  return newSpot;
};
