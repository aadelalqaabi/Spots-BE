const Spot = require("../../models/Spot");
const Organizer = require("../../models/Organizer");
const Category = require("../../models/Category");
const PushNotification = require("../../models/PushNotification");

exports.getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find().populate("users");
    res.status(201).json(spots);
  } catch (err) {
    next(err);
  }
};

exports.spotsCreate = async (req, res, next) => {
  const { categoryId } = req.params;
  req.body.organizer = req.user._id;
  req.body.category = categoryId;
  if (req.files.image && req.files.image.length > 0) {
    req.body.image = `/uploads/${req.files.image[0].filename}`;
  }
  if (req.files.galleryImage0 && req.files.galleryImage0.length > 0) {
    req.body.galleryImage0 = `/uploads/${req.files.galleryImage0[0].filename}`;
  }
  if (req.files.galleryImage1 && req.files.galleryImage1.length > 0) {
    req.body.galleryImage1 = `/uploads/${req.files.galleryImage1[0].filename}`;
  }
  if (req.files.galleryImage2 && req.files.galleryImage2.length > 0) {
    req.body.galleryImage2 = `/uploads/${req.files.galleryImage2[0].filename}`;
  }
  if (req.files.galleryImage3 && req.files.galleryImage3.length > 0) {
    req.body.galleryImage3 = `/uploads/${req.files.galleryImage3[0].filename}`;
  }
  if (req.files.galleryImage4 && req.files.galleryImage4.length > 0) {
    req.body.galleryImage4 = `/uploads/${req.files.galleryImage4[0].filename}`;
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
    await newDestNotification(req.user._id)
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
    if (req.files.image && req.files.image.length > 0) {
      req.body.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files.galleryImage0 && req.files.galleryImage0.length > 0) {
      req.body.galleryImage0 = `/uploads/${req.files.galleryImage0[0].filename}`;
    }
    if (req.files.galleryImage1 && req.files.galleryImage1.length > 0) {
      req.body.galleryImage1 = `/uploads/${req.files.galleryImage1[0].filename}`;
    }
    if (req.files.galleryImage2 && req.files.galleryImage2.length > 0) {
      req.body.galleryImage2 = `/uploads/${req.files.galleryImage2[0].filename}`;
    }
    if (req.files.galleryImage3 && req.files.galleryImage3.length > 0) {
      req.body.galleryImage3 = `/uploads/${req.files.galleryImage3[0].filename}`;
    }
    if (req.files.galleryImage4 && req.files.galleryImage4.length > 0) {
      req.body.galleryImage4 = `/uploads/${req.files.galleryImage4[0].filename}`;
    }

    if (req.body.category !== categoryId) {
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
  // newSpot.days.pop();
  newSpot.days = [];
  const plus = newSpot.startDate;
  const minus = plus.slice(8, 10);
  const dayNum = parseInt(minus);
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
  daysOBJ = JSON.stringify(oldSpot.days);
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

newDestNotification = async (organizerId) => {
  const org = await Organizer.findOne({ _id: organizerId }).populate('registerdUsers');

  const enNoti = {
    title: `${org.displayNameEn === "" ? org.username : org.displayNameEn} just posted a new dest 👀`,
    body: `Click to view more`
  }

  const arNoti = {
    title: `👀 نشر للتو وجهة جديدة ${org.displayNameAr === "" ? org.username : org.displayNameAr}`,
    body: `انقر لعرض المزيد`
  }

  // const newPushNotification = await PushNotification.create(req.body);
    for(let i = 0; i < org.registerdUsers.length; i++){
      let user = org.registerdUsers[i];
      if(user.notificationToken !== "") {
        if(user.locale.includes("en")) {
          let message = {
            to: user.notificationToken,
            sound: 'default',
            title: enNoti.title,
            body: enNoti.body,
            data: {},
            _displayInForeground: true
          };
          console.log('sent en')
          try {
            let response = await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            });
    
            if (!response.ok) {
              throw new Error(`Failed to send push notification to ${user.notificationToken}. Status: ${response.status}`);
            }
          } catch (error) {
            console.error(error);
          }
        } else if(user.locale.includes("ar")){
          let message = {
            to: user.notificationToken,
            sound: 'default',
            title: arNoti.title,
            body: arNoti.body,
            data: {},
            _displayInForeground: true
          };
          console.log('sent ar')
          try {
            let response = await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            });
    
            if (!response.ok) {
              throw new Error(`Failed to send push notification to ${user.notificationToken}. Status: ${response.status}`);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
}
