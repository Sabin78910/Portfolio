import type { APIRoute } from 'astro';
import { validateContact, allowRequest, limitKey, readBody } from '../../lib/contact.ts';

export const prerender = false;

const json = (body: object, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

// Cross-site form posts are already refused with 403 by Astro's origin check (security.checkOrigin, on by default).
export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  // Only the two encodings the site sends. text/plain and multipart are refused (classic CSRF and parser-abuse vectors).
  const type = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  const isForm = type === 'application/x-www-form-urlencoded';
  if (!isForm && type !== 'application/json') return json({ error: 'Unsupported content type.' }, 415);

  // Plain <form> posts (no JS) get redirects; fetch() calls get JSON.
  const fail = (error: string, status: number, headers?: Record<string, string>) =>
    isForm ? redirect('/?sent=0#contact', 303) : json({ error }, status, headers);

  // On Vercel the client IP comes from x-forwarded-for, which the platform overwrites, so it can't be spoofed.
  if (!allowRequest(limitKey(clientAddress ?? 'unknown')))
    return fail('Too many messages — please try again later.', 429, { 'Retry-After': '600' });

  const text = await readBody(request).catch(() => null);
  if (text === null) return fail('Message is too large.', 413);

  let raw: unknown;
  try {
    raw = isForm ? Object.fromEntries(new URLSearchParams(text)) : JSON.parse(text);
  } catch {
    return fail('Invalid request.', 400);
  }

  const result = validateContact(raw);
  if (!result.ok) {
    // Pretend success to bots so they don't retry.
    if (result.spam) return isForm ? redirect('/?sent=1#contact', 303) : json({ ok: true });
    return fail(result.error, 400);
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) return fail('Email service is not configured yet.', 503);

  const { name, email, message } = result.data;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // onboarding@resend.dev works until a sending domain is verified in Resend.
      from: process.env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`, // plain text only: nothing the visitor typed is ever rendered as HTML
    }),
    signal: AbortSignal.timeout(10_000), // don't hold the visitor for the whole function timeout
  }).catch(() => null);

  if (!res?.ok) return fail('Could not send right now — please email me directly.', 502);
  return isForm ? redirect('/?sent=1#contact', 303) : json({ ok: true });
};
