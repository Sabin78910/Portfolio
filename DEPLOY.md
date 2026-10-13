# Deploying to sabinkhanal.com.np

Total time: about 20 minutes of clicking, then up to 48 hours for the .np registry to switch DNS.
Once this is set up, every push to `main` redeploys automatically. Your laptop can stay off.

---


## Your domain today (checked 13 Oct 2026)
`sabinkhanal.com.np` already serves a site titled "Sabin Khanal" from a **LiteSpeed** shared host (typical cPanel hosting).
- **Recommended:** follow steps 2–4 below (Vercel). The contact form, security headers and auto-deploys all work there.
- **Before switching nameservers:** if your email (e.g. `you@sabinkhanal.com.np`) is hosted on that LiteSpeed/cPanel account, copy its
  MX, SPF (TXT) and DKIM records into Vercel DNS first, or mail will stop.
- **Staying on the LiteSpeed host instead:** run `npm run build` and upload the contents of `.vercel/output/static/` to `public_html`.
  The site works, but `/api/contact` needs a server, so the form falls back to your email address. Security headers would also need to be
  added in `.htaccess`.

## 1. Put the code on GitHub
The code lives in **github.com/Sabin78910/Porfolio** (private). Merge the `feat/portfolio-v2` pull request into `main`.
CI (tests + build) and CodeQL run on that PR first.

## 2. Create the Vercel project (5 min)
1. Go to **vercel.com** → **Sign up** → **Continue with GitHub** (the free Hobby plan is fine for a personal portfolio).
2. Click **Add New… → Project** and **Import** `Sabin78910/Porfolio`. If it isn't listed, choose
   *Adjust GitHub App Permissions* and give Vercel access to that repo.
3. Vercel detects **Astro** automatically. Leave every build setting at its default and click **Deploy**.
4. You get a URL like `porfolio-xxxx.vercel.app`. Open it and check the site loads.

## 3. Turn on the contact form (5 min)
The form sends email through **Resend** (free: 3,000 emails/month).
1. Sign up at **resend.com** → **API Keys** → **Create API key** (permission: *Sending access*). Copy it.
2. In Vercel → your project → **Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | the key from Resend (starts with `re_`) |
   | `CONTACT_TO` | `sabinkhanal13@gmail.com` (or wherever you want messages) |

3. **Deployments** → ⋯ on the latest one → **Redeploy** (env vars only apply to new deploys).
4. Send yourself a test message from the site's contact form.

> Until you verify your own domain in Resend (step 6), messages are sent from `onboarding@resend.dev`.
> Resend only allows that sender to email the address you signed up with, so sign up to Resend with `CONTACT_TO`.

## 4. Connect the domain (5 min + registry wait)
The .np registry (register.com.np, run by Mercantile) only accepts **nameservers**, not individual DNS records.
So let Vercel host the DNS:

1. Vercel → project → **Settings → Domains** → add `sabinkhanal.com.np`. Then add `www.sabinkhanal.com.np` and set it to
   **redirect to** `sabinkhanal.com.np`.
2. Vercel shows the domain as *Invalid configuration*. Choose the **Nameservers** option. It lists two nameservers,
   typically `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. **Use exactly what Vercel shows you.**
3. Go to **register.com.np** → log in → **Domain list** → select `sabinkhanal.com.np` → **Edit DNS**.
4. Replace the nameservers with Vercel's two. Enter hostnames only (FQDN), not IP addresses. Submit once.
5. Wait. The registry processes changes **twice a day** and propagation takes **up to 24–48 hours**.
   Do not resubmit, because repeated changes delay it. If nothing happens after 48 hours, email
   `hostmaster@mercantile.com.np`.
6. When Vercel shows **Valid Configuration**, HTTPS is issued automatically. Open https://sabinkhanal.com.np 🎉

> **Do you already use email on this domain** (e.g. Zoho or Google Workspace)? Before switching nameservers, copy its
> MX/TXT records into Vercel → **Domains → sabinkhanal.com.np → DNS Records**, or your email will stop working.

## 5. Check the live site (5 min)
- [ ] https://sabinkhanal.com.np loads with a padlock, and www redirects to it
- [ ] Contact form → message arrives in your inbox
- [ ] Chrome → DevTools → **Lighthouse** → Mobile: expect ~99 / 100 / 100 / 100
- [ ] Chrome menu → **Install app** works; turn Wi-Fi off and reload. The page still loads (offline mode)
- [ ] Share the link on LinkedIn/WhatsApp. The preview card with your photo appears
      (refresh LinkedIn's cache at linkedin.com/post-inspector if needed)
- [ ] Submit `https://sabinkhanal.com.np/sitemap.xml` in **Google Search Console** so Google indexes you

## 6. Optional: send from your own address
Resend → **Domains → Add domain** → `sabinkhanal.com.np` → copy the DNS records it shows into Vercel's DNS records →
**Verify**. Then add `CONTACT_FROM` = `Portfolio <hello@sabinkhanal.com.np>` in Vercel and redeploy.

## 7. Automation (already wired, needs one click each)
- **CodeRabbit (AI code review + security):** app.coderabbit.ai → sign in with GitHub → install on `Porfolio`.
  The repo's `.coderabbit.yaml` already tells it what to check.
- **devops-hq monitoring:** add `Porfolio` to `devops-hq/repos.txt` so the 6-hourly watcher covers it.
  The watcher needs read access to private repos (`ORG_READ_TOKEN`, see devops-hq README).
- **Dependabot + CodeQL:** run automatically from `.github/`. Enable *Dependabot alerts* in the repo's
  **Settings → Code security** if prompted.

## 8. Security switches (10 min, after the site is live)
1. **Edge rate limit (free):** Vercel → project → **Firewall → Configure → + New Rule**
   - Name: `contact-form`. If **Request Path** *equals* `/api/contact` and **Method** *equals* `POST`
   - Then **Rate Limit**: Fixed Window, **60 s**, **5 requests**, key **IP**, action **Default (429)** → **Save** → **Review Changes → Publish**
   The site already limits each IP inside the function. This rule adds the same limit at Vercel's edge, shared by every server.
2. **Stop people sending fake email "from" your domain.** Vercel → Domains → `sabinkhanal.com.np` → DNS Records → add:

   | Name | Type | Value | Use when |
   |---|---|---|---|
   | `@` | TXT | `v=spf1 -all` | You send **no** email from this domain. If you verify the domain in Resend (step 6), use the SPF value Resend gives you instead. |
   | `_dmarc` | TXT | `v=DMARC1; p=reject; adkim=s; aspf=s` | Always |
   | `@` | CAA | `0 issue "letsencrypt.org"` | Always (Vercel's certificates come from Let's Encrypt) |

3. **Optional, after launch:** Vercel BotID (invisible CAPTCHA, free Basic tier). Ask Claude to add it once the site is live, so it can be tested on the real deployment.
4. **Optional, hard to undo:** HSTS preload at hstspreload.org, only if every subdomain will always be HTTPS.
5. Check **securityheaders.com** and **observatory.mozilla.org** with your live URL.

## Later: Google Play
The site is an installable PWA. To list it on the Play Store, wrap it as a **Trusted Web Activity** with
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (`npx @bubblewrap/cli init --manifest https://sabinkhanal.com.np/manifest.webmanifest`),
then upload the `.aab` in Play Console and publish `/.well-known/assetlinks.json` with the signing fingerprint.
Follow `devops-hq/PLAY_STORE_CHECKLIST.md`.
