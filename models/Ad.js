const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
  spot:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spot",
    },
});

module.exports = mongoose.model("Ad", AdSchema);
