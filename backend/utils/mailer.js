// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter;

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // fallback ethereal (test)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log("⚠️ Usando Ethereal (email de prueba). Preview URL se mostrará en consola.");
  }
}

export async function sendMail({ to, subject, html, text }) {
  if (!transporter) await createTransporter();

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER || '"Dev Mail" <no-reply@example.com>',
    to,
    subject,
    text,
    html
  });

  // si ethereal, devuelve preview url
  if (nodemailer.getTestMessageUrl) {
    const url = nodemailer.getTestMessageUrl(info);
    if (url) console.log("Preview email URL:", url);
  }

  return info;
}
