// The form's "What's it about?" options; anything else (old forms, bots) files under "Other".
const TOPICS = { role: 'Role', project: 'Project', question: 'Question', other: 'Other' } as const;

export type ContactInput = { name: string; email: string; message: string; topic: (typeof TOPICS)[keyof typeof TOPICS] };
export type ContactResult =
  | { ok: true; data: ContactInput }
  | { ok: false; spam?: true; error: string };

// WHATWG (HTML spec) address grammar plus a dotted domain whose last label has a letter:
// no quotes, commas, brackets, spaces, IP literals or bare hosts, so reply-to can't smuggle extra recipients.
const LABEL = '[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?';
const EMAIL = new RegExp(`^[A-Za-z0-9.!#$%&'*+/=?^_\`{|}~-]{1,64}@(?:${LABEL}\\.)+(?=[A-Za-z0-9-]*[A-Za-z])${LABEL}$`);

// Drop control, zero-width, bidi-override and other invisible characters (header injection, Trojan Source spoofing).
// Messages keep line breaks and tabs; single-line fields keep nothing invisible.
const clean = (s: string, multiline = false) =>
  s.normalize('NFC').replace(multiline ? /[^\P{C}\n\t]/gu : /\p{C}/gu, '').trim();

// Trust boundary: everything from the form is untrusted until it passes here.
export function validateContact(raw: unknown): ContactResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const str = (k: string, multiline = false) => (typeof r[k] === 'string' ? clean(r[k] as string, multiline) : '');

  // Honeypot: real people never see or fill the "company" field.
  if (str('company')) return { ok: false, spam: true, error: 'Rejected.' };

  const name = str('name');
  const email = str('email');
  const message = str('message', true);

  if (name.length < 2 || name.length > 100) return { ok: false, error: 'Please enter your name.' };
  if (email.length > 254 || !EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (message.length < 10) return { ok: false, error: 'Your message is a little short — add a few more words.' };
  if (message.length > 5000) return { ok: false, error: 'Please keep your message under 5,000 characters.' };

  const key = str('subject');
  const topic = Object.hasOwn(TOPICS, key) ? TOPICS[key as keyof typeof TOPICS] : TOPICS.other; // hasOwn: "__proto__" is not a topic
  return { ok: true, data: { name, email, message, topic } };
}

// Reads at most `max` bytes, checking Content-Length first and then while streaming; null means too large.
// 64 KiB covers 5,000 four-byte characters even when URL-encoded (12 bytes each).
export async function readBody(request: Request, max = 65_536): Promise<string | null> {
  if (Number(request.headers.get('content-length') ?? 0) > max) return null;
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (let r = await reader.read(); !r.done; r = await reader.read()) {
    size += r.value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(r.value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

// Rate-limit key: IPv6 clients usually own a whole /64, so rotating addresses inside it must not reset the limit.
export function limitKey(ip: string): string {
  const v4 = ip.match(/(?:^|:)(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (v4) return v4[1];
  if (!ip.includes(':')) return ip;
  const [head, tail = ''] = ip.split('%')[0].split('::');
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const full = [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t];
  return `${full.slice(0, 4).map((x) => parseInt(x || '0', 16).toString(16)).join(':')}::/64`;
}

// shortcut: in-memory, so each serverless instance counts separately; the Vercel WAF rule (AUDIT.md §Security) is the
// shared, edge-level limit. Memory is bounded: expired keys are pruned, and past MAX_KEYS new keys are refused.
const MAX_KEYS = 10_000;
const hits = new Map<string, number[]>();
export const rateLimitKeys = () => hits.size;
export function allowRequest(key: string, now = Date.now(), limit = 5, windowMs = 10 * 60_000): boolean {
  if (hits.size > MAX_KEYS) {
    for (const [k, ts] of hits) if (now - ts[ts.length - 1] >= windowMs) hits.delete(k);
    if (hits.size > MAX_KEYS && !hits.has(key)) return false; // circuit breaker under a distributed flood
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
