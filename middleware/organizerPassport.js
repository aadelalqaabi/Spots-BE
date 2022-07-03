const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const Organizer = require("../models/Organizer");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/keys");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt/lib/extract_jwt");

exports.localStrategyOrg = new LocalStrategy(async (username, password, done) => {
  console.log("hello");
    try {
      const organizer = await Organizer.findOne({ username });
      let isMatch = true;
      if (organizer) {
        isMatch = await bcrypt.compare(password, organizer.password);
      } else {
        isMatch = false;
      }
      if (isMatch)
        return done(null, organizer);
      else return done(null, false);
    } catch (error) {
      done(error);
    }
  }
);

exports.jwtStrategyOrg = new JWTStrategy(
  { jwtFromRequest: fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false);
    }
    try {
      const organizer = await Organizer.findById(jwtPayload.id);
      //const user = await User.findById(jwtPayload.id);
      done(null, organizer);
    } catch (error) {
      done(error);
    }
  }
);
