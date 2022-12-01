const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
} = require("../../config/keys");
const Spot = require("../../models/Spot");
const Reward = require("../../models/Reward");
const { countDocuments } = require("../../models/Reward");
const {email} = require("../../middleware/email")

exports.login = async (req, res, next) => {
  console.log("req", req.body);
  try {
    const { user } = req;
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    image: user.image,
    spots: user.spots,
    tickets: user.tickets,
    rewards: user.rewards,
  };
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};

exports.register = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
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
      username: req.body.username,
    };
    console.log("after", newObject);
    const newUser = await User.create(newObject);
    console.log("newUser", newUser);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("spots").select("-password");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
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
  const { username, newPassword, currentPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ username });
    //Unhash Password
    const isMatch = await bcrypt.compare(currentPassword, changeUser.password);
    if (isMatch) {
      //hash Password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      changeUser.password = hashedPassword;
      //Update Password & generate token
      await User.findByIdAndUpdate(changeUser._id, changeUser);
      res.status(200).json({ isChanged: true });
    } else {
      res.status(200).json({ isChanged: false });
    }
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { username, newPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ username });
    //hash Password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    changeUser.password = hashedPassword;
    //Update Password & generate token
    await User.findByIdAndUpdate(changeUser._id, changeUser);
    res.status(204);
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
    res.status(200).json(user);
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
    res.status(200).json(user);
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
  } catch (error) {
    next(error);
  }
};

exports.generateOTP = async (req, res) => {
  try {
    const minmum = 100000;
    const maxmum = 999999;
    const OTP = Math.floor(Math.random() * (maxmum - minmum + 1)) + minmum;
    res.status(200).json(OTP)
    // adelalqaapi1998@gmail.com
    email("", `Your Dest OTP`, `Here is your OTP ${OTP}, also text me when you receive these just so that i know its working 👍 😅`)
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsernames = async (req, res) => {
  try {
    const usernames = await User.find().select("username");
    res.status(201).json(usernames);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
exports.getEmails = async (req, res) => {
  try {
    const emails = await User.find().select("email");
    res.status(201).json(emails);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
