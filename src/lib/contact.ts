export type ContactInput = { name: string; email: string; message: string };
export type ContactResult =
  | { ok: true; data: ContactInput }
  | { ok: false; spam?: true; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Trust boundary: everything from the form is untrusted until it passes here.
export function validateContact(raw: unknown): ContactResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === 'string' ? (r[k] as string).trim() : '');

  // Honeypot: real people never see or fill the "company" field.
  if (str('company')) return { ok: false, spam: true, error: 'Rejected.' };

  const name = str('name');
  const email = str('email');
  const message = str('message');

  if (name.length < 2 || name.length > 100) return { ok: false, error: 'Please enter your name.' };
  if (email.length > 254 || !EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (message.length < 10) return { ok: false, error: 'Your message is a little short — add a few more words.' };
  if (message.length > 5000) return { ok: false, error: 'Please keep your message under 5,000 characters.' };

  return { ok: true, data: { name, email, message } };
}

// shortcut: in-memory, so each serverless instance counts separately; move to a KV store (e.g. Upstash) if spam becomes real.
const hits = new Map<string, number[]>();
export function allowRequest(key: string, now = Date.now(), limit = 5, windowMs = 10 * 60_000): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
