const express = require('express');
const { protect } = require('../middleware/auth');
const { validateId, validateAppraisal } = require('../middleware/resourceValidation');
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
router.get('/:id', validateId, getAppraisalById);
router.post('/', validateAppraisal({ requireRequiredFields: true }), createAppraisal);
router.put('/:id', validateId, validateAppraisal(), updateAppraisal);
router.delete('/:id', validateId, deleteAppraisal);

module.exports = router;
