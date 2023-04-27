const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");
require('dotenv').config();
const { fromAuthHeaderAsBearerToken } = require("passport-jwt/lib/extract_jwt");

exports.localStrategyUser = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
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
  }
);

exports.jwtStrategyUser = new JWTStrategy(
  { jwtFromRequest: fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false);
    }
    try {
      const user = await User.findById(jwtPayload.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
