const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/keys");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt/lib/extract_jwt");

exports.localStrategyUser = new LocalStrategy(
  // async (phone, password, done) => {
  async (username, password, done) => {
    let user = {};
    const isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi.test(username);
    try {
      if(isEmail){
        const email = username;
        user = await User.findOne({ email });
      } else{
        user = await User.findOne({ username });
      }
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
