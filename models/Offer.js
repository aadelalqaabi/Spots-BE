const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  description: String,
  title: String,
  image: String,
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot",
  },
});

module.exports = mongoose.model("Offer", OfferSchema);
