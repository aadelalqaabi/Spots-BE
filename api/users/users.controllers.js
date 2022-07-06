const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");
const Spot = require("../../models/Spot");

exports.login = async (req, res, next) => {
  try {
    const { user } = req;
    const token = generateToken(user);
    console.log("JWT_SECRET: "+JWT_SECRET);
    console.log("JWT_EXPIRATION_MS: "+JWT_EXPIRATION_MS);
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
    image: user.image,
    spots: user.spots,
    exp: Date.now() + JWT_EXPIRATION_MS,
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
    const newUser = await User.create(req.body);
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
