const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  code: String,
});

module.exports = mongoose.model("Code", CodeSchema);
