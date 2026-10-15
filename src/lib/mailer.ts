import nodemailer from 'nodemailer';

export type Mail = { to: string; replyTo: string; subject: string; text: string };

// Port 465 is implicit TLS; 587 starts plain and upgrades with STARTTLS. Getting `secure` wrong just hangs.
export function smtpConfig() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return {
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port,
    secure: port === 465,
    // Gmail shows app passwords in four spaced groups; SMTP wants them joined.
    auth: { user: process.env.SMTP_USER ?? '', pass: (process.env.SMTP_PASS ?? '').replace(/\s+/g, '') },
    // A serverless function must not sit on a dead socket until the platform kills it.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  };
}

// One object, so tests can swap `send` without opening a socket.
export const mailer = {
  async send(mail: Mail): Promise<boolean> {
    try {
      // Gmail rewrites `from` to the authenticated account, so there is nothing to configure; replyTo is the visitor.
      await nodemailer.createTransport(smtpConfig()).sendMail({ from: `Portfolio <${process.env.SMTP_USER}>`, ...mail });
      return true;
    } catch {
      return false; // the route turns this into a 502 and tells the visitor to email directly
    }
  },
};
