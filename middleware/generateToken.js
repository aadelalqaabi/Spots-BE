const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");

exports.generateTokenUser = (user) => {
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
    organizers: user.organizers,
    platform: user.platform
  };
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};
exports.generateTokenOrg = (organizer) => {
  const payload = {
    id: organizer.id,
    email: organizer.email,
    image: organizer.image,
    phone: organizer.phone,
    bio: organizer.bio,
    spots: organizer.spots,
    numofDests: organizer.numofDests,
    displayNameEn: organizer.displayNameEn,
    displayNameAr: organizer.displayNameAr,
    exp: Date.now() + JWT_EXPIRATION_MS,
  };
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};
