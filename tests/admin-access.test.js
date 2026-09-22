const test = require('node:test');
const assert = require('node:assert/strict');
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

test('GET /api/users rejects non-admin users with 403', async () => {
  const originalVerify = jwt.verify;
  const originalFind = User.find;
  const { server, port } = await startServer();

  try {
    jwt.verify = () => ({ id: 'user-123', role: 'user' });
    User.find = () => ({
      select: () => ({
        sort: async () => [{ _id: 'user-123', email: 'user@example.com', role: 'user' }]
      })
    });

    const response = await fetch(`http://127.0.0.1:${port}/api/users`, {
      headers: { Authorization: 'Bearer valid-token' }
    });

    const body = await response.json();

    assert.equal(response.status, 403);
    assert.equal(body.message, 'You do not have permission to access this resource.');
  } finally {
    jwt.verify = originalVerify;
    User.find = originalFind;
    await stopServer(server);
  }
});

test('GET /api/users allows admin users with 200', async () => {
  const originalVerify = jwt.verify;
  const originalFind = User.find;
  const { server, port } = await startServer();

  try {
    jwt.verify = () => ({ id: 'admin-123', role: 'admin' });
    User.find = () => ({
      select: () => ({
        sort: async () => [{ _id: 'admin-123', email: 'admin@example.com', role: 'admin' }]
      })
    });

    const response = await fetch(`http://127.0.0.1:${port}/api/users`, {
      headers: { Authorization: 'Bearer valid-token' }
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body), true);
    assert.equal(body[0].role, 'admin');
  } finally {
    jwt.verify = originalVerify;
    User.find = originalFind;
    await stopServer(server);
  }
});
