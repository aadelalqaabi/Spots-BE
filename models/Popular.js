const mongoose = require("mongoose");

const PopularSchema = new mongoose.Schema({
  title: String,
  titleAr: String,
  category: String,
  categoryAr: String,
  image: String,
  instagram: String,
});

module.exports = mongoose.model("Popular", PopularSchema);
