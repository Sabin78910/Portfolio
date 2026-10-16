import { GA_ID, GA_SRC, readConsent, gaCookies } from '../lib/consent.ts';

// ── Cookie consent → Google Analytics ────────────────────────────────────
// Nothing from Google loads until "Accept". "Cookie settings" reopens the banner; declining later stops GA and deletes its cookies.
type TT = { createPolicy(n: string, p: { createScriptURL(u: string): string }): { createScriptURL(u: string): string } };
const w = window as unknown as Record<string, unknown> & { dataLayer?: unknown[]; trustedTypes?: TT };
const banner = document.querySelector<HTMLElement>('[data-consent]');
let loaded = false;

function loadGA() {
  w[`ga-disable-${GA_ID}`] = false;
  if (loaded) return;
  loaded = true;
  const dataLayer = (w.dataLayer ??= []);
  // gtag.js reads `arguments` objects from the dataLayer, not arrays.
  const gtag: (...a: unknown[]) => void = function () {
    dataLayer.push(arguments);
  };
  // The visitor agreed to analytics cookies only, so advertising storage stays off.
  gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  gtag('js', new Date());
  gtag('config', GA_ID);
  const s = document.createElement('script');
  s.async = true;
  // The CSP enforces Trusted Types: the script URL comes from the "ga" policy, pinned to GA_SRC.
  s.src = w.trustedTypes?.createPolicy('ga', { createScriptURL: (u) => (u === GA_SRC ? u : '') }).createScriptURL(GA_SRC) ?? GA_SRC;
  document.head.append(s);
}

function stopGA() {
  w[`ga-disable-${GA_ID}`] = true; // GA's documented opt-out flag: no more hits from this page
  for (const n of gaCookies(document.cookie))
    for (const domain of ['', `; Domain=${location.hostname}`]) document.cookie = `${n}=; Max-Age=0; Path=/${domain}`;
}

const stored = (() => {
  try {
    return readConsent(localStorage.getItem('consent'));
  } catch {
    return null;
  }
})();

if (stored === 'granted') loadGA();

// The banner shows while <html> lacks .consent-chosen (set early by Base.astro's head script for returning visitors).
const chosen = document.documentElement.classList;
let opener: HTMLElement | null = null;
banner?.addEventListener('click', (e) => {
  const choice = readConsent((e.target as Element).closest<HTMLElement>('[data-choice]')?.dataset.choice);
  if (!choice) return;
  try {
    localStorage.setItem('consent', choice);
  } catch {}
  chosen.add('consent-chosen');
  opener?.focus(); // don't strand keyboard focus on the hidden banner
  choice === 'granted' ? loadGA() : stopGA();
});

document.querySelectorAll<HTMLElement>('[data-consent-open]').forEach((b) =>
  b.addEventListener('click', () => {
    opener = b;
    chosen.remove('consent-chosen');
    banner?.querySelector('button')?.focus();
  }),
);
