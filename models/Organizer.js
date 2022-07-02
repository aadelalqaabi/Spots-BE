const mongoose = require("mongoose");

const validateEmail = (email) => {
  var re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  return re.test(email);
};

const OrganizerSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: String,
  phone: String,
  image: String,
  bio: String,
  spots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spot",
    },
  ],
});

module.exports = mongoose.model("Organizer", OrganizerSchema);
