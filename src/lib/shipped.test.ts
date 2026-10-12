import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyStatus, shippedFor } from './shipped.ts';

const t = { repo: 'todo-web', issue: 88, product: 'Todo', label: 'Upcoming view', shippedAt: null };

test('only issues closed as completed mark a feature shipped, and it stays shipped', () => {
  assert.equal(applyStatus(t, { state: 'open' }).shippedAt, null);
  assert.equal(applyStatus(t, { state: 'closed', state_reason: 'not_planned', closed_at: '2026-10-20T00:00:00Z' }).shippedAt, null);
  const done = applyStatus(t, { state: 'closed', state_reason: 'completed', closed_at: '2026-10-20T08:00:00Z' });
  assert.equal(done.shippedAt, '2026-10-20');
  assert.equal(applyStatus(done, { state: 'open' }).shippedAt, '2026-10-20');
  assert.deepEqual(shippedFor([t, done], 'Todo'), [done]);
});
