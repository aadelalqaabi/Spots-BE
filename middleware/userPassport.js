const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/keys");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt/lib/extract_jwt");

exports.localStrategyUser = new LocalStrategy(async (username, password, done) => {
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

exports.jwtStrategyUser = new JWTStrategy(
  { jwtFromRequest: fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET },
  async (jwtPayload, done) => {
    console.log("here");
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
