const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  amount: Number,
  image: String,
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isFree: Boolean,
});

module.exports = mongoose.model("Ticket", TicketSchema);
