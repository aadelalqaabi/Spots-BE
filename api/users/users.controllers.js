const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");

exports.login = async (req, res, next) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
      spots: user.spots,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(payload, JWT_SECRET);
    res.status(201).json({ token });
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
    const users = await User.find();
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
