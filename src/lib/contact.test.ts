import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, allowRequest } from './contact.ts';

const good = { name: 'Asha Rai', email: 'asha@example.com', message: 'Hi Sabin, we have a backend role open.' };

test('accepts a valid message and trims it', () => {
  const r = validateContact({ ...good, name: '  Asha Rai  ' });
  assert.deepEqual(r, { ok: true, data: { ...good, topic: 'Other' } });
});

test('topic comes only from the allowlist, so nothing the visitor types reaches the subject line', () => {
  const topic = (subject: unknown) => {
    const r = validateContact({ ...good, subject });
    return r.ok && r.data.topic;
  };
  assert.equal(topic('role'), 'Role');
  assert.equal(topic('project'), 'Project');
  assert.equal(topic('Role\r\nBcc: x@evil.test'), 'Other');
  assert.equal(topic('__proto__'), 'Other');
  assert.equal(topic(undefined), 'Other');
});

test('rejects bad input and flags honeypot spam', () => {
  assert.equal(validateContact(null).ok, false);
  assert.equal(validateContact({ ...good, email: 'not-an-email' }).ok, false);
  assert.equal(validateContact({ ...good, email: 'asha@example..com' }).ok, false);
  assert.equal(validateContact({ ...good, email: 'asha.rai@mail.example.com.np' }).ok, true);
  assert.equal(validateContact({ ...good, name: 'A', message: 'H' }).ok, true); // one character is enough
  assert.equal(validateContact({ ...good, message: 'x'.repeat(5001) }).ok, false);
  assert.equal(validateContact({ ...good, name: 42 }).ok, false);
  const spam = validateContact({ ...good, company: 'Bots Inc' });
  assert.equal(spam.ok === false && spam.spam, true);
});

test('each failure names its field and the specific problem', () => {
  const err = (patch: object) => {
    const r = validateContact({ ...good, ...patch });
    return r.ok ? null : [r.field, r.error];
  };
  assert.deepEqual(err({ name: '' }), ['name', 'Please enter your name.']);
  assert.deepEqual(err({ email: ' ' }), ['email', 'Please enter your email address.']);
  assert.deepEqual(err({ email: 'asha@localhost' }), ['email', 'Please enter a valid email address, like name@example.com.']);
  assert.deepEqual(err({ message: '' }), ['message', 'Please write a message.']);
  assert.equal(err({ company: 'Bots Inc' })?.[0], undefined); // spam names no field, so the browser still posts it
});

test('rate limit allows 5 per window per key, then blocks, then recovers', () => {
  const t0 = 1_000_000;
  for (let i = 0; i < 5; i++) assert.equal(allowRequest('ip-a', t0 + i), true);
  assert.equal(allowRequest('ip-a', t0 + 10), false);
  assert.equal(allowRequest('ip-b', t0 + 10), true);
  assert.equal(allowRequest('ip-a', t0 + 10 * 60_000 + 10), true);
});
