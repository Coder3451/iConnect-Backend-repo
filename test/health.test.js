import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../server/app.js';

test('GET /api/health returns ok payload', async () => {
  const app = createApp();
  const res = await request(app).get('/api/health');

  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.name, 'iConnect');
});

test('unknown API route returns 404 json', async () => {
  const app = createApp();
  const res = await request(app).get('/api/does-not-exist');

  assert.equal(res.status, 404);
  assert.equal(res.body.error, 'Not found');
});
