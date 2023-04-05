const mongoose = require("mongoose");

const PushNotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  locale: { type: String, required: true },
  spot: { type: String, default: "", required: true },
});

module.exports = mongoose.model("PushNotification", PushNotificationSchema);
