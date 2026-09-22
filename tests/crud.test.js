const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const Property = require('../src/models/Property');
const Appraisal = require('../src/models/Appraisal');

const startServer = async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  return { server, port };
};

const stopServer = async (server) => {
  if (server) {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
};

const makeAuthHeaders = () => ({
  Authorization: 'Bearer valid-token'
});

test('GET /api/properties returns property list for the authenticated user', async () => {
  const originalFind = Property.find;
  const { server, port } = await startServer();

  try {
    Property.find = () => ({ sort: async () => [{ _id: 'prop-1', address: '123 Main St', city: 'Austin', state: 'TX' }] });

    const response = await fetch(`http://127.0.0.1:${port}/api/properties`, {
      headers: makeAuthHeaders()
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body), true);
    assert.equal(body[0].address, '123 Main St');
  } finally {
    Property.find = originalFind;
    await stopServer(server);
  }
});

test('POST /api/properties creates a property with valid input', async () => {
  const originalCreate = Property.create;
  const { server, port } = await startServer();

  try {
    Property.create = async (payload) => ({
      _id: 'prop-123',
      ...payload,
      createdBy: 'user-123'
    });

    const response = await fetch(`http://127.0.0.1:${port}/api/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...makeAuthHeaders()
      },
      body: JSON.stringify({
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        propertyType: 'single-family',
        squareFootage: 1800,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 2005,
        lotSize: 4000
      })
    });

    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.address, '123 Main St');
    assert.equal(body.state, 'TX');
  } finally {
    Property.create = originalCreate;
    await stopServer(server);
  }
});

test('POST /api/properties rejects invalid property payloads', async () => {
  const { server, port } = await startServer();

  const response = await fetch(`http://127.0.0.1:${port}/api/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...makeAuthHeaders()
    },
    body: JSON.stringify({
      address: '',
      city: '',
      state: 'TEXAS',
      propertyType: 'invalid'
    })
  });

  const body = await response.json();

  assert.equal(response.status, 400);
  assert.ok(Array.isArray(body.message));

  await stopServer(server);
});

test('GET /api/appraisals returns appraisal list for the authenticated user', async () => {
  const originalFind = Appraisal.find;
  const { server, port } = await startServer();

  try {
    Appraisal.find = () => ({ sort: async () => [{ _id: 'app-1', propertyAddress: '123 Main St', clientName: 'Jane Doe' }] });

    const response = await fetch(`http://127.0.0.1:${port}/api/appraisals`, {
      headers: makeAuthHeaders()
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body), true);
    assert.equal(body[0].clientName, 'Jane Doe');
  } finally {
    Appraisal.find = originalFind;
    await stopServer(server);
  }
});

test('POST /api/appraisals creates an appraisal with valid input', async () => {
  const originalCreate = Appraisal.create;
  const { server, port } = await startServer();

  try {
    Appraisal.create = async (payload) => ({
      _id: 'app-123',
      ...payload,
      createdBy: 'user-123'
    });

    const response = await fetch(`http://127.0.0.1:${port}/api/appraisals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...makeAuthHeaders()
      },
      body: JSON.stringify({
        propertyAddress: '123 Main St',
        propertyType: 'single-family',
        clientName: 'Jane Doe',
        loanPurpose: 'purchase',
        estimatedValue: 350000,
        status: 'draft',
        notes: 'Initial review notes.'
      })
    });

    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.propertyAddress, '123 Main St');
    assert.equal(body.clientName, 'Jane Doe');
  } finally {
    Appraisal.create = originalCreate;
    await stopServer(server);
  }
});

test('POST /api/appraisals rejects invalid appraisal payloads', async () => {
  const { server, port } = await startServer();

  const response = await fetch(`http://127.0.0.1:${port}/api/appraisals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...makeAuthHeaders()
    },
    body: JSON.stringify({
      propertyAddress: '',
      clientName: '',
      loanPurpose: 'not-real'
    })
  });

  const body = await response.json();

  assert.equal(response.status, 400);
  assert.ok(Array.isArray(body.message));

  await stopServer(server);
});
