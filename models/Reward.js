const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  description: String,
  title: String,
  image: String,
  points: Number,
  // isMultiClaim: { type: Boolean, default: true },
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
