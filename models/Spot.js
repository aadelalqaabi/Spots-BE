const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema({
  name: String,
  image: String,
  video: String,
  location: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: String,
  details: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
  },
  isFree: { type: Boolean, default: "true" },
  startTime: String,
  spotDate: {
    year: Number,
    month: Number,
    day: Number,
  },
  startDate: {type: Date, default:Date.now()},
  endDate: Date,
  seats: Number,
  numOfDays: { type: Number, default: 1 },
  days: Array,
  price: Number,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
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
