const Organizer = require("../../models/Organizer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");
const { email } = require("../../middleware/email");

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
      displayNameEn: organizer.displayNameEn,
      displayNameAr: organizer.displayNameAr,
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
    displayNameEn: organizer.displayNameEn,
    displayNameAr: organizer.displayNameAr,
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
    await Organizer.create(req.body);
    //TODO create a good email structure and test
    email(
      req.body.email,
      `Dest Application Accepted`,
      `Hello ${req.body.username}, Congratulations your Dest application has been accepted, go to this link <-- Dest LINK --> and use Username: ${req.body.username}, Password: ${password} to login 👍`
    );
    // const token = generateToken(newOrganizer);
    res.status(201).json("registered");
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

exports.changePassword = async (req, res, next) => {
  const { username, newPassword, currentPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await Organizer.findOne({ username });
    //Unhash Password
    const isMatch = await bcrypt.compare(currentPassword, changeUser.password);
    if (isMatch) {
      //hash Password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      changeUser.password = hashedPassword;
      //Update Password & generate token
      await Organizer.findByIdAndUpdate(changeUser._id, changeUser);
      res.status(200).json({ isChanged: true });
    } else {
      res.status(200).json({ isChanged: false });
    }
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { username } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ username });
    //hash Password
    const newPassword = new Array(12)
      .fill()
      .map(() => String.fromCharCode(Math.random() * 86 + 40))
      .join("");
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    changeUser.password = hashedPassword;
    //Update Password & generate token
    await User.findByIdAndUpdate(changeUser._id, changeUser);
    email(
      req.body.email,
      `Dest Password Change`,
      `Hello ${req.body.username}, your password has been changed, use this new Password: ${password} to login 👍`
    );
    res.status(204);
  } catch (err) {
    next(err);
  }
};
