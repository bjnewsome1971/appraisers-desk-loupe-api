const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { NODE_ENV } = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware');
const { swaggerUi, openapiDocument } = require('./swagger');

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.get('/openapi.json', (req, res) => res.json(openapiDocument));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
