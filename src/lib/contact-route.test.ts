import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../pages/api/contact.ts';
import { mailer, type Mail } from './mailer.ts';

// Drives the real route handler with a fake SMTP transport; no network, no email sent.
const realSend = mailer.send;
let calls: Mail[] = [];
const fakeSmtp = (ok: boolean) => {
  calls = [];
  mailer.send = async (mail: Mail) => {
    calls.push(mail);
    return ok;
  };
};
afterEach(() => {
  mailer.send = realSend;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
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
  process.env.SMTP_USER = 'owner@gmail.com';
  process.env.SMTP_PASS = 'app password';
  process.env.CONTACT_TO = 'owner@example.com';
};

test('JSON: invalid input is a 400 with a message; nothing is sent', async () => {
  fakeSmtp(true);
  const res = await json({ ...good, email: 'nope' });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /valid email/);
  assert.equal(calls.length, 0);
});

test('JSON: honeypot gets a fake success and nothing is sent', async () => {
  configure();
  fakeSmtp(true);
  const res = await json({ ...good, company: 'Bots Inc' });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('JSON: missing email config is a 503', async () => {
  fakeSmtp(true);
  assert.equal((await json(good)).status, 503);
  assert.equal(calls.length, 0);
});

test('JSON: valid message goes to the owner with the visitor as reply-to', async () => {
  configure();
  fakeSmtp(true);
  const res = await json(good);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls[0].to, 'owner@example.com');
  assert.equal(calls[0].replyTo, good.email);
  assert.match(calls[0].subject, /Asha Rai/);
  assert.match(calls[0].text, /backend role/);
});

test('JSON: a refused send is a 502', async () => {
  configure();
  fakeSmtp(false);
  assert.equal((await json(good)).status, 502);
});

test('Form posts redirect back to the contact section', async () => {
  configure();
  fakeSmtp(true);
  const ok = await form(good);
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get('Location'), '/?sent=1#contact');
  const bad = await form({ ...good, message: 'hi' });
  assert.equal(bad.headers.get('Location'), '/?sent=0#contact');
});

test('Sixth message from one address within the window is a 429', async () => {
  configure();
  fakeSmtp(true);
  const from = (n: number) =>
    POST({
      request: new Request('http://localhost/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(good) }),
      clientAddress: '192.0.2.1',
      redirect: () => new Response(null, { status: 303 }),
    } as never) as Promise<Response>;
  for (let i = 0; i < 5; i++) assert.equal((await from(i)).status, 200);
  assert.equal((await from(6)).status, 429);
});
