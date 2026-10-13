# Deploying to sabinkhanal.com.np

Total time: about 1 hour of clicking. With Route A (step 4) the domain switches in 10–30 minutes, with no registry wait.
Once this is set up, every push to `main` redeploys automatically. Your laptop can stay off.

---


## Your domain today (DNS checked 13 Oct 2026)
- **DNS is hosted by your current web host** (nameservers `ns1–ns4.mysecurecloudhost.com`, a cPanel host), not by the .np registry.
- The site record is `A 103.138.189.197` (the old LiteSpeed site) with a **10-minute TTL**. `www` points to the same place.
- Email records exist on that host (`MX 0 sabinkhanal.com.np`, plus an SPF TXT). Leave them alone.
- So the **fastest and safest launch is Route A in step 4**: change two records in that host's DNS panel. The switch is live in about 10–30 minutes, with no registry wait and no risk to email. Keep that hosting account active while it serves your DNS.
- Write down the old A record (`103.138.189.197`). Putting it back is your 10-minute rollback.

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

## 4. Connect the domain
First add the domain in Vercel: project → **Settings → Domains** → add `sabinkhanal.com.np`, then `www.sabinkhanal.com.np` set to
**redirect to** `sabinkhanal.com.np`. Vercel then shows the DNS values it wants. **Use exactly what Vercel shows you.**

### Route A: fastest (about 10–30 min), recommended
1. Log in to your current hosting (**mysecurecloudhost** / cPanel) → **Zone Editor** (or "DNS Zone Editor") → `sabinkhanal.com.np`.
2. Edit the **A** record for `sabinkhanal.com.np` and replace `103.138.189.197` with Vercel's A value (e.g. `76.76.21.21` or the IP Vercel shows).
3. Edit `www`: make it a **CNAME** to the value Vercel shows (e.g. `cname.vercel-dns.com`).
4. **Do not touch** the MX or SPF (TXT) records; they run your email.
5. Within about 10–30 minutes Vercel shows **Valid Configuration** and issues HTTPS automatically.

### Route B: official .np registry, nameservers at register.com.np (1–3 business days)
Your domain stays registered with Nepal's official registry either way. This route moves the DNS itself to Vercel.

**1. Check your registry account first**
- Log in at **register.com.np/login**. The username is the email address used when the domain was registered; use **User Login** to recover it.
- Open the **Active Domain** tab and confirm `sabinkhanal.com.np` is listed.
  - If it shows **Reverification**, complete that first. Unverified domains get parked.
  - If it isn't under your login (some hosting companies register .com.np domains for clients), ask your host or `hostmaster@mercantile.com.np` to put it under your email.
- Make sure the contact email is current; renewal reminders go there 15 days before expiry.

**2. Prepare Vercel before switching (so nothing breaks)**
- Vercel → **Domains** → add `sabinkhanal.com.np` → choose **Nameservers**. Note the two it shows (normally `ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
- **Email:** first check whether you use `@sabinkhanal.com.np` email (cPanel → Email Accounts). If you do, add these in Vercel → Domains → **DNS Records** *before* switching. Your MX currently points at the bare domain, which will move to Vercel, so email needs its own name:

  | Name | Type | Value |
  |---|---|---|
  | `mail` | A | `103.138.189.197` |
  | `@` | MX | `mail.sabinkhanal.com.np` (priority 0) |
  | `@` | TXT | your current SPF, copied exactly from cPanel |

  If you have no email accounts, skip this.

**3. Submit the change once**
- register.com.np → **Active Domain** → **EDIT DNS** → replace the nameservers with Vercel's (hostnames, not IPs; both of them, in order).
- **Upload the documents the form asks for.** The registry says requests without required documents are ignored. Typically that's a scan of your citizenship certificate and a short signed request letter.
- Submit **once**. Requests are handled manually, first come first served, usually within 1–3 business days, then up to 48 h to spread.
- If nothing has changed after 72 h, email `hostmaster@mercantile.com.np` with the domain name. Don't resubmit.

**4. When Vercel shows Valid Configuration**, HTTPS is automatic. Add Google's TXT, CAA and DMARC records in **Vercel DNS** (steps 5–8).

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
2. **Stop people sending fake email "from" your domain.** Add these where your DNS lives (Route A: the cPanel Zone Editor; Route B: Vercel → Domains → DNS Records):

   | Name | Type | Value | Use when |
   |---|---|---|---|
   | `@` | TXT | `v=spf1 -all` | **Only** if you never send email from this domain. Your host already has an SPF record for its mail server; if you use `@sabinkhanal.com.np` email, keep that record and don't add this one. |
   | `_dmarc` | TXT | `v=DMARC1; p=reject; adkim=s; aspf=s` if you send no email from the domain; otherwise start with `v=DMARC1; p=none` | Always |
   | `@` | CAA | `0 issue "letsencrypt.org"` | Always (Vercel's certificates come from Let's Encrypt) |

3. **Optional, after launch:** Vercel BotID (invisible CAPTCHA, free Basic tier). Ask Claude to add it once the site is live, so it can be tested on the real deployment.
4. **Optional, hard to undo:** HSTS preload at hstspreload.org, only if every subdomain will always be HTTPS.
5. Check **securityheaders.com** and **observatory.mozilla.org** with your live URL.

## Later: Google Play
The site is an installable PWA. To list it on the Play Store, wrap it as a **Trusted Web Activity** with
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (`npx @bubblewrap/cli init --manifest https://sabinkhanal.com.np/manifest.webmanifest`),
then upload the `.aab` in Play Console and publish `/.well-known/assetlinks.json` with the signing fingerprint.
Follow `devops-hq/PLAY_STORE_CHECKLIST.md`.
