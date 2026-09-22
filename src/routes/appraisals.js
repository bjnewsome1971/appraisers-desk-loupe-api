const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getAppraisals,
  getAppraisalById,
  createAppraisal,
  updateAppraisal,
  deleteAppraisal
} = require('../controllers/appraisalController');

const router = express.Router();

router.use(protect);
router.get('/', getAppraisals);
router.get('/:id', getAppraisalById);
router.post('/', createAppraisal);
router.put('/:id', updateAppraisal);
router.delete('/:id', deleteAppraisal);

module.exports = router;
