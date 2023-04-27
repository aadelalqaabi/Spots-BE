const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  if (process.env.NODE_ENV === 'development') {
    await connectToDevDatabase();
  }

  if (process.env.NODE_ENV === 'production') {
    await connectToProdDatabase();
  }
};

const connectToDevDatabase = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_DATABASE_DEV, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log(`Development mongo connected: ${conn.connection.host}`);
};

const connectToProdDatabase = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_DATABASE_PROD, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log(`Production mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
