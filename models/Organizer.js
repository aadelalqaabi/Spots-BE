const mongoose = require("mongoose");

const validateEmail = (email) => {
  var re =
    /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
};

const OrganizerSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  displayNameEn: String,
  displayNameAr: String,
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
