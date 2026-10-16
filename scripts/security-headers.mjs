// Post-build: add security headers to the Vercel Build Output config (the file Vercel actually reads).
// The CSP allows only the inline scripts that exist in the built HTML, hashed here so it can never go stale.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const out = new URL('../.vercel/output/', import.meta.url);
const configFile = new URL('config.json', out);
const config = JSON.parse(readFileSync(configFile, 'utf8'));

const hashes = new Set();
for (const page of ['index.html', '404.html']) {
  const html = readFileSync(new URL(`static/${page}`, out), 'utf8');
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script[^>]*>/gi)) {
    if (/\bsrc=/i.test(attrs) || /application\/ld\+json/i.test(attrs)) continue; // external, or data (never executed)
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
}
assert.ok(hashes.size > 0, 'expected the inline reveal script in the built HTML');

const csp = [
  "default-src 'self'",
  // Google Analytics (loaded only after cookie consent, see src/scripts/consent.ts). The script source is pinned to the
  // /gtag/js path: a bare googletagmanager.com host would also allow any attacker's GTM container (gtm.js).
  `script-src 'self' ${[...hashes].join(' ')} https://www.googletagmanager.com/gtag/js`,
  "style-src 'self' 'unsafe-inline'", // style="--brand:…" attributes and Astro's font-face block
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Trusted Types: DOM XSS sinks (innerHTML, script URLs...) reject plain strings. Only three policies may exist:
  // "sw" (service worker URL), "ga" (the GA script URL, see consent.ts) and "default" (Vercel Analytics:
  // same-origin script.js URLs only, see Base.astro).
  "require-trusted-types-for 'script'",
  'trusted-types sw ga default',
  'upgrade-insecure-requests',
].join('; ');

const route = {
  src: '^/(.*)$',
  headers: {
    'Content-Security-Policy': csp,
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), hid=(), midi=(), display-capture=(), browsing-topics=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  },
  continue: true,
};

config.routes = [route, ...config.routes.filter((r) => r.src !== route.src || !r.headers?.['Content-Security-Policy'])];
writeFileSync(configFile, JSON.stringify(config, null, '\t'));
console.log(`security headers added (${hashes.size} inline script hash${hashes.size > 1 ? 'es' : ''})`);
