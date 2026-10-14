import { heroMode, readHeroEnv } from '../lib/ridge.ts';
import type { RidgeHandle } from './ridge-view.ts';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

// ── Pause motion (WCAG 2.2.2) ────────────────────────────────────────────
// Two controls, one saved choice: the hero's Play/Pause button and the ⌘K menu item (its hint shows the state).
const motionHint = $('[data-action="motion"] .cmdk__hint');
const motionBtn = $<HTMLButtonElement>('[data-motion-toggle]');
let ridge: RidgeHandle | null = null;
const storedPause = (() => {
  try {
    return localStorage.getItem('motion') === 'paused';
  } catch {
    return false;
  }
})();
const applyMotion = (paused: boolean) => {
  document.documentElement.classList.toggle('motion-paused', paused);
  if (motionHint) motionHint.textContent = paused ? 'Paused — select to resume' : 'Accessibility';
  if (motionBtn) motionBtn.textContent = paused ? 'Play motion' : 'Pause motion';
  ridge?.setPaused(paused);
};
applyMotion(storedPause);
const toggleMotion = () => {
  const paused = !document.documentElement.classList.contains('motion-paused');
  applyMotion(paused);
  try {
    localStorage.setItem('motion', paused ? 'paused' : 'on');
  } catch {}
};

motionBtn?.addEventListener('click', toggleMotion);

// ── Particle Himalaya behind the hero ────────────────────────────────────
// Loaded when idle and only on devices that can afford it; otherwise the static SVG range stays.
// The Play/Pause button appears once the animation is running.
const ridgeCanvas = $<HTMLCanvasElement>('[data-ridge]');
if (ridgeCanvas && heroMode(readHeroEnv()) === 'webgl') {
  const start = () =>
    import('./ridge-view.ts').then(({ startRidge }) => {
      ridge = startRidge(ridgeCanvas);
      if (!ridge) return;
      ridge.setPaused(document.documentElement.classList.contains('motion-paused'));
      if (motionBtn) motionBtn.hidden = false;
    });
  if ('requestIdleCallback' in window) requestIdleCallback(start);
  else setTimeout(start, 150);
}

// ── Reveal on scroll ─────────────────────────────────────────────────────
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }),
  { rootMargin: '0px 0px -8% 0px' },
);
$$('[data-reveal]').forEach((el) => io.observe(el));

// ── 3D tilt ──────────────────────────────────
if (finePointer && !reduced) {
  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

// ── Copy email ───────────────────────────────────────────────────────────
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
$$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const status = btn.querySelector('[data-copy-status]')!;
  btn.addEventListener('click', async () => {
    status.textContent = (await copy(btn.dataset.copy!)) ? 'Copied ✓' : 'Copy failed';
    setTimeout(() => (status.textContent = 'Copy'), 2000);
  });
});

// ── Command palette (⌘K / Ctrl+K) ────────────────────────────────────────
const dlg = $<HTMLDialogElement>('[data-cmdk]');
const input = $<HTMLInputElement>('[data-cmdk-input]');
const items = $$<HTMLLIElement>('[data-cmdk-list] li');
let active = 0;

const visible = () => items.filter((li) => !li.hidden);
const setActive = (i: number) => {
  const v = visible();
  if (!v.length) return;
  active = (i + v.length) % v.length;
  items.forEach((li) => li.setAttribute('aria-selected', 'false'));
  v[active].setAttribute('aria-selected', 'true');
  v[active].scrollIntoView({ block: 'nearest' });
};
const openCmdk = () => {
  if (!dlg || !input || dlg.open) return;
  input.value = '';
  items.forEach((li) => (li.hidden = false));
  dlg.showModal();
  setActive(0);
};

$$('[data-cmdk-open]').forEach((b) => b.addEventListener('click', openCmdk));
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    dlg?.open ? dlg.close() : openCmdk();
  }
});
input?.addEventListener('input', () => {
  const q = input.value.trim().toLowerCase();
  items.forEach((li) => (li.hidden = !li.textContent!.toLowerCase().includes(q)));
  setActive(0);
});
input?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
  } else if (e.key === 'Enter') {
    e.preventDefault();
    visible()[active]?.querySelector('a')?.click();
  }
});
dlg?.addEventListener('click', async (e) => {
  if (e.target === dlg) return dlg.close(); // backdrop click
  const a = (e.target as Element).closest('a');
  if (!a) return;
  if (a.dataset.action === 'motion') {
    e.preventDefault();
    toggleMotion();
    setTimeout(() => dlg.close(), 500);
    return;
  }
  if (a.dataset.action === 'copy') {
    e.preventDefault();
    const hint = a.querySelector('.cmdk__hint')!;
    hint.textContent = (await copy($('[data-copy]')!.dataset.copy!)) ? 'Copied ✓' : 'Copy failed';
    setTimeout(() => dlg.close(), 600);
    return;
  }
  dlg.close();
});

// ── Contact form (progressive enhancement over a plain POST) ────────────
const form = $<HTMLFormElement>('[data-contact]');
const formStatus = $('[data-form-status]');
const label = $('[data-submit-label]');
const say = (msg: string, tone: 'ok' | 'err' | '' = '') => {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.dataset.tone = tone;
};

const sent = new URLSearchParams(location.search).get('sent');
if (sent === '1') say('Thanks — your message is on its way. I’ll get back to you soon.', 'ok');
if (sent === '0') say('Something went wrong. Please email me directly.', 'err');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    say('Please fill in your name, a valid email and a message of at least 10 characters.', 'err');
    form.querySelector<HTMLElement>(':invalid')?.focus();
    return;
  }
  const button = form.querySelector('button')!;
  button.disabled = true;
  label!.textContent = 'Sending…';
  say('');
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? 'Could not send right now.');
    form.reset();
    form.classList.add('is-sent');
    say('Thanks — your message is on its way. I’ll get back to you soon.', 'ok');
  } catch (err) {
    say(`${(err as Error).message} You can also email me at ${$('[data-copy]')?.dataset.copy ?? 'the address above'}.`, 'err');
  } finally {
    button.disabled = false;
    label!.textContent = 'Send message';
  }
});

// ── Offline support ──────────────────────────────────────────────────────
// The CSP enforces Trusted Types, so the worker URL must come from the one policy it allows ("sw"), pinned to /sw.js.
type TT = { createPolicy(n: string, p: { createScriptURL(u: string): string }): { createScriptURL(u: string): string } };
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const tt = (window as unknown as { trustedTypes?: TT }).trustedTypes;
  const url = tt?.createPolicy('sw', { createScriptURL: (u) => (u === '/sw.js' ? u : '') }).createScriptURL('/sw.js') ?? '/sw.js';
  addEventListener('load', () => navigator.serviceWorker.register(url));
}
