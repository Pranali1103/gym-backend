const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

// 

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  isConnected = true;
  logger.info("Connected to MongoDB (Serverless)");
}

module.exports.handler = async (event, context) => {
  await connectToDatabase();
  return serverless(app)(event, context);
};