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
    const organizerObj = {
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    };
    await Organizer.create(organizerObj);
    console.log('password', password)
    organizerObj.password = password
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
      .select("-password");
    res.status(201).json(organizers);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getOrganizerDetails = async (req, res) => {
  try {
    const organizers = await Organizer.find({}, 'email phone')
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
  const { id, newPassword, currentPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await Organizer.findById(id);
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
  const { email } = req.params
  const saltRounds = 10;
  try {
    //find user
    const changeOrganizer = await Organizer.findOne({ email });
    if(changeOrganizer && changeOrganizer.email === email){
      //hash Password
      const newPassword = new Array(12)
        .fill()
        .map(() => String.fromCharCode(Math.random() * 86 + 40))
        .join("");
        console.log('newPassword', newPassword)
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      changeOrganizer.password = hashedPassword;
      const updatedOrg = await Organizer.findByIdAndUpdate(changeOrganizer._id, changeOrganizer);
      const organizerObj = {
          email: updatedOrg.email,
          password: newPassword,
          phone: updatedOrg.phone,
        };
        email(
            "Forget",
            organizerObj.email,
            `Dest Forget Password`,
            organizerObj
          );
      res.status(200).json({ message: "Password Generated" });
      return;
    }
    res.status(200).json({ message: "No Organizer Found" });
    return;
  } catch (err) {
    next(err);
  }
};

exports.addDests = async (req, res, next) => {
  const { numofDests, organizerEmail } = req.body;
  try {
    const organizer = await Organizer.findOne({ email: organizerEmail });
    if(organizer  && organizer.email === organizerEmail && req.user.email === "dest.kuwait@gmail.com"){
      const numb = organizer.numofDests + parseInt(numofDests);
      await Organizer.findByIdAndUpdate(organizer._id, {
        numofDests: numb,
      });
      res.status(200).json({ message: "Dests Added"});
      return;
    }
    res.status(200).json({ message: `No Account Associated to ${organizerEmail}`});
      return;
  } catch (err) {
    next(err);
  }
};
