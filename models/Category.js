const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  image: String,
  spots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spot",
    },
  ],
});

module.exports = mongoose.model("Category", CategorySchema);
