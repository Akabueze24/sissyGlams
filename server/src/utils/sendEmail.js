const nodemailer = require("nodemailer");

/**
 * Send one email via SMTP (Mailtrap in dev).
 * @param {{ to: string, subject: string, text?: string, html?: string }} options
 */

async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("sendEmail requires to and subject");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // 587 = STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "Sissy Dream <noreply@sissydream.test>",
    to,
    subject,
    text: text || "",
    html: html || undefined,
  });

  return info;
}

module.exports = sendEmail;
