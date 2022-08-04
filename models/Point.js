const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Point", PointSchema);
