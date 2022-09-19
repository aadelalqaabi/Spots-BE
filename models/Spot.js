const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  image: String,
  video: String,
  location: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: String,
  descriptionAr: String,
  details: String,
  detailsAr: String,
  announcement: String,
  startTime: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
  },
  isFree: { type: Boolean, default: "true" },
  spotDate: {
    year: Number,
    month: Number,
    day: Number,
  },
  startDate: { type: Date, default: Date.now() },
  endDate: Date,
  seats: Number,
  addSeats: { type: Number, default: 1 },
  numOfDays: { type: Number, default: 1 },
  days: [],
  price: Number,
  spotRevenue: { type: Number, default: 0 },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  offers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
    },
  ],
  rewards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Spot", SpotSchema);
