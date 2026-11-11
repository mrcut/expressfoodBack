const mongoose = require("mongoose");

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!process.env.DB_URL) {
    const error = new Error("Database configuration is missing");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.DB_URL, {
      dbName: "ExpressFood",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    }).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  return connectionPromise;
}

module.exports = connectDatabase;
