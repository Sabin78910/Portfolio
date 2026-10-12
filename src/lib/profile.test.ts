import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stats, products, platform, moreProducts, labs } from '../data/profile.ts';

// Guards the public claims on the page against drifting from the underlying data.
test('headline stats match the product data', () => {
  const tests = [...products, platform, ...moreProducts].reduce((n, p) => n + p.tests, 0);
  assert.ok(tests >= 1560, `"1,560+ automated tests" needs ≥1560, data has ${tests}`);
  assert.equal(products.length + 1 + moreProducts.length, labs.count);
  assert.equal(stats.find((s) => s.label === 'Products shipped')?.value, String(labs.count));
});
