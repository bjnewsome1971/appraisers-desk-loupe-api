const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    app: "The Appraiser's Desk & Loupe API",
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
