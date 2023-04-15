const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  image: String,
  adImage0: String,
  adImage1: String,
  adImage2: String,
  adImage3: String,
  adImage4: String,
  galleryImage0: String,
  galleryImage1: String,
  galleryImage2: String,
  galleryImage3: String,
  galleryImage4: String,
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
  announcementEn: String,
  announcementAr: String,
  isAd: Boolean,
  views: { type: Number, default: 0 },
  startTime: String,
  endTime: String,
  scanned: Number,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
  },
  isFree: { type: Boolean, default: "true" },
  isPublished: { type: Boolean, default: "false" },
  spotDate: {
    year: Number,
    month: Number,
    day: Number,
  },
  startDate: { type: Date, default: Date.now() },
  endDate: Date,
  isMultiple: { type: Boolean, default: "false" },
  seats: Number,
  seatsRemaining: Number,
  addSeats: { type: Number, default: 1 },
  numOfDays: { type: Number, default: 1 },
  days: [],
  price: Number,
  spotRevenue: Number,
  termsAndConditionsRewardsEn: String,
  termsAndConditionsRewardsAr: String,
  termsAndConditionsOffersEn: String,
  termsAndConditionsOfferssAr: String,
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
