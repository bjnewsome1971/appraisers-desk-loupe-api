const { Router } = require('express');
const healthRoutes = require('./health');
const statusRoutes = require('./status');
const authRoutes = require('./auth');

const router = Router();

router.use('/health', healthRoutes);
router.use('/status', statusRoutes);
router.use('/auth', authRoutes);

module.exports = router;
