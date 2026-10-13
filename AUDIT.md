# Launch Audit: sabinkhanal.com.np

**Subject:** Sabin Khanal, Backend & Web Developer, personal portfolio
**Date:** 13 October 2026 · **Build:** `feat/portfolio-v2` (Astro 7, Vercel) · **Verdict:** ✅ Ready to deploy and submit to Google

---

## 1. Executive summary

The site passes every launch gate this audit could test locally:

- **Lighthouse:** top scores on mobile and desktop.
- **Core Web Vitals:** well inside Google's "good" thresholds.
- **Security:** a strict Content Security Policy with zero violations, and zero dependency vulnerabilities.
- **Search:** complete structured data for Google's site name and person profile.

Five issues were found and fixed during this audit (§7).

Some items can only be confirmed once the domain is live: HTTPS/HSTS in production, field Core Web Vitals, and how Google renders the site name and favicon. They are listed as post-launch checks in §9.

## 2. Scorecard

Measured with Lighthouse 13.5.0 on the production build (`npm run build`).

| Category | Mobile | Desktop | Target |
|---|---|---|---|
| Performance | **99** | **100** | ≥ 95 |
| Accessibility | **100** | **100** | 100 |
| Best Practices | **100** | **100** | 100 |
| SEO | **100** | **100** | 100 |

| Metric | Mobile | Desktop | Google "good" threshold¹ |
|---|---|---|---|
| Largest Contentful Paint | 2.1 s | 0.4 s | ≤ 2.5 s |
| Cumulative Layout Shift | 0 | 0 | ≤ 0.1 |
| Total Blocking Time (lab proxy for INP) | 0 ms | 0 ms | INP ≤ 200 ms |
| First Contentful Paint | 1.4 s | 0.3 s | — |
| Page weight | 189 KB | 181 KB | — |
| JavaScript (gzipped) | 3.2 KB | 3.2 KB | ≤ 25 KB (project budget) |

¹ Google measures Core Web Vitals at the 75th percentile of real page loads ([web.dev](https://web.dev/articles/vitals)).

Lighthouse also raises four "insight" notices (caching, compression, request chain, render-blocking CSS). They come from the plain local test server. Vercel serves hashed assets with long-lived caching and compression, so they are not expected in production.

## 3. Google Search readiness

| Check | Status | Detail |
|---|---|---|
| Title | ✅ | "Sabin Khanal — Backend & Web Developer" (38 chars) |
| Meta description | ✅ | 163 chars, an accurate summary. Google sets no length limit but may truncate in results². |
| Canonical URL | ✅ | `https://sabinkhanal.com.np/` |
| `robots.txt` | ✅ | Allows all crawlers; references the sitemap |
| `sitemap.xml` | ✅ | Lists the home page |
| Site name in results | ✅ | `WebSite` structured data (`name`, `url`) on the home page, as Google requires³ |
| Person profile | ✅ | `ProfilePage` → `Person` (name, job title, description, image, employer, university, GitHub/LinkedIn `sameAs`). Google lists personal "About me" pages as eligible⁴. |
| Favicon in results | ✅ | 192×192 PNG `rel="icon"` (a multiple of 48 px; Google's list of favicon formats does not include SVG⁵), plus an SVG favicon for browsers and an Apple touch icon |
| Large image previews | ✅ | `max-image-preview:large` |
| Social and LinkedIn preview | ✅ | Open Graph title, description, URL, `og:site_name`, a 1200×630 image with width/height tags (LinkedIn's minimum is 1200×627⁶), and a Twitter large card |
| Language | ✅ | `<html lang="en">` |
| Heading outline | ✅ | One `h1`, logical `h2`/`h3` sections |
| Image alt text | ✅ | Portrait has descriptive alt text; decorative art is `aria-hidden` |
| 404 handling | ✅ | Unknown URLs return HTTP **404** with a branded page, so Google does not index them |
| Mobile-friendly | ✅ | Responsive layout verified at 390 px and 1440 px; viewport meta set |

## 4. Security

| Control | Status |
|---|---|
| Content-Security-Policy | ✅ Scripts limited to `'self'` plus one SHA-256-hashed inline script; `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`. The hash is generated at build time, so it can't go stale. |
| CSP runtime test | ✅ 0 violations, 0 console errors, 0 failed requests (home and 404, served with the production headers) |
| HSTS · nosniff · X-Frame-Options · Referrer-Policy · Permissions-Policy · COOP | ✅ All set via `.vercel/output/config.json` |
| Dependencies | ✅ `npm audit`: 0 vulnerabilities |
| Contact API (`POST /api/contact`) | ✅ Server-side validation, honeypot, per-IP rate limit (5 per 10 min), 10 s upstream timeout, and the API key comes from an environment variable that is never committed. Covered by 13 automated tests. |
| Secrets in repo | ✅ None. `.env` is git-ignored. |

## 5. Accessibility (WCAG 2.2 AA)

- Lighthouse accessibility scores 100 on mobile and desktop.
- **WCAG 2.5.3 *Label in Name*:** fixed in this audit (§7). The ⌘K menu button's accessible name now contains its visible text, and the shortcut is exposed through `aria-keyshortcuts`.
- Skip link, visible focus, AA colour contrast on all tokens, labelled form fields with `autocomplete`, and `prefers-reduced-motion` respected.

## 6. Content integrity

- All content comes from one source of truth (`src/data/profile.ts`) and matches the CV. The site shows three projects; the downloadable CV is one A4 page.
- External links are verified: GitHub profile and both project repositories return 200. LinkedIn returns 999 to automated checks because it blocks bots, so check it by hand.
- No invented metrics. The internal BFC systems are described without confidential detail.

## 7. Issues found and fixed in this audit

| # | Issue | Impact | Fix |
|---|---|---|---|
| 1 | No `WebSite` structured data | Google could not reliably show "Sabin Khanal" as the site name | Added `WebSite` with `name` and `url` |
| 2 | Person markup was not tied to a profile page | Weaker entity signal for name searches | Wrapped `Person` in `ProfilePage` and added a `description` |
| 3 | Only an SVG favicon declared | Google's favicon formats don't include SVG, so the search result could show a generic globe | Added a 192×192 PNG `rel="icon"` |
| 4 | ⌘K button failed WCAG 2.5.3 | Voice-control users could not activate it by saying its visible label | Name now "Menu ⌘K", plus `aria-keyshortcuts` |
| 5 | 205-character meta description repeated the name from the title | More likely to be truncated in results | Rewritten to 163 chars; added `og:site_name` and `max-image-preview:large` |

## 8. Residual risks and limits

1. **Not live yet.** Production HTTPS, HSTS, the `www` → apex redirect and real-user Core Web Vitals can only be confirmed after deployment. A low-traffic site may never collect enough visits for field data in Search Console. In that case, lab scores are the reference.
2. **Google decides presentation.** Meeting the guidelines makes the site eligible for a site name, favicon and profile signals, but Google does not guarantee they will appear³ ⁵. Ranking first for "Sabin Khanal" mostly depends on links from LinkedIn and GitHub (see §9).
3. **Email on the domain.** If any email uses `@sabinkhanal.com.np`, copy its MX/TXT records into Vercel DNS *before* switching nameservers.
4. **Contact form** needs `RESEND_API_KEY` and `CONTACT_TO` in Vercel. Until they are set, the form tells visitors to use the email address shown on the page.
5. **Rate limit** is held in memory per serverless instance. That is enough for a portfolio; move it to a shared store (e.g. Upstash Redis) if the form is ever abused.
6. **CodeQL check** on the private repository fails only at the upload step, because GitHub code scanning isn't enabled for private repos without GitHub Code Security. The analysis itself finds nothing, and the site's `test-and-build` CI passes.
7. **Evidence gap:** Android development and game development appear in Skills without a matching project on the CV. Be ready to show work if a recruiter asks.

## 9. Launch checklist

**Deploy (owner, per `DEPLOY.md`)**
- [ ] Merge the PR into `main`, import the repo into Vercel, and add `RESEND_API_KEY` and `CONTACT_TO`
- [ ] Add `sabinkhanal.com.np` and `www` (redirect to the apex) in Vercel; switch nameservers at register.com.np (24–48 h)
- [ ] Confirm the padlock, the `www` redirect, and a test message arriving from the contact form

**Google (day of launch)**
- [ ] Search Console → **Domain** property → add the TXT record in Vercel DNS → Verify
- [ ] Submit `sitemap.xml`; run **URL Inspection → Request indexing** on the home page
- [ ] **Rich Results Test** on the live URL: expect `ProfilePage` detected with no errors
- [ ] **PageSpeed Insights** on the live URL: expect results in line with §2
- [ ] **securityheaders.com** on the live URL: all headers present

**LinkedIn and GitHub**
- [ ] Run **Post Inspector** on the URL to refresh the preview card
- [ ] Add the site to LinkedIn **Contact info** (type: Portfolio) and to **Featured**; add it as the GitHub profile website

**Week 2**
- [ ] Search Console → Pages: confirm the home page is indexed; then search "Sabin Khanal"

## Sources

1. web.dev, *Web Vitals*: https://web.dev/articles/vitals
2. Google Search Central, *Control your snippets in search results*: https://developers.google.com/search/docs/appearance/snippet
3. Google Search Central, *Provide a site name to Google Search*: https://developers.google.com/search/docs/appearance/site-names
4. Google Search Central, *ProfilePage structured data*: https://developers.google.com/search/docs/appearance/structured-data/profile-page
5. Google Search Central, *Define a favicon to show in search results*: https://developers.google.com/search/docs/appearance/favicon-in-search
6. LinkedIn Help, *Make your website shareable on LinkedIn*: https://www.linkedin.com/help/linkedin/answer/46687

---

## Appendix: research and change history

The earlier research, design rationale and change log, kept for reference. Numbers in this appendix are from the time each entry was written; §2 above is current.

### Portfolio competitive audit & design rationale

**Subject:** sabinkhanal.com.np — personal portfolio of Sabin Khanal, Backend & Web Developer (fintech), Kathmandu
**Date:** 12 Oct 2026
**Method:** live Lighthouse 13.5 runs (mobile, simulated 4G, headless Chrome), visual inspection of each site in a browser, and a review of 2026 design-trend literature and Awwwards judging criteria.

---

### 1. Executive summary

1. **Every benchmarked portfolio fails mobile performance.** Scores ranged from 31 to 75, and largest contentful paint (LCP) from 7.4 s to 25.3 s. The easiest way to beat them is to be fast.
2. **Judges and recruiters reward the same things.** Awwwards weights Design 40%, Usability 30%, Creativity 20%, Content 10%. Recruiters look for real work, clear communication, and quick access to projects and contact details.
3. **The 2026 visual language is settled.** It means dark-first surfaces, bento grids, frosted glass on chrome only (navigation, cards), kinetic type, and physics-based micro-interactions. Heavy 3D worlds score creatively but load slowly.
4. **Decision:** a dark, "precision" aesthetic (Linear/Vercel/Stripe lineage) with depth from light rather than weight. That means one WebGL aurora, glass layers, pointer-reactive 3D tilt and spotlight, a ⌘K command palette, and a real contact backend. It works offline as an installable app, on a budget of **≤ 25 KB of JS** and **LCP ≤ 2 s**.

---

### 2. Benchmark — measured results (Lighthouse mobile)

| Site | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Page weight |
|---|---|---|---|---|---|---|---|---|
| rohanpudasaini.com.np | **42** | 86 | 100 | 92 | 10.4 s | **0.539** | 70 ms | 1.48 MB |
| ayushbajgai.com | **49** | 100 | 96 | 91 | 7.4 s | **0.838** | 0 ms | 3.38 MB |
| brittanychiang.com | 75 | 96 | 100 | 100 | 10.7 s | 0 | 0 ms | 1.52 MB |
| bruno-simon.com | **31** | 74 | 100 | 82 | 25.3 s | 0 | 1,330 ms | 7.55 MB |
| **Target: sabinkhanal.com.np** | **≥ 95** | **100** | **100** | **100** | **≤ 2.0 s** | **0** | **≤ 50 ms** | **≤ 300 KB** |

CLS above 0.25 is "poor" by Google's Core Web Vitals. Both Nepali reference sites visibly jump while loading.

---

### 3. Competitor audits

#### 3.1 rohanpudasaini.com.np — local reference
- **Information architecture:** About → Experience → Projects → Skills → Security → Certifications → Contact. The structure is complete but long, and experience is shown as walls of bullet points.
- **Visual system:** a dark neutral base and a large black-and-white editorial portrait, with good restraint. It has no accent strategy, so nothing guides the eye.
- **Engagement mechanics:** almost none. The page is static, with no reward for interacting.
- **Content:** strong, specific technical copy. However, the page title says "Fullstack Developer" while the hero says "AI/ML Backend Engineer", so the positioning is inconsistent.
- **Tech/perf:** a client-rendered single-page app whose initial HTML has no content. LCP is 10.4 s and CLS 0.539 (poor).
- **Take:** specific, quantified copy. **Avoid:** content that only appears after JavaScript runs, layout shift, and text walls.

#### 3.2 ayushbajgai.com — local reference
- **Information architecture:** Home → About → Resume → Projects → Contact. The flow is clear.
- **Visual system:** a bold cut-out portrait on a yellow arch with high contrast. It is memorable but looks like a Bootstrap template.
- **Engagement mechanics:** count-up counters that **render as "0"**, which hurts credibility.
- **Content:** typos ("daata", "Piplelines"), an empty WhatsApp entry, and two different CV PDFs.
- **Tech/perf:** 3.4 MB page weight, LCP 7.4 s, CLS 0.838 (very poor).
- **Take:** a confident portrait and clear CTAs. **Avoid:** fake or broken stats, heavy images, and unedited copy.

#### 3.3 brittanychiang.com — the most-copied developer portfolio
- **Information architecture:** a sticky left column (name, role, section navigation, socials) and a scrolling right column (About, Experience, Projects). It is very efficient for recruiters.
- **Visual system:** navy `#0f172a`, slate text, a teal accent, and a cursor-following radial "spotlight".
- **Engagement mechanics:** hover states that dim sibling items, which focuses attention.
- **Weakness:** it is so widely cloned that it now reads as a template. LCP is 10.7 s on mobile.
- **Take:** the spotlight and dim-the-siblings hover patterns, and a recruiter-first IA. **Avoid:** the cloned layout.

#### 3.4 bruno-simon.com — creative ceiling
- **Concept:** a drivable 3D world built with Three.js. It wins awards for creativity.
- **Cost:** 7.5 MB, LCP 25 s, TBT 1.3 s, and accessibility 74. A recruiter on a phone will probably leave before it loads.
- **Take:** surprise and delight. **Avoid:** making the content wait for a 3D engine.

#### 3.5 leerob.com / emilkowal.ski — minimal school
- Typography-only pages with near-instant loads. Their authority comes from writing and shipped products.
- **Take:** speed and restraint. **Avoid:** being visually forgettable when you have no famous body of work yet.

#### 3.6 Product-grade references (not portfolios): Linear, Vercel, Stripe
- **Linear:** dark-first app UI, Inter-style type, a narrow palette, and soft gradient glows to create depth.
- **Vercel:** monochrome, geometric, with Geist type and hairline grids.
- **Stripe:** an indigo anchor (`#635BFF`) and animated gradient mesh hero. It is the fintech visual standard.
- **Take:** these three set what "premium" and "trustworthy fintech" look like in 2026. Sabin works in fintech, so borrowing from this lineage signals that he belongs in the field.

---

### 4. 2026 trend assessment

| Trend | Verdict | Use |
|---|---|---|
| Dark-first UI | Adopt | Base theme. Near-black (not pure black) with lighter surfaces for elevation |
| Bento grid | Adopt | About section, with tile size following importance (6–9 tiles) |
| Glass / "Liquid Glass" (iOS 26) | Adopt narrowly | Nav, profile card and command palette only. Never on long body text |
| Kinetic typography | Adopt | Hero headline reveal |
| Physics-based motion | Adopt | Springy tilt, magnetic hover, eased reveals |
| Scroll-driven animation | Adopt (progressive) | Reveal on view with an IntersectionObserver fallback |
| WebGL hero | Adopt, budgeted | One fragment shader (~2 KB) with a CSS fallback. No Three.js |
| Full 3D worlds | Reject | Fails the usability and performance criteria (30% of the Awwwards score) |
| Custom cursor | Reject | Hurts accessibility and touch use, and is a cliché |
| Animated stat counters | Reject | Fragile, and invites invented numbers |

**On "4D / 8D / 16D":** these are not real design standards. The defensible reading is perceived dimensionality, meaning depth from layered light, parallax, pointer response and time-based motion. The site delivers that through five planes: aurora, grid, glass, content, and pointer light.

---

### 5. Colour science & engagement design

**Palette:** derived from the fintech-trust lineage (Stripe indigo, Linear dark) plus a growth signal.

| Token | Hex | Role | Contrast on bg |
|---|---|---|---|
| `--bg` | `#07080B` | Canvas (near-black, avoids OLED smear) | — |
| `--surface` | `#0E1015` | Cards (elevation by lightening) | — |
| `--text` | `#EDEEF2` | Body | 17.3 : 1 |
| `--muted` | `#9097A3` | Secondary | 6.8 : 1 |
| `--violet` | `#8B7CFF` | Primary accent: links, focus, interaction | 6.1 : 1 |
| `--cyan` | `#3DD9EB` | Gradient mid | 11.8 : 1 |
| `--mint` | `#45F0B5` | "Live / available / success" signal | 13.7 : 1 |

- **Indigo/violet** reads as technology and trust. It is the Stripe/Linear association that fintech hiring managers already recognise.
- **Cyan → mint** reads as momentum and success. It is used sparingly: the gradient headline word, the status dot and success states.
- **Rule:** at most three accent tokens per view, and accents never carry body text.

**Engagement ("dopamine") mechanics, kept honest.** Reward comes from responsiveness and discovery, not manipulation:
1. **Immediate feedback:** every interactive element responds within 100 ms (hover light, tilt, press scale).
2. **Discovery:** a ⌘K command palette and a pointer-reactive light are small "hidden" rewards for curious visitors.
3. **Progress:** sections reveal as you scroll, so each scroll uncovers something.
4. **Completion:** the contact form gives an animated success state.
5. **No dark patterns:** no fake counters, no fake urgency, and every effect respects `prefers-reduced-motion`.

---

### 6. Architecture

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro 7 (static pages plus one server route) | HTML-first. Content works without JS, which avoids Rohan's empty-shell problem |
| Fonts | Space Grotesk (display) + Geist (body), self-hosted via the Astro Fonts API and preloaded; system monospace | No third-party render-blocking request. Metric-matched fallbacks give CLS 0 |
| Motion | Vanilla JS + CSS (no GSAP/Lenis) | About 20 KB less JS. Native scroll is better for usability |
| Hero visual | Raw WebGL fragment shader | Stripe-grade gradient for about 2 KB. Pauses offscreen. CSS fallback |
| Backend | `POST /api/contact` (Vercel function): validation, honeypot, per-IP rate limit, email via Resend | A real contact pipeline with no third-party form widget |
| Offline | Service worker (stale-while-revalidate) + web app manifest | Works offline and installs as an app on Android/desktop |
| Android | Installable PWA now; Play Store via Trusted Web Activity (Bubblewrap) later | One codebase, no duplicate native app to maintain |
| SEO | Canonical URL, Open Graph image, JSON-LD `Person`, sitemap, robots | Rich previews when shared on LinkedIn or WhatsApp |
| Quality | Unit tests (`node:test`), GitHub Actions CI (test + build on every push) | Regressions are caught before deploy |
| Hosting | Vercel (or any Node host), domain `sabinkhanal.com.np` | Global CDN. Runs with your laptop off |

---

### 7. Acceptance criteria — measured results (12 Oct 2026, local production build)

| Criterion | Target | Result |
|---|---|---|
| Lighthouse mobile (Perf / A11y / BP / SEO) | ≥95 / 100 / 100 / 100 | ✅ **99 / 100 / 100 / 100** (3 consecutive runs) |
| Lighthouse desktop | — | ✅ **100 / 100 / 100 / 100** |
| LCP (mobile, simulated 4G) | ≤ 2.0 s | ✅ 2.0 s |
| CLS | 0 | ✅ 0 |
| TBT | ≤ 50 ms | ✅ 0 ms |
| JS shipped (gzipped) | ≤ 25 KB | ✅ ~3.5 KB |
| Total page weight | ≤ 300 KB | ✅ 161 KB (vs. 1.5–7.5 MB for competitors) |
| Readable with JS disabled | yes | ✅ content is static HTML; form posts natively |
| Contact API validation, honeypot, rate limit | unit-tested | ✅ 10 tests pass (validation, rate limit and the API route with a fake Resend); manual curl checks: 400 / 200 (bot) / 503 (not configured) / 303 (no-JS) / 429 (flood) |
| Works offline after first visit | yes | ✅ verified in headless Chrome: offline reload renders the full page |
| Installable (PWA) | yes | ✅ manifest + 192/512 maskable icons + service worker |
| Keyboard operation incl. ⌘K, focus, reduced motion | yes | ✅ |
| Consistent title, no typos | yes | ✅ "Backend & Web Developer" everywhere |

**Versus the benchmark:** compared with the best competitor (brittanychiang.com: 75 mobile, LCP 10.7 s), this site scores 24 points higher on mobile performance, loads its largest content about 5× faster, and weighs roughly 9× less.

### 8. Known limits / owner actions

- **Email delivery** needs a free Resend account. Set `RESEND_API_KEY` and `CONTACT_TO` in the host's environment. Until then the form falls back to opening the visitor's email app.
- **Play Store listing** needs a Google Play developer account (one-time fee) and a TWA build. That is a separate step.
- **"Rank #1 forever"** cannot be guaranteed by anyone. What *can* be guaranteed is beating every benchmarked competitor on measured speed, accessibility and SEO, which this plan targets.

### Sources
- Lighthouse 13.5.0 runs, 12 Oct 2026 (raw JSON kept locally)
- [Award-winning website design: what judges look for — Utsubo](https://www.utsubo.com/blog/award-winning-website-design-guide)
- [Awwwards judging criteria — hontran.dev](https://www.hontran.dev/blog/awwwards-judging-criteria)
- [Web Design Trends 2026 — Line25](https://line25.com/articles/web-design-trends-2026/)
- [UI Design Trends 2026 — Wavespace](https://www.wavespace.agency/blog/ui-design-trends)
- [Web design trends 2026 — StudioMeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026)
- [Dark mode UI design tips — Toptal](https://www.toptal.com/designers/ui/dark-mode-ui-design-tips)
- [Recreating Stripe, Linear, Vercel design systems — OpenDesigner](https://opendesigner.io/pl/blog/recreating-stripe-linear-vercel-design-systems-with-design-md)
- [Best developer portfolio examples 2026 — DevPlaybook](https://devplaybook.cc/blog/best-developer-portfolio-examples-2025)
- [Best web developer portfolio examples — Elementor](https://elementor.com/blog/best-web-developer-portfolio-examples/)

---

### Addendum: "4D / 8D / 16D", made literal (12 Oct 2026)

Earlier I treated "4D/8D/16D" as perceived depth. The hero now also shows a **real n-dimensional hypercube**, rendered live:
- **Geometry** (`src/lib/hypercube.ts`, unit-tested): 2ⁿ vertices, n·2ⁿ⁻¹ edges, rotation in n-D planes, and a Petrie-style projection to 2D.
- **Interaction:** 4D / 6D / 8D switches and drag to spin. It pauses with *Pause motion*, offscreen and in background tabs, and shows a still frame with reduced motion.
- **Cost:** 2D canvas, edges batched by axis and depth (≈ 32 strokes per frame even at 8D's 1,024 edges). About 2 KB of JS.
- **Why not 16D:** a 16-cube has 65,536 vertices and 524,288 edges, too many to draw smoothly on a phone every frame. 8D is the honest ceiling.

---

### Addendum: v3 "Dopamine" redesign (12 Oct 2026)

**Why:** the owner's feedback was that the dark v2 still looked outdated. A fresh full-page review found five causes: near-monochrome dark-grey surfaces, every section built from the same box grid, large dead gaps, text-heavy Experience and Skills, and a muddy 2020-era "dark SaaS" hero.

**Research:** *dopamine design* (Adobe's term) is a named 2026 trend. It replaces muted minimalism with saturated colour blocks, oversized type and playful shapes ([TechWyse](https://www.techwyse.com/blog/website-design/web-design-trends-dopamine-design-2026), [daisyUI trends](https://trends.daisyui.com/trend/dopamine-design/)). It overlaps with 2026 neo-brutalism (thick borders, hard shadows, flat colour) and with the owner's reference, monday.com.

**System:**
- Off-white base `#F6F5F1` and ink `#111114`.
- Four brights used as solid blocks: violet `#5B3DF5` (white text), coral `#FF7A59`, sun `#FFD23F` and mint `#2BD99F`, plus sky `#7CC7FF` for accents.
- 2px ink borders with hard offset shadows. Buttons and cards press into their shadow.
- Highlighter "stickers" on key words. Each project gets its own colour block, and the bento tiles are colour-coded.
- A tilted yellow tech band. Skills are colour-coded rows instead of a box grid. Contact sits on a violet band.
- Removed: the WebGL aurora and the cursor spotlight (no longer needed). Kept: the live hypercube (recoloured), CV-only content, backend, PWA and ⌘K.

**Contrast (WCAG):**

| Pair | Ratio |
|---|---|
| ink on bg | 17.3 |
| muted on bg | 6.4 |
| ink on coral | 7.3 |
| ink on sun | 13.1 |
| ink on mint | 10.4 |
| ink on sky | 10.3 |
| white on violet | 6.1 |

**Result:** Lighthouse mobile 99 / 100 / 100 / 100, desktop 100 / 100 / 100 / 100, CLS 0, 163 KB.

---

### Addendum: v4 "Midnight Premium", the owner's pick (13 Oct 2026)

The owner felt v3 was too playful and asked for something more professional. Instead of guessing a fourth time, I built three hero mockups with the real photo and CV facts:

- **A · Executive Light:** Stripe/Apple style.
- **B · Midnight Premium:** Linear/Vercel style.
- **C · Editorial:** magazine/Swiss style.

The owner chose **B**. The full site now follows it:

- **Base:** deep navy `#070B16` with a crisp indigo radial glow and a faint masked grid. The muddy WebGL smoke from v2 is not coming back.
- **Type:** Geist only, with one font family. That made mobile LCP faster: 1.8 s, down from 2.0 s.
- **Accent:** gradient text (`#A5B4FC → #818CF8 → #22D3EE`) on key phrases only. Gradient borders on the profile card, the hovered project cards, the story tile and the form.
- **Actions:** white primary buttons, outlined secondaries, and glass chips.
- **Hero:** stat strip under the hero, all values from the CV: 3 systems built and maintained at BFC, 3 projects, BSc (Hons), core stack. The hypercube stays (indigo/cyan/emerald, subtle).

**Contrast (WCAG):**

| Pair | Ratio |
|---|---|
| text on bg | 16.6 |
| muted `#9AA4B8` on bg | 7.8 |
| muted-2 `#8590A6` on surface | 5.8 |
| indigo `#818CF8` on bg | 6.6 |
| dark text on white button | 19.7 |

**Result:** Lighthouse mobile 99 / 100 / 100 / 100 (LCP 1.8 s, TBT 0 ms) and desktop 100 / 100 / 100 / 100. CLS 0. 139 KB.

---

### Earlier launch check (13 Oct 2026, superseded by §1–9)

**Verdict: ready to launch.** All checks pass on the production build, served with the same security headers Vercel will send.

#### Performance & quality (Lighthouse 13.5)
| | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|---|---|
| Mobile (run 1) | 99 | 100 | 100 | 100 | 1.2 s | 2.0 s | 10 ms | 0 | 174 KB |
| Mobile (run 2) | 99 | 100 | 100 | 100 | 1.2 s | 2.0 s | 0 ms | 0 | 174 KB |
| Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.4 s | 0 ms | 0 | 167 KB |

Shipped code, gzipped: JS 3.3 KB · CSS 6.4 KB · HTML 19 KB.

#### Security
| Check | Result |
|---|---|
| Content-Security-Policy | ✅ `default-src 'self'`. Scripts are limited to self plus a SHA-256 of the one inline script, computed at build time so it can't go stale. `frame-ancestors 'none'`, `object-src 'none'` |
| CSP in a real browser | ✅ 0 violations, 0 console errors. Hypercube, fonts, ⌘K, clock and form all work |
| HSTS · nosniff · X-Frame-Options · Referrer-Policy · Permissions-Policy · COOP | ✅ all set |
| Contact API | ✅ validation, honeypot, per-IP rate limit, 10 s upstream timeout. Secrets come only from env |
| Dependencies | ✅ `npm audit`: 0 vulnerabilities (transitive `path-to-regexp` pinned to 6.3.0) |
| Static analysis | ✅ CodeQL workflow on every PR. CodeRabbit review addressed (11 of 13 fixed, 2 explained) |

#### Functionality
| Check | Result |
|---|---|
| Unit and route tests | ✅ 13 / 13 (contact validation, rate limit, the API route with a fake Resend, hypercube maths, CV-skill coverage) |
| Offline (service worker) | ✅ the full page reloads with the network off |
| Links | ✅ all anchors resolve, all files exist, GitHub links return 200. LinkedIn returns 999 (its bot block, not a broken link) |
| Content integrity | ✅ CV-only. Every CV skill is present (`skills.test.ts`). Experience, projects and education match the CV |
| Accessibility | ✅ Lighthouse 100, AA contrast throughout, keyboard ⌘K, visible focus, reduced-motion respected, *Pause motion* in ⌘K (WCAG 2.2.2) |
| SEO and sharing | ✅ canonical, Open Graph and Twitter image, JSON-LD `Person`, sitemap, robots, 404 page, installable PWA manifest |

#### Owner actions before going live
1. **Hosting:** sabinkhanal.com.np currently serves an older site from a LiteSpeed shared host. See `DEPLOY.md` § "Your domain today".
2. **Email:** set `RESEND_API_KEY` and `CONTACT_TO` so the form delivers. Until then it shows a fallback with your email address.
3. **Merge** PR #1, then follow `DEPLOY.md`.

---

### Addendum: CV upgrade for Mercer-style screening (13 Oct 2026)
- **Degree:** the awarding body is now named, *BSc (Hons) Computing, Leeds Beckett University (UK)*, delivered at The British College (confirmed from the college's own programme pages).
- **New skills, each backed by public evidence** in `github.com/Sabin78910/bookstore-api-python`: FastAPI, Pydantic, pytest API tests, Docker (non-root image), GitHub Actions CI (ruff, pytest, pip-audit), CodeQL, Dependabot, and Render deployment. Linux was confirmed by the owner.
- **The Bookstore REST API is the lead project** on both the CV and the site. Mercer's junior postings ask for Python, REST/HTTP, testing, CI and Git.
- **The CV is one page, ATS-safe and single-column.** Text extraction confirms every target keyword. The original is kept at `cv/Sabin-Khanal-CV-original.pdf`.
- **Still missing (owner input needed):** impact numbers for the BFC systems, degree classification, spoken languages, and relocation or work eligibility for India.

### Addendum: 2026 stack update (13 Oct 2026)
- Owner confirmed **AWS** and **React / Next.js**. They are added to the site (new *Frontend* group; *Cloud, DevOps & testing* strip) and to the CV, which is still one page with every keyword verified via pypdf.
- **Data & AI:** kept to what the CV evidences (the MICE/IQR/PCA pipeline). No unproven AI claims.
- **Learning next** roadmap card was added, then removed at the owner's request. The section heading is now just "Stack", with no intro text.
- **Bookstore REST API** was removed from the website at the owner's request. It is still on the CV. The site now shows three projects.
- Fixed the Data & ML evidence link (`#work` → `#projects`). Service worker is now `sk-v7`.
- Lighthouse mobile: 99 / 100 / 100 / 100, LCP 2.1 s, CLS 0.

- Owner added **Android development** and **game development**. They appear in the *Frontend, mobile & games* card and on a new CV line (*Mobile & games*). The CV stays one page; "system integration" was dropped from its DevOps line because the experience bullets already cover it.
- Capability rows now show titles only (owner request). Detail-level skills such as MICE, PCA, triggers and UAT remain on the CV.
