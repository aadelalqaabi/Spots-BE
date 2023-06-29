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
});

module.exports = mongoose.model("Popular", PopularSchema);
