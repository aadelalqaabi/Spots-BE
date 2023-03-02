const Organizer = require("../../models/Organizer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/keys");
const { email } = require("../../middleware/email");
const { generateTokenOrg } = require("../../middleware/generateToken");

exports.login = async (req, res, next) => {
  try {
    const organizer = req.user;
    const token = generateTokenOrg(organizer);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.sendOrgToken = (req, res, next) => {
  try {
    const organizer = req.user;
    const token = generateTokenOrg(organizer);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
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
    const organizerObj = req.body;
    organizerObj.password = password;
    email(
      "register",
      req.body.email,
      `Dest Application Accepted`,
      organizerObj
    );
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
    const token = generateTokenOrg(organizer);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const { email, newPassword, currentPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await Organizer.findOne({ email });
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
  const { email } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ email });
    //hash Password
    const newPassword = new Array(12)
      .fill()
      .map(() => String.fromCharCode(Math.random() * 86 + 40))
      .join("");
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    changeUser.password = hashedPassword;
    //Update Password & generate token
    await User.findByIdAndUpdate(changeUser._id, changeUser);
    // email(
    //   req.body.email,
    //   `Dest Password Change`,
    //   `Hello ${req.body.username}, your password has been changed, use this new Password: ${password} to login 👍`
    // );
    res.status(204);
  } catch (err) {
    next(err);
  }
};

exports.addDests = async (req, res, next) => {
  // TODO ==> add a page were organizers send in moreDests requests ==> in admin side create a moreDest
  // request page where you take in all requests from organizers and show them in list with a button that adds in the needed amount of dest
  // This contains one problem, we need to figure out a way to recieve payments
  const { numofDests, organizerEmail } = req.body;
  console.log("req.body", req.body);
  try {
    // await Organizer.findOneAndUpdate({ username: oranizerUsername }, { numofDests: numofDests })
    const organizer = await Organizer.findOne({ organizerEmail });
    await Organizer.findByIdAndUpdate(organizer._id, {
      numofDests: numofDests,
    });
    res.status(200).json("Dests Added");
  } catch (err) {
    next(err);
  }
};
