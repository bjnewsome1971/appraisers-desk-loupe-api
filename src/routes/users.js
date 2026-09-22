const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { getUsers, getUserById } = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUserById);

module.exports = router;
