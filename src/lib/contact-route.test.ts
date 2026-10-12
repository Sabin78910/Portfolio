import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../pages/api/contact.ts';

// Drives the real route handler with a fake Resend; no network, no email sent.
const realFetch = globalThis.fetch;
let calls: { url: string; init: RequestInit }[] = [];
const fakeResend = (status: number) => {
  calls = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response('{}', { status });
  }) as typeof fetch;
};
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO;
});

let ip = 0;
const call = (body: string, contentType: string) =>
  POST({
    request: new Request('http://localhost/api/contact', { method: 'POST', headers: { 'content-type': contentType }, body }),
    clientAddress: `10.0.0.${++ip}`, // fresh address per call so the rate limiter stays out of the way
    redirect: (to: string, status: number) => new Response(null, { status, headers: { Location: to } }),
  } as never) as Promise<Response>;

const good = { name: 'Asha Rai', email: 'asha@example.com', message: 'Hello, is the backend role open?' };
const json = (o: object) => call(JSON.stringify(o), 'application/json');
const form = (o: Record<string, string>) => call(new URLSearchParams(o).toString(), 'application/x-www-form-urlencoded');
const configure = () => {
  process.env.RESEND_API_KEY = 're_test';
  process.env.CONTACT_TO = 'owner@example.com';
};

test('JSON: invalid input is a 400 with a message; nothing is sent', async () => {
  fakeResend(200);
  const res = await json({ ...good, email: 'nope' });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /valid email/);
  assert.equal(calls.length, 0);
});

test('JSON: honeypot gets a fake success and nothing is sent', async () => {
  configure();
  fakeResend(200);
  const res = await json({ ...good, company: 'Bots Inc' });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('JSON: missing email config is a 503', async () => {
  fakeResend(200);
  assert.equal((await json(good)).status, 503);
  assert.equal(calls.length, 0);
});

test('JSON: valid message is sent to Resend with reply-to and a timeout', async () => {
  configure();
  fakeResend(200);
  const res = await json(good);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal((calls[0].init.headers as Record<string, string>).Authorization, 'Bearer re_test');
  const sent = JSON.parse(calls[0].init.body as string);
  assert.deepEqual(sent.to, ['owner@example.com']);
  assert.equal(sent.reply_to, good.email);
  assert.ok(calls[0].init.signal, 'request must carry an abort signal');
});

test('JSON: Resend failure is a 502', async () => {
  configure();
  fakeResend(500);
  assert.equal((await json(good)).status, 502);
});

test('Form posts redirect back to the contact section', async () => {
  configure();
  fakeResend(200);
  const ok = await form(good);
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get('Location'), '/?sent=1#contact');
  const bad = await form({ ...good, message: 'hi' });
  assert.equal(bad.headers.get('Location'), '/?sent=0#contact');
});

test('Sixth message from one address within the window is a 429', async () => {
  configure();
  fakeResend(200);
  const from = (n: number) =>
    POST({
      request: new Request('http://localhost/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(good) }),
      clientAddress: '192.0.2.1',
      redirect: () => new Response(null, { status: 303 }),
    } as never) as Promise<Response>;
  for (let i = 0; i < 5; i++) assert.equal((await from(i)).status, 200);
  assert.equal((await from(6)).status, 429);
});
