import { startAurora } from './aurora.ts';
import { startHypercube } from './hypercube-view.ts';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

// ── Aurora + pause motion (WCAG 2.2.2) ───────────────────────────────────
const aurora = $<HTMLCanvasElement>('[data-aurora]');
const motionBtn = $<HTMLButtonElement>('[data-motion-toggle]');
let setAuroraPaused: ((p: boolean) => void) | undefined;
let cube: ReturnType<typeof startHypercube>;
const storedPause = (() => {
  try {
    return localStorage.getItem('motion') === 'paused';
  } catch {
    return false;
  }
})();
const applyMotion = (paused: boolean) => {
  document.documentElement.classList.toggle('motion-paused', paused);
  motionBtn?.setAttribute('aria-pressed', String(paused));
  if (motionBtn) motionBtn.textContent = paused ? 'Play motion' : 'Pause motion';
  setAuroraPaused?.(paused);
  cube?.setPaused(paused);
};
if (reduced && motionBtn) motionBtn.hidden = true;
applyMotion(storedPause);
motionBtn?.addEventListener('click', () => {
  const paused = !document.documentElement.classList.contains('motion-paused');
  applyMotion(paused);
  try {
    localStorage.setItem('motion', paused ? 'paused' : 'on');
  } catch {}
});

// Shader compile is the heaviest main-thread task; keep it off the critical path.
const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
if (aurora)
  addEventListener('load', () =>
    idle(() => {
      setAuroraPaused = startAurora(aurora, reduced);
      setAuroraPaused?.(document.documentElement.classList.contains('motion-paused'));
    }),
  );

// ── Hypercube: a live 4D/6D/8D object behind the profile card ────────────
const cubeCanvas = $<HTMLCanvasElement>('[data-hypercube]');
if (cubeCanvas) {
  cube = startHypercube(cubeCanvas, reduced);
  cube?.setPaused(document.documentElement.classList.contains('motion-paused'));
  const label = $('[data-dim-label]');
  $$<HTMLButtonElement>('[data-dim]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const d = Number(btn.dataset.dim);
      cube?.setDimension(d);
      $$('[data-dim]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      if (label) label.textContent = String(d);
    }),
  );
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

// ── Pointer light (spotlight) + 3D tilt ──────────────────────────────────
if (finePointer && !reduced) {
  document.addEventListener('pointermove', (e) => {
    const spot = (e.target as Element).closest<HTMLElement>('[data-spot]');
    if (spot) {
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
  });

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

// ── Kathmandu clock ──────────────────────────────────────────────────────
const clocks = $$('[data-clock]');
const fmt = (seconds: boolean) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    ...(seconds && { second: '2-digit' }),
  });
const [short, long] = [fmt(false), fmt(true)];
const tick = () => {
  const now = new Date();
  clocks.forEach((c) => (c.textContent = (c.hasAttribute('data-seconds') ? long : short).format(now)));
};
tick();
setInterval(tick, 1000);

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
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
