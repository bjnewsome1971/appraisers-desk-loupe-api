const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { NODE_ENV } = require('./config');
const { connectDB } = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => {
  res.json({
    name: "The Appraiser's Desk & Loupe API",
    status: 'running',
    message: 'Welcome to the API backend.'
  });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

connectDB();

module.exports = app;
