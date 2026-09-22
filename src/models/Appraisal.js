const mongoose = require('mongoose');

const appraisalSchema = new mongoose.Schema(
  {
    propertyAddress: {
      type: String,
      required: true,
      trim: true
    },
    propertyType: {
      type: String,
      enum: ['single-family', 'condo', 'multi-family', 'commercial', 'land', 'other'],
      default: 'single-family'
    },
    clientName: {
      type: String,
      required: true,
      trim: true
    },
    loanPurpose: {
      type: String,
      enum: ['purchase', 'refinance', 'estate', 'divorce', 'tax appeal', 'other'],
      default: 'purchase'
    },
    estimatedValue: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'in-progress', 'submitted', 'approved', 'rejected'],
      default: 'draft'
    },
    notes: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appraisal', appraisalSchema);
