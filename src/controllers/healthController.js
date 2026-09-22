const getHealthStatus = async (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};

const getAppStatus = async (req, res) => {
  res.json({
    app: "The Appraiser's Desk & Loupe API",
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    message: 'API ready for integration.'
  });
};

module.exports = {
  getHealthStatus,
  getAppStatus
};
