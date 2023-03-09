const mongoose = require("mongoose");

const ForgetOrganizerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: Number
});

module.exports = mongoose.model("ForgetOrganizer", ForgetOrganizerSchema);
