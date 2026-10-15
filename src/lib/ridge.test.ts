import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heroMode, ridgeHeight } from './ridge.ts';

const base = { reducedMotion: false, webgl: true, cores: 8, memory: 8, saveData: false };

test('runs WebGL on capable devices', () => {
  assert.equal(heroMode(base), 'webgl');
});

for (const [why, o] of [
  ['reduced motion', { reducedMotion: true }],
  ['no WebGL', { webgl: false }],
  ['Save-Data', { saveData: true }],
  ['2 CPU cores', { cores: 2 }],
  ['2 GB memory', { memory: 2 }],
] as const) {
  test(`falls back to the static poster with ${why}`, () => {
    assert.equal(heroMode({ ...base, ...o }), 'static');
  });
}

test('ridge heights are never negative and the far range is taller than the foothills', () => {
  const xs = Array.from({ length: 81 }, (_, i) => i / 40 - 1);
  const peak = (z: number) => Math.max(...xs.map((x) => ridgeHeight(x, z)));
  assert.ok(Math.min(...xs.map((x) => ridgeHeight(x, 0.5))) >= 0);
  assert.ok(peak(1) > peak(0.1) * 2);
});
