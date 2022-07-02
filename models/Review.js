const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  stars: String,
  description: String,
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot",
  },
});

module.exports = mongoose.model("Review", ReviewSchema);