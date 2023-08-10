const mongoose = require("mongoose");

const PopularSchema = new mongoose.Schema({
  title: String,
  titleAr: String,
  category: String,
  categoryAr: String,
  description: String,
  descriptionAr: String,
  image: String,
  instagram: String,
  website: String,
  saves: { type: Number, default: 0 },
  expired: { type: Boolean, default: false }
});

module.exports = mongoose.model("Popular", PopularSchema);
