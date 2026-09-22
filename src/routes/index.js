const { Router } = require('express');
const healthRoutes = require('./health');
const statusRoutes = require('./status');
const authRoutes = require('./auth');
const appraisalsRoutes = require('./appraisals');
const propertiesRoutes = require('./properties');
const usersRoutes = require('./users');

const router = Router();

router.use('/health', healthRoutes);
router.use('/status', statusRoutes);
router.use('/auth', authRoutes);
router.use('/appraisals', appraisalsRoutes);
router.use('/properties', propertiesRoutes);
router.use('/users', usersRoutes);

module.exports = router;
