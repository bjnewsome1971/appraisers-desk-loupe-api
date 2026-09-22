const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: "The Appraiser's Desk & Loupe API",
    status: 'running',
    message: 'Welcome to the API backend.'
  });
});

app.use('/api', require('./routes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
