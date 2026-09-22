const test = require('node:test');
const assert = require('node:assert/strict');

const { validateRegister, validateLogin } = require('../src/middleware/validate');
const { validateId, validateProperty, validateAppraisal } = require('../src/middleware/resourceValidation');
const { isValidEmail, isStrongPassword } = require('../src/utils/validation');

const makeRes = () => ({
  statusCode: null,
  payload: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.payload = payload;
    return this;
  }
});

test('isValidEmail accepts valid addresses and rejects invalid ones', () => {
  assert.equal(isValidEmail('user@example.com'), true);
  assert.equal(isValidEmail('bad-email'), false);
  assert.equal(isValidEmail(''), false);
});

test('isStrongPassword requires length and complexity', () => {
  assert.equal(isStrongPassword('StrongPass1!'), true);
  assert.equal(isStrongPassword('weakpass'), false);
  assert.equal(isStrongPassword('StrongPass1'), false);
});

test('validateRegister accepts valid payloads', () => {
  let called = false;
  const req = { body: { name: 'Test User', email: 'test@example.com', password: 'StrongPass1!' } };
  const res = makeRes();

  validateRegister(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.statusCode, null);
});

test('validateRegister rejects invalid registration payloads', () => {
  let called = false;
  const req = { body: { name: '', email: 'invalid', password: 'weak' } };
  const res = makeRes();

  validateRegister(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
});

test('validateLogin accepts valid credentials', () => {
  let called = false;
  const req = { body: { email: 'test@example.com', password: 'StrongPass1!' } };
  const res = makeRes();

  validateLogin(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.statusCode, null);
});

test('validateLogin rejects missing fields', () => {
  let called = false;
  const req = { body: { email: 'invalid', password: '' } };
  const res = makeRes();

  validateLogin(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
});

test('validateId accepts a valid MongoDB ObjectId', () => {
  let called = false;
  const req = { params: { id: '507f1f77bcf86cd799439011' } };
  const res = makeRes();

  validateId(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
});

test('validateId rejects an invalid MongoDB ObjectId', () => {
  let called = false;
  const req = { params: { id: 'invalid-id' } };
  const res = makeRes();

  validateId(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
});

test('validateProperty accepts a valid property payload', () => {
  let called = false;
  const req = {
    body: {
      address: '123 Main St',
      city: 'Austin',
      state: 'tx',
      zipCode: '78701',
      propertyType: 'single-family',
      squareFootage: 1800,
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 2005,
      lotSize: 4000
    }
  };
  const res = makeRes();

  validateProperty({ requireRequiredFields: true })(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(req.body.state, 'TX');
});

test('validateProperty rejects bad enum values or payloads', () => {
  let called = false;
  const req = { body: { address: '123 Main St', city: 'Austin', state: 'TX', propertyType: 'invalid' } };
  const res = makeRes();

  validateProperty({ requireRequiredFields: true })(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
});

test('validateAppraisal accepts a valid appraisal payload', () => {
  let called = false;
  const req = {
    body: {
      propertyAddress: '123 Main St',
      propertyType: 'single-family',
      clientName: 'Jane Doe',
      loanPurpose: 'purchase',
      estimatedValue: 350000,
      status: 'draft',
      notes: 'Initial review notes.'
    }
  };
  const res = makeRes();

  validateAppraisal({ requireRequiredFields: true })(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
});

test('validateAppraisal rejects invalid appraisal enums', () => {
  let called = false;
  const req = {
    body: {
      propertyAddress: '123 Main St',
      clientName: 'Jane Doe',
      loanPurpose: 'not-a-real-purpose'
    }
  };
  const res = makeRes();

  validateAppraisal({ requireRequiredFields: true })(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
});
