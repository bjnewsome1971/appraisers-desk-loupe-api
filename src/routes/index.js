const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.get('/status', (req, res) => {
  res.json({
    app: "The Appraiser's Desk & Loupe API",
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

module.exports = router;
