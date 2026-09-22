require('dotenv').config();

const config = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  JWT_SECRET: process.env.JWT_SECRET || 'development-secret',
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/appraisers-desk-loupe'
};

module.exports = config;
