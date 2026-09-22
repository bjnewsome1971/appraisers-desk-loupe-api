const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 2
    },
    zipCode: {
      type: String,
      trim: true
    },
    parcelNumber: {
      type: String,
      trim: true
    },
    legalDescription: {
      type: String,
      default: ''
    },
    propertyType: {
      type: String,
      enum: ['single-family', 'condo', 'multi-family', 'commercial', 'land', 'other'],
      default: 'single-family'
    },
    squareFootage: {
      type: Number,
      min: 0
    },
    bedrooms: {
      type: Number,
      min: 0
    },
    bathrooms: {
      type: Number,
      min: 0
    },
    yearBuilt: {
      type: Number,
      min: 1800
    },
    lotSize: {
      type: Number,
      min: 0
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

module.exports = mongoose.model('Property', propertySchema);
