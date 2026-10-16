import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GA_SRC, readConsent, gaCookies } from './consent.ts';

test('readConsent: only the two stored values count; anything else re-asks', () => {
  assert.equal(readConsent('granted'), 'granted');
  assert.equal(readConsent('denied'), 'denied');
  for (const v of [null, '', 'GRANTED', 'true', ' granted', '{"granted":1}']) assert.equal(readConsent(v), null, String(v));
});

test('gaCookies: finds _ga and _ga_<id>, leaves other cookies alone', () => {
  assert.deepEqual(gaCookies('_ga=GA1.1.1.2; motion=on; _ga_G5S0867EFV=GS2.1; _gat=1; x_ga=1'), ['_ga', '_ga_G5S0867EFV']);
  assert.deepEqual(gaCookies(''), []);
});

test('GA script URL is pinned to the property, over https', () => {
  assert.equal(GA_SRC, 'https://www.googletagmanager.com/gtag/js?id=G-G5S0867EFV');
});
