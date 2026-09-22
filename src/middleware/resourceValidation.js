const mongoose = require('mongoose');

const propertyTypes = ['single-family', 'condo', 'multi-family', 'commercial', 'land', 'other'];
const loanPurposes = ['purchase', 'refinance', 'estate', 'divorce', 'tax appeal', 'other'];
const appraisalStatuses = ['draft', 'in-progress', 'submitted', 'approved', 'rejected'];

const propertyFields = [
  'address', 'city', 'state', 'zipCode', 'parcelNumber', 'legalDescription',
  'propertyType', 'squareFootage', 'bedrooms', 'bathrooms', 'yearBuilt', 'lotSize', 'notes'
];

const appraisalFields = [
  'propertyAddress', 'propertyType', 'clientName', 'loanPurpose',
  'estimatedValue', 'status', 'notes'
];

const stringField = (value, field, maxLength = 500) => {
  if (typeof value !== 'string' || !value.trim()) {
    return `${field} must be a non-empty string.`;
  }

  if (value.trim().length > maxLength) {
    return `${field} must be ${maxLength} characters or fewer.`;
  }

  return null;
};

const optionalStringField = (value, field, maxLength = 500) => {
  if (value === undefined || value === null || value === '') return null;
  return stringField(value, field, maxLength);
};

const numberField = (value, field, minimum = 0) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum) {
    return `${field} must be a number greater than or equal to ${minimum}.`;
  }

  return null;
};

const optionalNumberField = (value, field, minimum = 0) => {
  if (value === undefined || value === null || value === '') return null;
  return numberField(value, field, minimum);
};

const rejectUnknownFields = (body, allowedFields) => {
  const unknownFields = Object.keys(body).filter((field) => !allowedFields.includes(field));
  return unknownFields.length ? `Unknown field(s): ${unknownFields.join(', ')}.` : null;
};

const validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid resource id.' });
  }

  return next();
};

const validateProperty = ({ requireRequiredFields = false } = {}) => (req, res, next) => {
  const body = req.body || {};
  const errors = [];
  const unknownError = rejectUnknownFields(body, propertyFields);

  if (unknownError) errors.push(unknownError);
  if (requireRequiredFields) {
    ['address', 'city', 'state'].forEach((field) => {
      if (body[field] === undefined) errors.push(`${field} is required.`);
    });
  }

  if (body.address !== undefined) errors.push(stringField(body.address, 'address', 200));
  if (body.city !== undefined) errors.push(stringField(body.city, 'city', 100));
  if (body.state !== undefined) {
    if (typeof body.state !== 'string' || !/^[A-Za-z]{2}$/.test(body.state.trim())) {
      errors.push('state must be a two-letter state abbreviation.');
    } else {
      body.state = body.state.trim().toUpperCase();
    }
  }
  if (body.zipCode !== undefined && !/^\d{5}(?:-\d{4})?$/.test(String(body.zipCode).trim())) {
    errors.push('zipCode must be a valid ZIP code.');
  }
  if (body.parcelNumber !== undefined) errors.push(optionalStringField(body.parcelNumber, 'parcelNumber', 100));
  if (body.legalDescription !== undefined) errors.push(optionalStringField(body.legalDescription, 'legalDescription', 2000));
  if (body.notes !== undefined) errors.push(optionalStringField(body.notes, 'notes', 5000));
  if (body.propertyType !== undefined && !propertyTypes.includes(body.propertyType)) {
    errors.push(`propertyType must be one of: ${propertyTypes.join(', ')}.`);
  }

  [['squareFootage', 0], ['bedrooms', 0], ['bathrooms', 0], ['yearBuilt', 1800], ['lotSize', 0]]
    .forEach(([field, minimum]) => {
      const error = optionalNumberField(body[field], field, minimum);
      if (error) errors.push(error);
    });

  if (errors.filter(Boolean).length) return res.status(400).json({ message: errors.filter(Boolean) });
  return next();
};

const validateAppraisal = ({ requireRequiredFields = false } = {}) => (req, res, next) => {
  const body = req.body || {};
  const errors = [];
  const unknownError = rejectUnknownFields(body, appraisalFields);

  if (unknownError) errors.push(unknownError);
  if (requireRequiredFields) {
    ['propertyAddress', 'clientName'].forEach((field) => {
      if (body[field] === undefined) errors.push(`${field} is required.`);
    });
  }

  if (body.propertyAddress !== undefined) errors.push(stringField(body.propertyAddress, 'propertyAddress', 200));
  if (body.clientName !== undefined) errors.push(stringField(body.clientName, 'clientName', 200));
  if (body.notes !== undefined) errors.push(optionalStringField(body.notes, 'notes', 5000));
  if (body.propertyType !== undefined && !propertyTypes.includes(body.propertyType)) {
    errors.push(`propertyType must be one of: ${propertyTypes.join(', ')}.`);
  }
  if (body.loanPurpose !== undefined && !loanPurposes.includes(body.loanPurpose)) {
    errors.push(`loanPurpose must be one of: ${loanPurposes.join(', ')}.`);
  }
  if (body.status !== undefined && !appraisalStatuses.includes(body.status)) {
    errors.push(`status must be one of: ${appraisalStatuses.join(', ')}.`);
  }

  const valueError = optionalNumberField(body.estimatedValue, 'estimatedValue', 0);
  if (valueError) errors.push(valueError);

  if (!Object.keys(body).length && !requireRequiredFields) errors.push('At least one field is required.');
  if (errors.filter(Boolean).length) return res.status(400).json({ message: errors.filter(Boolean) });
  return next();
};

module.exports = { validateId, validateProperty, validateAppraisal };
