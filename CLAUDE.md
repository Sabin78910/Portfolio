# Sabin Khanal — Portfolio (sabinkhanal.com.np)
Personal portfolio and front door to Sabin Labs. Research and acceptance targets: `AUDIT.md`.

## Stack
Astro 7 (static pages + one server route), vanilla TS, CSS tokens in `src/styles/global.css`.
Vercel adapter for `POST /api/contact` (Resend). Service worker in `public/sw.js`.

## Commands
- Dev: `npm run dev` · Build: `npm run build` · Test: `npm test`

## Rules
- Content lives in `src/data/profile.ts`; never hard-code copy in markup. Never invent numbers or claims.
- Budgets (fail the change if broken): JS ≤ 25 KB gzipped, Lighthouse mobile ≥ 95 / 100 / 100 / 100, CLS 0.
- New logic gets a `node:test` test in `src/lib/*.test.ts`. Validate everything at the API boundary.
- Respect `prefers-reduced-motion`, keep AA contrast and visible focus. Dark-only theme by design.
- Never commit secrets or `.env`. `main` is protected: branch, PR, merge when CI is green.
