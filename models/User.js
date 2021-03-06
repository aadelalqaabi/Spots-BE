const mongoose = require("mongoose");

const validateEmail = (email) => {
  var re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  email: {
    type: String,
    required: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/,
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
});

module.exports = mongoose.model("User", UserSchema);
