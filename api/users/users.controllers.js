const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");
const Spot = require("../../models/Spot");
const Reward = require("../../models/Reward");

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
    username: user.username,
    email: user.email,
    phone: user.phone,
    image: user.image,
    spots: user.spots,
    tickets: user.tickets,
    rewards: user.rewards,
    // exp: Date.now() + JWT_EXPIRATION_MS,
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

exports.changePassword = async (req, res, next) => {
  const { username, newPassword, currentPassword } = req.body;
  const saltRounds = 10;
  try {
    //find user
    const changeUser = await User.findOne({ username });
    //Unhash Password
    const isMatch = await bcrypt.compare(currentPassword, changeUser.password)
    if(isMatch){
      //hash Password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      changeUser.password = hashedPassword;
      //Update Password & generate token 
      await User.findByIdAndUpdate(changeUser._id, changeUser)
      res.status(200).json({ isChanged: true });
    }else{
      res.status(200).json({ isChanged: false })
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
    await User.findByIdAndUpdate(changeUser._id, changeUser)
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
    res.status(200).json(OTP);

      // const emailContent = {
      //   to_name: "I'm Just testing",
      //   message: `You forgot your password huh, well hers your OTP ==>  ${OTP}, now just type this in and proceed  `,
      //   to_email: "ab.test.task@gmail.com",
      // };
      // emailjs.init("0CGPMjHzm16JAhRPl");
      // // emailjs.accessToken("nHQDJbHUos1qKT50oPIoG")
  
      // emailjs.send("AB-Serv-12", "template_uma67do", emailContent);
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
