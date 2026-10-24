import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../pages/api/contact.ts';
import { validateContact, limitKey, allowRequest, rateLimitKeys } from './contact.ts';
import { mailer, type Mail } from './mailer.ts';

// Attack suite for POST /api/contact: drives the real handler with hostile input and a fake SMTP transport (no network).
const realSend = mailer.send;
let sent: Mail[] = [];
afterEach(() => {
  mailer.send = realSend;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.CONTACT_TO;
});
const armed = () => {
  process.env.SMTP_USER = 'owner@gmail.com';
  process.env.SMTP_PASS = 'app password';
  process.env.CONTACT_TO = 'owner@example.com';
  sent = [];
  mailer.send = async (mail: Mail) => {
    sent.push(mail);
    return true;
  };
};

let n = 0;
const hit = (body: string | Uint8Array, type = 'application/json', ip = `198.51.100.${++n % 250}`) =>
  POST({
    request: new Request('http://localhost/api/contact', { method: 'POST', headers: { 'content-type': type }, body }),
    clientAddress: `${ip}-${n}`,
    redirect: (to: string, status: number) => new Response(null, { status, headers: { Location: to } }),
  } as never) as Promise<Response>;
const good = { name: 'Asha Rai', email: 'asha@example.com', message: 'Hello, is the backend role still open?' };
const json = (o: object) => hit(JSON.stringify(o));

test('SQL injection: payloads are inert text (no database), never reach HTML, and bad emails are refused', async () => {
  armed();
  const sqli = ["' OR '1'='1' --", "'; DROP TABLE users; --", "1 UNION SELECT password FROM users", "admin'/*"];
  for (const p of sqli) assert.equal((await json({ ...good, name: `Asha ${p}`.slice(0, 100), message: `Hi ${p} there` })).status, 200);
  assert.ok(sent.every((s) => !('html' in s)), 'email must be plain text only');
  // An apostrophe alone is legal in real addresses (o'neil@...), so only payloads with spaces/semicolons must fail.
  for (const p of sqli.slice(0, 3)) assert.equal((await json({ ...good, email: `x${p}@example.com` })).status, 400);
});

test('XSS: script payloads are sent as plain text and never echoed back', async () => {
  armed();
  const xss = '<script>alert(1)</script><img src=x onerror=alert(1)>';
  const res = await json({ ...good, message: `Hello ${xss}` });
  assert.equal(res.status, 200);
  assert.equal(JSON.stringify(await res.json()).includes('<script'), false);
  assert.ok(!('html' in sent[0]));
});

test('Header injection: CR/LF in name cannot add headers; in email it is refused', async () => {
  armed();
  assert.equal((await json({ ...good, name: 'Asha\r\nBcc: victim@example.com' })).status, 200);
  assert.doesNotMatch(String(sent[0].subject), /[\r\n]/);
  assert.equal((await json({ ...good, email: 'asha@example.com\r\nBcc: victim@example.com' })).status, 400);
});

test('Address smuggling: lists, quotes, angle brackets and IP literals are refused', () => {
  // Second row: nodemailer addressparser bugs (GHSA-8c8m-p3m8-cjg8, -m943-m63m-w62w, -85x2-q946-cp5h), refused before they reach it.
  for (const email of ['a@example.com,b@example.com', 'a@example.com>,<b@example.com', '"a b"@example.com', 'a@[127.0.0.1]', 'a@localhost', 'a@exa_mple.com',
    'a((x)evil@attacker.com)@example.com', 'g:a@example.com;b@attacker.com', '"a>"@attacker.com', 'a(;b@attacker.com)@example.com'])
    assert.equal(validateContact({ ...good, email }).ok, false, email);
  for (const email of ['asha.rai+jobs@mail.example.com.np', "o'neil@example.co.uk"]) assert.equal(validateContact({ ...good, email }).ok, true, email);
});

test('Unicode tricks: control, zero-width and bidi-override characters are stripped (Trojan Source spoofing)', () => {
  const r = validateContact({ ...good, name: 'As‮ha​\u0000 Rai', message: 'Line one\nLine⁦ two\u0007 is here' });
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.data.name, 'Asha Rai');
    assert.equal(r.data.message, 'Line one\nLine two is here');
  }
});

test('Type confusion and prototype pollution are rejected or harmless', async () => {
  armed();
  assert.equal((await json({ ...good, name: ['Asha', 'Rai'] })).status, 400);
  assert.equal((await json({ ...good, email: { $ne: null } })).status, 400);
  await hit(`{"__proto__":{"polluted":true},"name":"Asha Rai","email":"asha@example.com","message":"Hello there, testing"}`);
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
  assert.equal((await hit('{not json')).status, 400);
});

test('Oversized bodies are refused with 413 before parsing', async () => {
  armed();
  const big = JSON.stringify({ ...good, message: 'x'.repeat(200_000) });
  const res = await hit(big);
  assert.equal(res.status, 413);
  assert.equal(sent.length, 0);
});

test('Only JSON and URL-encoded forms are accepted (text/plain and multipart are classic CSRF vectors)', async () => {
  armed();
  assert.equal((await hit(JSON.stringify(good), 'text/plain')).status, 415);
  assert.equal((await hit('--x\r\n', 'multipart/form-data; boundary=x')).status, 415);
  assert.equal(sent.length, 0);
});

test('API responses are never cached and 429 says when to retry', async () => {
  armed();
  const ok = await json(good);
  assert.equal(ok.headers.get('cache-control'), 'no-store');
  const from = () =>
    POST({
      request: new Request('http://localhost/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(good) }),
      clientAddress: '203.0.113.9',
      redirect: () => new Response(null, { status: 303 }),
    } as never) as Promise<Response>;
  for (let i = 0; i < 5; i++) await from();
  const limited = await from();
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
});

test('Rate limit keys: IPv6 is grouped per /64 (attackers rotate inside one), IPv4-mapped is unwrapped', () => {
  assert.equal(limitKey('2001:db8:1:2:aaaa::1'), limitKey('2001:db8:1:2:bbbb:cccc:dddd:2'));
  assert.notEqual(limitKey('2001:db8:1:2::1'), limitKey('2001:db8:1:3::1'));
  assert.equal(limitKey('2001:db8::1'), '2001:db8:0:0::/64');
  assert.equal(limitKey('::ffff:192.0.2.7'), '192.0.2.7');
  assert.equal(limitKey('192.0.2.7'), '192.0.2.7');
});

test('Rate limiter memory stays bounded under IP rotation', () => {
  const t0 = 5_000_000;
  for (let i = 0; i < 20_000; i++) allowRequest(`rot-${i}`, t0);
  allowRequest('fresh', t0 + 11 * 60_000); // later request prunes expired keys
  assert.ok(rateLimitKeys() < 100, `expected pruning, got ${rateLimitKeys()} keys`);
});
