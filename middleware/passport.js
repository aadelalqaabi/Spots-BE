const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/keys");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt/lib/extract_jwt");
const Organizer = require("../models/Organizer");

exports.userStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    let isMatch = true;
    if (user) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = false;
    }
    if (isMatch) return done(null, user);
    else return done(null, false);
  } catch (error) {
    done(error);
  }
});

exports.organizerStrategy = new LocalStrategy(
  async (username, password, done) => {
    try {
      const organizer = await Organizer.findOne({ username });
      let isMatch = true;
      if (organizer) {
        isMatch = await bcrypt.compare(password, organizer.password);
      } else {
        isMatch = false;
      }
      if (isMatch) {
        console.log(organizer);
        return done(null, organizer);
      } else return done(null, false);
    } catch (error) {
      done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  { jwtFromRequest: fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false);
    }
    try {
      const user = await User.findById(jwtPayload.id);
      //const user = await User.findById(jwtPayload.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
