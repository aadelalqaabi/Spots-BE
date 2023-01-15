const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  description: String,
  descriptionAr: String,
  title: String,
  titleAr: String,
  image: String,
  points: Number,
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot",
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
    },
  ],
});

module.exports = mongoose.model("Reward", RewardSchema);
