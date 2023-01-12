const passport = require("passport");
const {
  APPLE_KEY_TEAM,
  APPLE_KEY_ID,
  APPLE_BUNDLE_ID,
} = require("../config/keys");
const AppleStrategy = require("passport-appleid").Strategy;
const path = require("path");

exports.AppleStrategy = new AppleStrategy(
  {
    clientID: APPLE_BUNDLE_ID,
    callbackURL: "https://destkw.com/api/auth/apple/callback",
    teamId: APPLE_KEY_TEAM,
    keyIdentifier: APPLE_KEY_ID,
    privateKeyPath: path.join(__dirname, "./AuthKey_5TJZX4BHLC.p8"),
  },
  function (accessToken, refreshToken, profile, done) {
    const id = profile.id;
    console.log(profile);
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
