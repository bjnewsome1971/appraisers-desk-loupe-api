const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { NODE_ENV, APP_URL, CLIENT_URL } = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware');
const { swaggerUi, openapiDocument } = require('./swagger');

const app = express();

const allowedOrigins = [APP_URL, CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000']
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.get('/openapi.json', (req, res) => res.json(openapiDocument));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
