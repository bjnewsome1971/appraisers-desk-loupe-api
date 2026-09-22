require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET?.trim();

if (!jwtSecret) {
  throw new Error(
    'JWT_SECRET is required. Set a strong JWT_SECRET environment variable before starting the server.'
  );
}

const config = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  JWT_SECRET: jwtSecret,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/appraisers-desk-loupe'
};

module.exports = config;
