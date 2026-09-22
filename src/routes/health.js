const { Router } = require('express');
const { getHealthStatus, getAppStatus } = require('../controllers/healthController');

const router = Router();

router.get('/health', getHealthStatus);
router.get('/status', getAppStatus);

module.exports = router;
