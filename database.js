const mongoose = require("mongoose");
const { MONGODB_DATABASE } = require("./config/keys");

const connectDB = async () => {
  const conn = await mongoose.connect(MONGODB_DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
