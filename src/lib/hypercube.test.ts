import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vertices, edges, rotate, project } from './hypercube.ts';

test('n-cube has 2^n vertices and n·2^(n-1) edges, each along one axis', () => {
  for (const n of [3, 4, 6, 8]) {
    assert.equal(vertices(n).length, 2 ** n);
    const e = edges(n);
    assert.equal(e.length, n * 2 ** (n - 1));
    const v = vertices(n);
    for (const { a, b, axis } of e.slice(0, 50)) {
      const diff = v[a].map((x, k) => (x !== v[b][k] ? k : -1)).filter((k) => k >= 0);
      assert.deepEqual(diff, [axis]);
    }
  }
});

test('rotation preserves length; projection stays bounded', () => {
  const p = [1, -1, 1, 1, -1, 1, -1, -1];
  const len = (q: number[]) => Math.hypot(...q);
  const before = len(p);
  rotate(p, 0, 5, 1.234);
  rotate(p, 3, 7, -0.4);
  assert.ok(Math.abs(len(p) - before) < 1e-9);
  for (const q of vertices(8)) {
    const [x, y, z] = project(q);
    assert.ok(Math.abs(x) <= Math.sqrt(8) && Math.abs(y) <= Math.sqrt(8) && Math.abs(z) <= 1);
  }
});
