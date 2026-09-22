const Property = require('../models/Property');

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch properties.' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    return res.json(property);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch property.' });
  }
};

const createProperty = async (req, res) => {
  try {
    const { address, city, state, zipCode, parcelNumber, legalDescription, propertyType, squareFootage, bedrooms, bathrooms, yearBuilt, lotSize, notes } = req.body;

    if (!address || !city || !state) {
      return res.status(400).json({ message: 'Address, city, and state are required.' });
    }

    const property = await Property.create({
      address,
      city,
      state,
      zipCode,
      parcelNumber,
      legalDescription,
      propertyType,
      squareFootage,
      bedrooms,
      bathrooms,
      yearBuilt,
      lotSize,
      notes,
      createdBy: req.user.id
    });

    return res.status(201).json(property);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create property.' });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update property.' });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    await property.deleteOne();
    return res.json({ message: 'Property deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to delete property.' });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
};
