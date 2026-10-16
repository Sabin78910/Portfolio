import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heroMode, ridgeHeight, isSoftwareRenderer } from './ridge.ts';

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

test('software WebGL renderers keep the static poster; real GPUs (and masked names) animate', () => {
  for (const r of [
    'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0) (0x0000C0DE)), SwiftShader driver)',
    'Google SwiftShader',
    'ANGLE (Mesa, llvmpipe (LLVM 15.0.7 256 bits), OpenGL 4.5)',
    'softpipe',
    'ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'Apple Software Renderer',
  ])
    assert.equal(isSoftwareRenderer(r), true, r);
  for (const r of [
    'ANGLE (Apple, ANGLE Metal Renderer: Apple M4 Pro, Unspecified Version)',
    'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'Adreno (TM) 650',
    'Mali-G78',
    'Apple GPU',
    'WebKit WebGL',
  ])
    assert.equal(isSoftwareRenderer(r), false, r);
});

test('ridge heights are never negative and the far range is taller than the foothills', () => {
  const xs = Array.from({ length: 81 }, (_, i) => i / 40 - 1);
  const peak = (z: number) => Math.max(...xs.map((x) => ridgeHeight(x, z)));
  assert.ok(Math.min(...xs.map((x) => ridgeHeight(x, 0.5))) >= 0);
  assert.ok(peak(1) > peak(0.1) * 2);
});
