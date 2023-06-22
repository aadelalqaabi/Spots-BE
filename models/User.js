const mongoose = require("mongoose");
const Organizer = require("./Organizer");

const validateEmail = (email) => {
  var re =
    /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  phone: String,
  email: {
    type: String,
    required: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "Please fill a valid email address",
    ],
    unique: true,
  },
  image: { type: String, default: "/uploads/default.png" },
  spots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spot",
    },
  ],
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  rewards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
    },
  ],
  notificationToken: { type: String, default: "" },
  locale: { type: String, default: "" },
  organizers: [
    {
      type: String,
    },
  ],
  platform: { type: String, default: "" },
  saved: Array,
});

module.exports = mongoose.model("User", UserSchema);
