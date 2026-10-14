# Deploying to sabinkhanal13.com.np

Total time: about 1 hour of clicking, plus the .np registry's processing time (usually 1–3 business days) for step 4.
Once this is set up, every push to `main` redeploys automatically. Your laptop can stay off.

---


## Your domain today (DNS checked 13 Oct 2026)
- Your domain is **`sabinkhanal13.com.np`**. (The similar `sabinkhanal.com.np`, without the 13, belongs to someone else. Never link to it.)
- It has **no DNS yet**: no nameservers, no records. Either the registration is still awaiting approval at register.com.np, or it was approved without nameservers.
  Both are fine: there is no old site or email to protect, so step 4 is a clean, one-time setup.
- Until the domain is live, the site works at its `….vercel.app` address (step 2). Use that link if you need to share the portfolio before then.

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
The form sends email through **Gmail SMTP** with an app password (Google's limit: 500 messages/day, plenty here).
1. Google Account → **Security** → turn on **2-Step Verification** (required), then
   **myaccount.google.com/apppasswords** → create one named `portfolio`. Copy the 16 characters.
2. In Vercel → your project → **Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `SMTP_USER` | `sabinkhanal13@gmail.com` (the account the app password belongs to) |
   | `SMTP_PASS` | the 16-character app password (spaces are fine, they get stripped) |
   | `CONTACT_TO` | `sabinkhanal13@gmail.com` (or wherever you want messages) |

   `SMTP_HOST` and `SMTP_PORT` default to `smtp.gmail.com` and `465`, so only set them for a different provider.
3. **Deployments** → ⋯ on the latest one → **Redeploy** (env vars only apply to new deploys).
4. Send yourself a test message from the site's contact form.

> Messages arrive from your own Gmail address with the visitor's address as **Reply-To**, so replying goes to them.
> The same values live in `.env` for local development — that file is git-ignored and must stay that way.

## 4. Connect the domain (official .np registry, usually 1–3 business days)
**1. Check your registry account**
- Log in at **register.com.np/login** (username = the email used to request the domain; **User Login** recovers it).
- Under **Active Domain**, confirm `sabinkhanal13.com.np` is listed and active.
  - Still pending? Wait for the approval email, or check the request status in the dashboard.
  - If it shows **Reverification**, complete that first; unverified domains get parked.
- Keep the contact email current; renewal reminders go there 15 days before expiry.

**2. Add the domain in Vercel first**
- Vercel → project → **Settings → Domains** → add `sabinkhanal13.com.np`, then `www.sabinkhanal13.com.np` set to **redirect to** it.
- Choose the **Nameservers** option and note the two names Vercel shows (normally `ns1.vercel-dns.com`, `ns2.vercel-dns.com`). **Use exactly what Vercel shows.**

**3. Submit the nameservers once**
- register.com.np → **Active Domain** → **EDIT DNS** → enter Vercel's two nameservers (hostnames, not IPs, in order).
- **Upload the documents the form asks for.** The registry ignores requests without them; typically a citizenship certificate scan and a short signed request letter.
- Submit **once**. Requests are handled manually, first come first served, usually within 1–3 business days, then up to 48 h to spread.
- No change after 72 h? Email `hostmaster@mercantile.com.np` with the domain name. Don't resubmit.

**4. When Vercel shows Valid Configuration**, HTTPS is issued automatically. All other records (Google's TXT, CAA, DMARC) are added in **Vercel → Domains → DNS Records**.

**5. Put the address back where it was held off** (it was removed while the domain wasn't live, so no one hits a dead link):
- CV: add `sabinkhanal13.com.np` to the contact line in `cv/cv.html`, re-export the PDF, copy it to `public/Sabin-Khanal-CV.pdf`.
- GitHub profile README (`Sabin78910/Sabin78910`): add the website link back; set **Website** in GitHub profile settings.
- LinkedIn: Contact info → Website (type: Portfolio).

## 5. Check the live site (5 min)
- [ ] https://sabinkhanal13.com.np loads with a padlock, and www redirects to it
- [ ] Contact form → message arrives in your inbox
- [ ] Chrome → DevTools → **Lighthouse** → Mobile: expect ~99 / 100 / 100 / 100
- [ ] Chrome menu → **Install app** works; turn Wi-Fi off and reload. The page still loads (offline mode)
- [ ] Share the link on LinkedIn/WhatsApp. The preview card with your photo appears
      (refresh LinkedIn's cache at linkedin.com/post-inspector if needed)
- [ ] Submit `https://sabinkhanal13.com.np/sitemap.xml` in **Google Search Console** so Google indexes you

## 6. Optional: send from your own address
Gmail can only send as the account that owns the app password. To send as `hello@sabinkhanal13.com.np`, either add that
address as a verified alias in Gmail (**Settings → Accounts → Send mail as**), or point `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`
at a provider that hosts the domain's mail. Nothing else in the code changes.

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
2. **Stop people sending fake email "from" your domain.** Vercel → Domains → DNS Records → add:

   | Name | Type | Value | Use when |
   |---|---|---|---|
   | `@` | TXT | `v=spf1 -all` | Still correct: the form sends from Gmail, not from this domain. Replace it only if you start sending mail *as* `@sabinkhanal13.com.np` (step 6). |
   | `_dmarc` | TXT | `v=DMARC1; p=reject; adkim=s; aspf=s` (use `p=none` first if you start sending mail from the domain) | Always |
   | `@` | CAA | `0 issue "letsencrypt.org"` | Always (Vercel's certificates come from Let's Encrypt) |

3. **Optional, after launch:** Vercel BotID (invisible CAPTCHA, free Basic tier). Ask Claude to add it once the site is live, so it can be tested on the real deployment.
4. **Optional, hard to undo:** HSTS preload at hstspreload.org, only if every subdomain will always be HTTPS.
5. Check **securityheaders.com** and **observatory.mozilla.org** with your live URL.

## Later: Google Play
The site is an installable PWA. To list it on the Play Store, wrap it as a **Trusted Web Activity** with
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (`npx @bubblewrap/cli init --manifest https://sabinkhanal13.com.np/manifest.webmanifest`),
then upload the `.aab` in Play Console and publish `/.well-known/assetlinks.json` with the signing fingerprint.
Follow `devops-hq/PLAY_STORE_CHECKLIST.md`.
