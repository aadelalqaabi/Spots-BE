const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  code: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
  },
});

module.exports = mongoose.model("Code", CodeSchema);
