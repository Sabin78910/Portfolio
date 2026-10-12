# Sabin Khanal — Portfolio

Production portfolio for **sabinkhanal.com.np**: Astro 7, a raw-WebGL hero, a contact API, and offline/PWA support.
Research, competitor audit and measured results: [AUDIT.md](AUDIT.md).

```bash
npm install
npm run dev      # http://localhost:4321 (includes the /api/contact backend)
npm test         # backend validation + rate-limit tests
npm run build    # output in .vercel/output (static pages + serverless function)
```

## Edit content
Everything lives in `src/data/profile.ts`. The portrait is `src/assets/sabin-portrait.webp` and the CV is `public/Sabin-Khanal-CV.pdf`.

## Deploy (runs 24/7, no laptop needed)
1. Push this repo to GitHub. CI (`.github/workflows/ci.yml`) tests and builds every push.
2. Import the repo on [vercel.com](https://vercel.com). No configuration is needed; the Astro adapter handles it.
3. Add environment variables in Vercel so the contact form sends email:
   - `RESEND_API_KEY`: from a free [resend.com](https://resend.com) account
   - `CONTACT_TO`: the address that receives messages
   - `CONTACT_FROM` (optional): a sender on a domain you have verified in Resend
4. Add the domain `sabinkhanal.com.np` in Vercel → Domains, then set the DNS records it shows at your .np registrar.

## Offline & Android
The site installs as an app (Chrome → "Install app" / "Add to Home screen") and works offline after the first visit.
To publish on the Play Store later, wrap the live URL as a Trusted Web Activity with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap). This needs a Google Play developer account.

When you change cached files, bump `VERSION` in `public/sw.js`.
