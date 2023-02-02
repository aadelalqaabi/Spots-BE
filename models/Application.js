const mongoose = require("mongoose");

const validateEmail = (email) => {
  var re = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
};

const ApplicationSchema = new mongoose.Schema({
  username: {type: String, unique: true},
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
  phone: String,
  instagram: String,
});

module.exports = mongoose.model("Application", ApplicationSchema);
