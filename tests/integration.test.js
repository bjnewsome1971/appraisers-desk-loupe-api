const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const User = require('../src/models/User');

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

test('GET / returns API metadata', async () => {
  const { server, port } = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.name, "The Appraiser's Desk & Loupe API");
    assert.equal(body.status, 'running');
  } finally {
    await stopServer(server);
  }
});

test('GET /api/health returns healthy status', async () => {
  const { server, port } = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
  } finally {
    await stopServer(server);
  }
});

test('POST /api/auth/register creates a user and returns a token', async () => {
  const originalFindOne = User.findOne;
  const originalCreate = User.create;
  const originalHash = bcrypt.hash;
  const originalSign = jwt.sign;
  const { server, port } = await startServer();

  try {
    User.findOne = async () => null;
    User.create = async (payload) => ({
      _id: 'user-123',
      name: payload.name,
      email: payload.email,
      role: 'user'
    });
    bcrypt.hash = async () => 'hashed-password';
    jwt.sign = () => 'test-token';

    const response = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
        password: 'StrongPass1!'
      })
    });

    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.token, 'test-token');
    assert.equal(body.user.email, 'test@example.com');
    assert.equal(body.user.role, 'user');
  } finally {
    User.findOne = originalFindOne;
    User.create = originalCreate;
    bcrypt.hash = originalHash;
    jwt.sign = originalSign;
    await stopServer(server);
  }
});

test('POST /api/auth/login validates credentials and returns token', async () => {
  const originalFindOne = User.findOne;
  const originalCompare = bcrypt.compare;
  const originalSign = jwt.sign;
  const { server, port } = await startServer();

  try {
    User.findOne = async () => ({
      _id: 'user-123',
      name: 'Test',
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'user'
    });
    bcrypt.compare = async () => true;
    jwt.sign = () => 'login-token';

    const response = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'StrongPass1!'
      })
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.token, 'login-token');
    assert.equal(body.user.email, 'test@example.com');
  } finally {
    User.findOne = originalFindOne;
    bcrypt.compare = originalCompare;
    jwt.sign = originalSign;
    await stopServer(server);
  }
});

test('GET /api/auth/me returns current user with a valid bearer token', async () => {
  const originalFindById = User.findById;
  const originalVerify = jwt.verify;
  const { server, port } = await startServer();

  try {
    jwt.verify = () => ({ id: 'user-123', role: 'user' });
    User.findById = () => ({
      select: async () => ({
        _id: 'user-123',
        name: 'Test',
        email: 'test@example.com',
        role: 'user'
      })
    });

    const response = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer valid-token'
      }
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.email, 'test@example.com');
    assert.equal(body.role, 'user');
  } finally {
    User.findById = originalFindById;
    jwt.verify = originalVerify;
    await stopServer(server);
  }
});

test('POST /api/auth/register rejects invalid payloads', async () => {
  const { server, port } = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: 'invalid',
        password: 'weak'
      })
    });

    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.message);
  } finally {
    await stopServer(server);
  }
});
