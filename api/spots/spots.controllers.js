const Spot = require("../../models/Spot");
const Organizer = require("../../models/Organizer");
const Category = require("../../models/Category");

exports.getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find().populate("users category");
    res.status(201).json(spots);
  } catch (err) {
    next(err);
  }
};

exports.spotsCreate = async (req, res, next) => {
  const { categoryId } = req.params;
  req.body.organizer = req.user._id;
  req.body.category = categoryId;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  // const completeSpot = days(req.body);
  try {
    const newSpot = await Spot.create(req.body);
    await Organizer.findByIdAndUpdate(req.user._id, {
      $push: { spots: newSpot._id },
    });
    await Category.findByIdAndUpdate(categoryId, {
      $push: { spots: newSpot._id },
    });
    res.status(201).json(newSpot);
  } catch (error) {
    next(error);
  }
};

exports.updateSpot = async (req, res, next) => {
  const spotId = req.params.spotId;
  const categoryId = req.params.categoryId;
  // let spot = req.body;

  // if(req.body.isFree === false && req.body.numOfDays === 1){
  //   const completeSpot = daysUpdate(req.body);
  // }
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    if (req.body.category !== categoryId) {
      console.log("Changed");
      await Category.findByIdAndUpdate(req.body.category, {
        $pull: { spots: spotId },
      });
      await Category.findByIdAndUpdate(categoryId, {
        $push: { spots: spotId },
      });
      req.body.category = categoryId;
    }
    const spot = await Spot.findByIdAndUpdate(spotId, req.body, {
      new: true,
    });
    res.status(200).json(spot);
  } catch (err) {
    next(err);
  }
};

exports.deleteSpot = async (req, res, next) => {
  const { spotId } = req.params;
  try {
    await Spot.findByIdAndRemove({ _id: spotId });
    await Organizer.findByIdAndUpdate(req.user._id, {
      $pull: { spots: spotId },
    });
    res.status(204).end();
    // res.status(200).json(organizer);
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
  console.log(newSpot);
  // newSpot.days.pop();
  newSpot.days = [];
  const plus = newSpot.startDate;
  const minus = plus.slice(8, 10);
  const dayNum = parseInt(minus);
  console.log(dayNum);
  for (let i = 0; i < newSpot.numOfDays; i++) {
    newSpot.days.push({
      day: dayNum + i,
      seats: parseInt(newSpot.seats),
    });
  }
  // console.log("days: "+JSON.stringify(newSpot.days));
  // console.log("spotDate: "+JSON.stringify(newSpot.spotDate.day));
  // console.log("spotDate: "+JSON.stringify(newSpot.spotDate.month));
  // console.log("spotDate: "+JSON.stringify(newSpot.spotDate.year));
  // newSpot.startDate = new Date(
  //   `${newSpot.spotDate.year}/
  //     ${newSpot.spotDate.month}/
  //     ${newSpot.spotDate.day}`
  // );
  // console.log("newSpot.startDate: " + newSpot.startDate);
  // console.log("After: "+newSpot);
  return newSpot;
};

daysUpdate = (oldSpot) => {
  console.log(oldSpot);
  daysOBJ = JSON.stringify(oldSpot.days);
  console.log("days :" + daysOBJ);
  if (oldSpot.isFree === true) {
    return oldSpot;
  } else {
    if (oldSpot.numOfDays <= 1) {
      oldSpot.seats = parseInt(oldSpot.seats) + parseInt(oldSpot.addSeats);
      return oldSpot;
    } else {
      for (let i = 0; i < parseInt(oldSpot.numOfDays); i++) {
        oldSpot.days.seats =
          parseInt(oldSpot.days.seats) + parseInt(oldSpot.addSeats);
      }
      return oldSpot;
    }
  }
};
