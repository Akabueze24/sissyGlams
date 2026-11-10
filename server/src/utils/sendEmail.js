const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("sendEmail requires to and subject");
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error("SMTP env missing:", {
      host: !!host,
      user: !!user,
      pass: !!pass,
      port: process.env.SMTP_PORT,
    });
    throw new Error("Email is not configured on the server");
  }

  const port = Number(process.env.SMTP_PORT) || 2525; // 2525 often works better on cloud hosts than 587

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return transporter.sendMail({
    from: process.env.MAIL_FROM || "Sissy Dream <noreply@sissydream.test>",
    to,
    subject,
    text: text || "",
    html: html || undefined,
  });
}

module.exports = sendEmail;
