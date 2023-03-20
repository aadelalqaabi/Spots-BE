const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: String,
  mssg: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Report", ReportSchema);