// config/db.js
// Establishes and exports the MongoDB connection using Mongoose.
// Called once from server.js on startup. Keeping this isolated means
// every controller/model can just `require('mongoose')` without caring
// about how or when the connection was opened.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Fail fast: an API with no database connection should not stay up
    // pretending to work.
    process.exit(1);
  }
};

module.exports = connectDB;
