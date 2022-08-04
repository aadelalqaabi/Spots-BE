const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  description: String,
  title: String,
  image: String,
  points: Number,
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot",
  },
});

module.exports = mongoose.model("Reward", RewardSchema);
