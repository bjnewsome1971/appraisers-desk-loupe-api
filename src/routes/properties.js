const express = require('express');
const { protect } = require('../middleware/auth');
const { validateId, validateProperty } = require('../middleware/resourceValidation');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const router = express.Router();

router.use(protect);
router.get('/', getProperties);
router.get('/:id', validateId, getPropertyById);
router.post('/', validateProperty({ requireRequiredFields: true }), createProperty);
router.put('/:id', validateId, validateProperty(), updateProperty);
router.delete('/:id', validateId, deleteProperty);

module.exports = router;
