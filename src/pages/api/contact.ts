import type { APIRoute } from 'astro';
import { validateContact, allowRequest } from '../../lib/contact';

export const prerender = false;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  // Plain <form> posts (no JS) get redirects; fetch() calls get JSON.
  const isForm = !(request.headers.get('content-type') ?? '').includes('application/json');
  const fail = (error: string, status: number) => (isForm ? redirect('/?sent=0#contact', 303) : json({ error }, status));

  if (!allowRequest(clientAddress ?? 'unknown')) return fail('Too many messages — please try again later.', 429);

  let raw: unknown;
  try {
    raw = isForm ? Object.fromEntries(await request.formData()) : await request.json();
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
      text: `${message}\n\n— ${name} <${email}>`,
    }),
  }).catch(() => null);

  if (!res?.ok) return fail('Could not send right now — please email me directly.', 502);
  return isForm ? redirect('/?sent=1#contact', 303) : json({ ok: true });
};
