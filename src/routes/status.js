const { Router } = require('express');
const { getAppStatus } = require('../controllers/healthController');

const router = Router();

router.get('/', getAppStatus);

module.exports = router;
