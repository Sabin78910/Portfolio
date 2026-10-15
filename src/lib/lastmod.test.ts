import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contentModified } from './lastmod.ts';

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

test('content date is UTC ISO 8601 and never in the future', () => {
  const date = contentModified();
  assert.match(date, ISO_UTC);
  assert.ok(Date.parse(date) <= Date.now());
});

test('content date comes from git history, not the clock', () => {
  // The site's first commit predates this test run, so a git-backed date is strictly in the past.
  assert.ok(Date.parse(contentModified(['src/data/profile.ts'])) < Date.now() - 1000);
});

test('a path with no history falls back to the build time', () => {
  const before = Date.now();
  const date = Date.parse(contentModified(['no/such/path']));
  assert.ok(date >= before - 1000 && date <= Date.now());
});
