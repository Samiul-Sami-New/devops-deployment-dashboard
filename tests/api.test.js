const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

const app = createApp();

test('GET /health reports healthy', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('GET /api/status returns runtime information', async () => {
  const response = await request(app).get('/api/status');
  assert.equal(response.status, 200);
  assert.equal(response.body.data.application, 'DevOps Deployment Dashboard');
  assert.equal(response.body.data.status, 'operational');
  assert.equal(typeof response.body.data.version, 'string');
  assert.equal(typeof response.body.data.environment, 'string');
  assert.equal(typeof response.body.data.uptimeSeconds, 'number');
  assert.ok(Number.isFinite(Date.parse(response.body.data.timestamp)));
});

test('unknown routes return a safe 404 error', async () => {
  const response = await request(app).get('/missing');
  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'NOT_FOUND');
});
