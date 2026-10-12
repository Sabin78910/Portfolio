# Portfolio Competitive Audit & Design Rationale

**Subject:** sabinkhanal.com.np — personal portfolio of Sabin Khanal, Backend & Web Developer (fintech), Kathmandu
**Date:** 12 Oct 2026
**Method:** live Lighthouse 13.5 runs (mobile, simulated 4G, headless Chrome), visual inspection of each site in a browser, and a review of 2026 design-trend literature and Awwwards judging criteria.

---

## 1. Executive summary

1. **Every benchmarked portfolio fails mobile performance.** Scores ranged from 31 to 75, and largest contentful paint (LCP) from 7.4 s to 25.3 s. The easiest way to beat them is to be fast.
2. **Judges and recruiters reward the same things.** Awwwards weights Design 40%, Usability 30%, Creativity 20%, Content 10%. Recruiters look for real work, clear communication, and quick access to projects and contact details.
3. **The 2026 visual language is settled.** It means dark-first surfaces, bento grids, frosted glass on chrome only (navigation, cards), kinetic type, and physics-based micro-interactions. Heavy 3D worlds score creatively but load slowly.
4. **Decision:** a dark, "precision" aesthetic (Linear/Vercel/Stripe lineage) with depth from light rather than weight. That means one WebGL aurora, glass layers, pointer-reactive 3D tilt and spotlight, a ⌘K command palette, and a real contact backend. It works offline as an installable app, on a budget of **≤ 25 KB of JS** and **LCP ≤ 2 s**.

---

## 2. Benchmark — measured results (Lighthouse mobile)

| Site | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Page weight |
|---|---|---|---|---|---|---|---|---|
| rohanpudasaini.com.np | **42** | 86 | 100 | 92 | 10.4 s | **0.539** | 70 ms | 1.48 MB |
| ayushbajgai.com | **49** | 100 | 96 | 91 | 7.4 s | **0.838** | 0 ms | 3.38 MB |
| brittanychiang.com | 75 | 96 | 100 | 100 | 10.7 s | 0 | 0 ms | 1.52 MB |
| bruno-simon.com | **31** | 74 | 100 | 82 | 25.3 s | 0 | 1,330 ms | 7.55 MB |
| **Target: sabinkhanal.com.np** | **≥ 95** | **100** | **100** | **100** | **≤ 2.0 s** | **0** | **≤ 50 ms** | **≤ 300 KB** |

CLS above 0.25 is "poor" by Google's Core Web Vitals. Both Nepali reference sites visibly jump while loading.

---

## 3. Competitor audits

### 3.1 rohanpudasaini.com.np — local reference
- **Information architecture:** About → Experience → Projects → Skills → Security → Certifications → Contact. The structure is complete but long, and experience is shown as walls of bullet points.
- **Visual system:** a dark neutral base and a large black-and-white editorial portrait, with good restraint. It has no accent strategy, so nothing guides the eye.
- **Engagement mechanics:** almost none. The page is static, with no reward for interacting.
- **Content:** strong, specific technical copy. However, the page title says "Fullstack Developer" while the hero says "AI/ML Backend Engineer", so the positioning is inconsistent.
- **Tech/perf:** a client-rendered single-page app whose initial HTML has no content. LCP is 10.4 s and CLS 0.539 (poor).
- **Take:** specific, quantified copy. **Avoid:** content that only appears after JavaScript runs, layout shift, and text walls.

### 3.2 ayushbajgai.com — local reference
- **Information architecture:** Home → About → Resume → Projects → Contact. The flow is clear.
- **Visual system:** a bold cut-out portrait on a yellow arch with high contrast. It is memorable but looks like a Bootstrap template.
- **Engagement mechanics:** count-up counters that **render as "0"**, which hurts credibility.
- **Content:** typos ("daata", "Piplelines"), an empty WhatsApp entry, and two different CV PDFs.
- **Tech/perf:** 3.4 MB page weight, LCP 7.4 s, CLS 0.838 (very poor).
- **Take:** a confident portrait and clear CTAs. **Avoid:** fake or broken stats, heavy images, and unedited copy.

### 3.3 brittanychiang.com — the most-copied developer portfolio
- **Information architecture:** a sticky left column (name, role, section navigation, socials) and a scrolling right column (About, Experience, Projects). It is very efficient for recruiters.
- **Visual system:** navy `#0f172a`, slate text, a teal accent, and a cursor-following radial "spotlight".
- **Engagement mechanics:** hover states that dim sibling items, which focuses attention.
- **Weakness:** it is so widely cloned that it now reads as a template. LCP is 10.7 s on mobile.
- **Take:** the spotlight and dim-the-siblings hover patterns, and a recruiter-first IA. **Avoid:** the cloned layout.

### 3.4 bruno-simon.com — creative ceiling
- **Concept:** a drivable 3D world built with Three.js. It wins awards for creativity.
- **Cost:** 7.5 MB, LCP 25 s, TBT 1.3 s, and accessibility 74. A recruiter on a phone will probably leave before it loads.
- **Take:** surprise and delight. **Avoid:** making the content wait for a 3D engine.

### 3.5 leerob.com / emilkowal.ski — minimal school
- Typography-only pages with near-instant loads. Their authority comes from writing and shipped products.
- **Take:** speed and restraint. **Avoid:** being visually forgettable when you have no famous body of work yet.

### 3.6 Product-grade references (not portfolios): Linear, Vercel, Stripe
- **Linear:** dark-first app UI, Inter-style type, a narrow palette, and soft gradient glows to create depth.
- **Vercel:** monochrome, geometric, with Geist type and hairline grids.
- **Stripe:** an indigo anchor (`#635BFF`) and animated gradient mesh hero. It is the fintech visual standard.
- **Take:** these three set what "premium" and "trustworthy fintech" look like in 2026. Sabin works in fintech, so borrowing from this lineage signals that he belongs in the field.

---

## 4. 2026 trend assessment

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

## 5. Colour science & engagement design

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

## 6. Architecture

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro 7 (static pages plus one server route) | HTML-first. Content works without JS, which avoids Rohan's empty-shell problem |
| Fonts | Geist + Geist Mono, self-hosted via the Astro Fonts API, preloaded | No third-party render-blocking request. Metric-matched fallbacks give CLS 0 |
| Motion | Vanilla JS + CSS (no GSAP/Lenis) | About 20 KB less JS. Native scroll is better for usability |
| Hero visual | Raw WebGL fragment shader | Stripe-grade gradient for about 2 KB. Pauses offscreen. CSS fallback |
| Backend | `POST /api/contact` (Vercel function): validation, honeypot, per-IP rate limit, email via Resend | A real contact pipeline with no third-party form widget |
| Offline | Service worker (stale-while-revalidate) + web app manifest | Works offline and installs as an app on Android/desktop |
| Android | Installable PWA now; Play Store via Trusted Web Activity (Bubblewrap) later | One codebase, no duplicate native app to maintain |
| SEO | Canonical URL, Open Graph image, JSON-LD `Person`, sitemap, robots | Rich previews when shared on LinkedIn or WhatsApp |
| Quality | Unit tests (`node:test`), GitHub Actions CI (test + build on every push) | Regressions are caught before deploy |
| Hosting | Vercel (or any Node host), domain `sabinkhanal.com.np` | Global CDN. Runs with your laptop off |

---

## 7. Acceptance criteria — measured results (12 Oct 2026, local production build)

| Criterion | Target | Result |
|---|---|---|
| Lighthouse mobile (Perf / A11y / BP / SEO) | ≥95 / 100 / 100 / 100 | ✅ **99 / 100 / 100 / 100** (3 consecutive runs) |
| Lighthouse desktop | — | ✅ **100 / 100 / 100 / 100** |
| LCP (mobile, simulated 4G) | ≤ 2.0 s | ✅ 2.0 s |
| CLS | 0 | ✅ 0 |
| TBT | ≤ 50 ms | ✅ 0 ms |
| JS shipped (gzipped) | ≤ 25 KB | ✅ ~3.2 KB |
| Total page weight | ≤ 300 KB | ✅ 297 KB incl. 5 product screenshots (vs. 1.5–7.5 MB for competitors) |
| Readable with JS disabled | yes | ✅ content is static HTML; form posts natively |
| Contact API validation, honeypot, rate limit | unit-tested | ✅ 3 tests pass; manual curl checks: 400 / 200 (bot) / 503 (not configured) / 303 (no-JS) / 429 (flood) |
| Works offline after first visit | yes | ✅ verified in headless Chrome: offline reload renders the full page |
| Installable (PWA) | yes | ✅ manifest + 192/512 maskable icons + service worker |
| Keyboard operation incl. ⌘K, focus, reduced motion | yes | ✅ |
| Consistent title, no typos | yes | ✅ "Backend & Web Developer" everywhere |

**Versus the benchmark:** compared with the best competitor (brittanychiang.com: 75 mobile, LCP 10.7 s), this site scores 24 points higher on mobile performance, loads its largest content about 5× faster, and weighs roughly 5× less.

## 8. Known limits / owner actions

- **Email delivery** needs a free Resend account. Set `RESEND_API_KEY` and `CONTACT_TO` in the host's environment. Until then the form falls back to opening the visitor's email app.
- **Play Store listing** needs a Google Play developer account (one-time fee) and a TWA build. That is a separate step.
- **"Rank #1 forever"** cannot be guaranteed by anyone. What *can* be guaranteed is beating every benchmarked competitor on measured speed, accessibility and SEO, which this plan targets.

## Sources
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
