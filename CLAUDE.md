# Sabin Khanal — Portfolio (sabinkhanal.com.np)
Personal portfolio. Research and acceptance targets: `AUDIT.md`.

## Stack
Astro 7 (static pages + one server route), vanilla TS, CSS tokens in `src/styles/global.css`.
Vercel adapter for `POST /api/contact` (Resend). Service worker in `public/sw.js`.

## Commands
- Dev: `npm run dev` · Build: `npm run build` · Test: `npm test`

## Rules
- Facts (contact details, roles, dates, education, projects, skills) live in `src/data/profile.ts`; never repeat a fact in markup. Never invent numbers or claims.
- Show only what is on the CV (`public/Sabin-Khanal-CV.pdf`): its experience, its three projects and its skills. No other projects or apps.
- The one exception is the skills group flagged `learning: true` ("Learning next"). It is a labelled roadmap, kept off the CV, and its items never move into a claimed group until they are actually used (enforced by `src/lib/skills.test.ts`).
- Budgets (fail the change if broken): JS ≤ 25 KB gzipped, Lighthouse mobile ≥ 95 / 100 / 100 / 100, CLS 0.
- New logic gets a `node:test` test in `src/lib/*.test.ts` (never under `src/pages`, where files become routes). Validate everything at the API boundary.
- Design system v4 "Midnight Premium" (dark, the owner's choice): tokens at the top of `src/styles/global.css`. Geist only; `.grad` for gradient text, `.card`/`.card--accent` for surfaces, white `.btn--primary`. Never add colours without an AA check.
- Respect `prefers-reduced-motion`, keep AA contrast and visible focus.
- Never commit secrets or `.env`. `main` is protected: branch, PR, merge when CI is green.
