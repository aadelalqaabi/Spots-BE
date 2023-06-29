const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Spot = require("../../models/Spot");
const Reward = require("../../models/Reward");
const Organizer = require("../../models/Organizer");
const { generateTokenUser } = require("../../middleware/generateToken");

exports.login = async (req, res, next) => {
  try {
    const { user } = req;
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    let userName = req.body.name;
    if (req.body.name === "null") {
      const usersLength = (await User.find()).length + 1;
      userName = `Dester${
        typeof usersLength === "undefined" ? 0 : usersLength
      }`;
    }
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newObject = {
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      image: req.body.image,
      name: userName,
      local: req.body.local,
      platform: req.body.platform,
    };
    const newUser = await User.create(newObject);
    const token = generateTokenUser(newUser);
    res.status(201).json({ token });
    return;
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("spots", "saved")
      .select("-password");
    res.status(201).json(users);
    return;
  } catch (err) {
    res.status(500).json("Server Error");
    return;
  }
};

exports.fetchUser = async (userId, next) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const { id, newPassword, currentPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findById(id);
    //Unhash Password
    const isMatch = await bcrypt.compare(currentPassword, changeUser.password);
    if (isMatch) {
      //hash Password
      console.log("inside");
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      changeUser.password = hashedPassword;
      //Update Password & generate token
      await User.findByIdAndUpdate(changeUser._id, changeUser);
      res.status(200).json({ isChanged: true });
      return;
    } else {
      res.status(200).json({ isChanged: false });
      return;
    }
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ email });
    if (changeUser && changeUser.email === email) {
      //hash Password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      changeUser.password = hashedPassword;
      //Update Password & generate token
      await User.findByIdAndUpdate(changeUser._id, changeUser);
      res.status(200).json({ isChanged: true });
      return;
    }
    res.status(200).json({ isChanged: false });
    return;
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (err) {
    next(err);
  }
};

exports.spotAdd = async (req, res, next) => {
  const { spotId } = req.params;
  try {
    await Spot.findByIdAndUpdate(spotId, {
      $push: { users: req.user._id },
    });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { spots: spotId } },
      {
        new: true,
      }
    ).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (error) {
    next(error);
  }
};

exports.removeSpot = async (req, res, next) => {
  const { spotId } = req.params;
  try {
    await Spot.findByIdAndUpdate(
      { _id: spotId },
      {
        $pull: { users: req.user._id },
      }
    );

    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $pull: { spots: spotId },
      },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json(user);
    return;
  } catch (error) {
    next(error);
  }
};

exports.popularSave = async (req, res, next) => {
  const { popularId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { saved: popularId } },
      {
        new: true,
      }
    ).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (error) {
    next(error);
  }
};

exports.popularUnsave = async (req, res, next) => {
  const { popularId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $pull: { saved: popularId },
      },
      {
        new: true,
      }
    ).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (error) {
    next(error);
  }
};

exports.rewardAdd = async (req, res, next) => {
  const { rewardId } = req.params;
  try {
    await Reward.findByIdAndUpdate(rewardId, {
      $push: { users: req.user._id },
    });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { rewards: rewardId } },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json(user);
    return;
  } catch (error) {
    next(error);
  }
};
exports.generateOTP = async (req, res) => {
  const { email } = req.params;
  try {
    const minmum = 100000;
    const maxmum = 999999;
    const OTP = Math.floor(Math.random() * (maxmum - minmum + 1)) + minmum;
    const user = await User.findOne({ email });
    if (user && user.email === email) {
      // email("OTP", user.email, `Your Dest OTP`, `${OTP}`);
      res.status(200).json({ message: "User Found", OTP: OTP });
      return;
    }
    res.status(200).json({ message: "No User Found" });
    return;
  } catch (err) {
    res.status(500).json("Server Error");
    return;
  }
};

exports.getEmails = async (req, res) => {
  try {
    const emails = await User.find().select("email");
    res.status(201).json(emails);
    return;
  } catch (err) {
    res.status(500).json("Server Error");
    return;
  }
};

exports.addToken = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (err) {
    next(err);
  }
};

exports.removeToken = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (err) {
    next(err);
  }
};

exports.changeLocal = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (err) {
    next(err);
  }
};

exports.registerUser = async (req, res, next) => {
  const { organizerId } = req.params;
  try {
    await Organizer.findByIdAndUpdate(organizerId, {
      $push: { registerdUsers: req.user._id },
    });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { organizers: organizerId } },
      {
        new: true,
      }
    ).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (error) {
    next(error);
  }
};

exports.unRegisterUser = async (req, res, next) => {
  const { organizerId } = req.params;
  try {
    await Organizer.findByIdAndUpdate(organizerId, {
      $pull: { registerdUsers: req.user._id },
    });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { organizers: organizerId } },
      {
        new: true,
      }
    ).select("-password");
    const token = generateTokenUser(user);
    res.status(200).json({ token });
    return;
  } catch (error) {
    next(error);
  }
};

exports.goodByeForEver = async (req, res, next) => {
  const { delId } = req.params;
  try {
    await User.findByIdAndDelete(delId);
    res.status(200).json("deleted");
    return;
  } catch (error) {
    next(err);
  }
};
