# Sabin Khanal — Portfolio

Production portfolio for **sabinkhanal13.com.np**: Astro 7, a WebGL particle-Himalaya hero (static SVG fallback, Play/Pause motion), a contact API, and offline/PWA support.
Research, competitor audit and measured results: [AUDIT.md](AUDIT.md).

```bash
npm install
npm run dev      # http://localhost:4321 (includes the /api/contact backend)
npm test         # backend validation + rate-limit tests
npm run build    # output in .vercel/output (static pages + serverless function)
```

## Edit content
Everything lives in `src/data/profile.ts`. The portrait is `src/assets/sabin-portrait.webp` and the CV is `public/Sabin-Khanal-CV.pdf`.

## Deploy
Step-by-step guide for Vercel + the sabinkhanal13.com.np domain: **[DEPLOY.md](DEPLOY.md)**.

## Offline & Android
The site installs as an app (Chrome → "Install app" / "Add to Home screen") and works offline after the first visit.
To publish on the Play Store later, wrap the live URL as a Trusted Web Activity with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap). This needs a Google Play developer account.

When you change cached files, bump `VERSION` in `public/sw.js`.
