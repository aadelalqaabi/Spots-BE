const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../config/keys");

const google = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://destkw.com/universal/user/login/google/callback",
};

exports.GoogleStrategy = new GoogleStrategy(
  google,
  async (accessToken, refreshToken, bearerToken, profile, done) => {
    done(null, user(profile));
  }
);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

const user = (profile) => {
  return {
    email: profile._json.email,
    email_verified: profile._json.email_verified,
    sub: profile._json.sub,
  };
};
