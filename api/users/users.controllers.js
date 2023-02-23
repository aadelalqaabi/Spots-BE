const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/keys");
const Spot = require("../../models/Spot");
const Reward = require("../../models/Reward");
const { countDocuments } = require("../../models/Reward");
const { email } = require("../../middleware/email");
const Organizer = require("../../models/Organizer");

exports.login = async (req, res, next) => {
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
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    spots: user.spots,
    tickets: user.tickets,
    rewards: user.rewards,
    notificationToken: user.notificationToken,
    locale: user.locale,
    organizers: user.organizers
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
      // username: req.body.username,
      name: req.body.name,
    };
    const newUser = await User.create(newObject);
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
  const { email, newPassword, currentPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ email });
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
  const { email, newPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ email });
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
    const token = generateToken(user);
    res.status(200).json({ token });
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
    const token = generateToken(user)
    res.status(200).json({ token });
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
    res.status(200).json(OTP);
    email("OTP", "adelalqaapi@gmail.com", `Your Dest OTP`, `${OTP}`);
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

exports.addToken = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.removeToken = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.changeLocal = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    const token = generateToken(user);
    res.status(200).json({ token });
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
    const token = generateToken(user);
    res.status(200).json({ token });
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
      const token = generateToken(user);
      res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
