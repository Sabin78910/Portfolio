import { vertices, edges, rotate, project } from '../lib/hypercube.ts';

// Live n-dimensional hypercube on a 2D canvas. Edges are batched by axis and depth bucket,
// so even 8D (1,024 edges) is a few dozen strokes per frame.
const PALETTE = [
  [129, 140, 248], // indigo
  [34, 211, 238], // cyan
  [52, 211, 153], // emerald
];
const BUCKETS = 4;

function axisColor(k: number, n: number): number[] {
  const t = (k / Math.max(1, n - 1)) * (PALETTE.length - 1);
  const i = Math.min(PALETTE.length - 2, Math.floor(t));
  const f = t - i;
  return PALETTE[i].map((c, j) => Math.round(c + (PALETTE[i + 1][j] - c) * f));
}

export function startHypercube(canvas: HTMLCanvasElement, still: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let n = 4;
  let base = vertices(n);
  let lines = edges(n);
  let angles: number[] = [];
  let paused = still;
  let drag = { x: 0, y: 0 };
  const spin = { a: 0, b: 0 };

  const setDimension = (d: number) => {
    n = d;
    base = vertices(n);
    lines = edges(n);
    angles = Array.from({ length: n }, () => 0);
    draw(0);
  };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
  };

  const draw = (dt: number) => {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    // Each axis k rotates with its neighbour at its own speed, so the shape keeps turning "through" itself.
    for (let k = 0; k < n; k++) angles[k] += dt * (0.1 + 0.045 * ((k * 7) % 5));
    spin.a += drag.x * 0.006;
    spin.b += drag.y * 0.006;
    drag = { x: drag.x * 0.9, y: drag.y * 0.9 };

    const pts = base.map((v) => {
      const p = v.slice();
      for (let k = 0; k < n; k++) rotate(p, k, (k + 1) % n, angles[k]);
      rotate(p, 0, n - 1, spin.a);
      rotate(p, 1, n - 2, spin.b);
      return project(p);
    });

    const scale = Math.min(w, h) * (n > 4 ? 0.21 : 0.33); // large enough to frame the profile card
    const cx = w / 2;
    const cy = h / 2;
    const paths = Array.from({ length: n * BUCKETS }, () => new Path2D());
    for (const { a, b, axis } of lines) {
      const [ax, ay, az] = pts[a];
      const [bx, by, bz] = pts[b];
      const bucket = Math.min(BUCKETS - 1, Math.floor((((az + bz) / 2 + 1) / 2) * BUCKETS));
      const path = paths[axis * BUCKETS + bucket];
      path.moveTo(cx + ax * scale, cy + ay * scale);
      path.lineTo(cx + bx * scale, cy + by * scale);
    }
    const dpr = w / canvas.clientWidth;
    for (let axis = 0; axis < n; axis++) {
      const [r, g, b] = axisColor(axis, n);
      for (let k = 0; k < BUCKETS; k++) {
        const depth = (k + 0.5) / BUCKETS; // far → near
        ctx.strokeStyle = `rgb(${r} ${g} ${b} / ${(n > 4 ? 0.06 : 0.09) + depth * (n > 4 ? 0.28 : 0.38)})`;
        ctx.lineWidth = (0.7 + depth * (n > 4 ? 1 : 1.8)) * dpr;
        ctx.stroke(paths[axis * BUCKETS + k]);
      }
    }
  };

  let raf = 0;
  let last = 0;
  let onScreen = true;
  const loop = (t: number) => {
    draw(last ? Math.min(0.05, (t - last) / 1000) : 0);
    last = t;
    raf = requestAnimationFrame(loop);
  };
  const run = () => {
    cancelAnimationFrame(raf);
    last = 0;
    if (!paused && onScreen && !document.hidden) raf = requestAnimationFrame(loop);
  };

  resize();
  setDimension(4);
  addEventListener('resize', () => (resize(), draw(0)));
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    run();
  }).observe(canvas);
  document.addEventListener('visibilitychange', run);

  // Drag anywhere on the hero visual to spin the cube.
  const host = canvas.parentElement!;
  let prev: { x: number; y: number } | null = null;
  host.addEventListener('pointerdown', (e) => (prev = { x: e.clientX, y: e.clientY }));
  addEventListener('pointerup', () => (prev = null));
  addEventListener('pointercancel', () => (prev = null));
  addEventListener('pointermove', (e) => {
    if (!prev) return;
    drag = { x: e.clientX - prev.x, y: e.clientY - prev.y };
    prev = { x: e.clientX, y: e.clientY };
    if (paused) draw(0);
  });

  canvas.classList.add('is-ready');
  return {
    setPaused(p: boolean) {
      paused = still || p;
      run();
    },
    setDimension,
  };
}
