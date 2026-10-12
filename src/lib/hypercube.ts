// N-dimensional hypercube geometry: pure maths, no DOM, unit-tested.

/** Vertices of the n-cube: every combination of ±1 across n axes (2^n points). */
export function vertices(n: number): number[][] {
  return Array.from({ length: 1 << n }, (_, i) => Array.from({ length: n }, (_, k) => ((i >> k) & 1 ? 1 : -1)));
}

/** Edges join vertices that differ on exactly one axis: n · 2^(n-1) of them. `axis` is that axis. */
export function edges(n: number): { a: number; b: number; axis: number }[] {
  const out: { a: number; b: number; axis: number }[] = [];
  for (let i = 0; i < 1 << n; i++)
    for (let k = 0; k < n; k++) {
      const j = i ^ (1 << k);
      if (j > i) out.push({ a: i, b: j, axis: k });
    }
  return out;
}

/** Rotate point p in place in the plane spanned by axes i and j. */
export function rotate(p: number[], i: number, j: number, angle: number): void {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const [x, y] = [p[i], p[j]];
  p[i] = x * c - y * s;
  p[j] = x * s + y * c;
}

/**
 * Project an n-D point to 2D using a Petrie-style basis (axis k → angle πk/n), which spreads
 * every dimension evenly around the circle. Returns [x, y, depth], depth in roughly [-1, 1].
 */
export function project(p: number[]): [number, number, number] {
  const n = p.length;
  let x = 0;
  let y = 0;
  let z = 0;
  for (let k = 0; k < n; k++) {
    const t = (Math.PI * k) / n;
    x += p[k] * Math.cos(t);
    y += p[k] * Math.sin(t);
    z += p[k] * Math.cos(2 * t + 0.7);
  }
  const s = 1 / Math.sqrt(n);
  return [x * s, y * s, Math.max(-1, Math.min(1, (z * s) / 1.6))];
}
