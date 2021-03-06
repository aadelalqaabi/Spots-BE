const Organizer = require("../../models/Organizer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");

exports.login = async (req, res, next) => {
  try {
    const organizer = req.user;
    const payload = {
      id: organizer.id,
      username: organizer.username,
      email: organizer.email,
      image: organizer.image,
      phone: organizer.phone,
      bio: organizer.bio,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(payload, JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

const generateToken = (organizer) => {
  const payload = {
    id: organizer.id,
    username: organizer.username,
    email: organizer.email,
    image: organizer.image,
    phone: organizer.phone,
    bio: organizer.bio,
    spots: organizer.spots,
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
    const newOrganizer = await Organizer.create(req.body);
    const token = generateToken(newOrganizer);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find()
      .populate("spots")
      .select("-password");
    res.status(201).json(organizers);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.fetchOrganizer = async (organizerId, next) => {
  try {
    const organizer = await Organizer.findById(organizerId);
    return organizer;
  } catch (err) {
    next(err);
  }
};

exports.updateOrganizer = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    const organizer = await Organizer.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json(organizer);
  } catch (err) {
    next(err);
  }
};
