const { Router } = require('express');
const healthRoutes = require('./health');
const statusRoutes = require('./status');

const router = Router();

router.use('/health', healthRoutes);
router.use('/status', statusRoutes);

module.exports = router;
