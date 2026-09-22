const Appraisal = require('../models/Appraisal');

const getAppraisals = async (req, res) => {
  try {
    const appraisals = await Appraisal.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return res.json(appraisals);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch appraisals.' });
  }
};

const getAppraisalById = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found.' });
    }

    return res.json(appraisal);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch appraisal.' });
  }
};

const createAppraisal = async (req, res) => {
  try {
    const { propertyAddress, propertyType, clientName, loanPurpose, estimatedValue, status, notes } = req.body;

    if (!propertyAddress || !clientName) {
      return res.status(400).json({ message: 'Property address and client name are required.' });
    }

    const appraisal = await Appraisal.create({
      propertyAddress,
      propertyType,
      clientName,
      loanPurpose,
      estimatedValue,
      status,
      notes,
      createdBy: req.user.id
    });

    return res.status(201).json(appraisal);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create appraisal.' });
  }
};

const updateAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found.' });
    }

    const updated = await Appraisal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update appraisal.' });
  }
};

const deleteAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found.' });
    }

    await appraisal.deleteOne();
    return res.json({ message: 'Appraisal deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to delete appraisal.' });
  }
};

module.exports = {
  getAppraisals,
  getAppraisalById,
  createAppraisal,
  updateAppraisal,
  deleteAppraisal
};
