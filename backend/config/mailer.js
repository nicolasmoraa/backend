// config/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetEmail(to, resetUrl) {
  // Siempre logueamos la URL para pruebas (útil si no configuraste SMTP)
  console.log("🔔 Reset URL (dev):", resetUrl);

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: "Recuperación de contraseña - Ecommerce",
      html: `<p>Hiciste una solicitud para restablecer tu contraseña. El enlace caduca en 1 hora.</p>
             <p><a href="${resetUrl}">Hacé clic acá para restablecer la contraseña</a></p>`
    });
    console.log("📧 Mail de reset enviado:", info.messageId);
    return info;
  } catch (err) {
    console.warn("⚠️ No se pudo enviar el mail (check SMTP). Error:", err.message);
    throw err;
  }
}
