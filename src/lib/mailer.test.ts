import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { smtpConfig } from './mailer.ts';

afterEach(() => {
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PASS;
});

test('SMTP defaults to Gmail on implicit TLS', () => {
  const c = smtpConfig();
  assert.equal(c.host, 'smtp.gmail.com');
  assert.equal(c.port, 465);
  assert.equal(c.secure, true);
});

test('Port 587 is STARTTLS, so it must not be opened as implicit TLS', () => {
  process.env.SMTP_PORT = '587';
  assert.equal(smtpConfig().secure, false);
});

test('App password pasted with Gmail spacing is joined', () => {
  process.env.SMTP_PASS = 'abcd efgh ijkl mnop';
  assert.equal(smtpConfig().auth.pass, 'abcdefghijklmnop');
});
