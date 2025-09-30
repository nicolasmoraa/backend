// services/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import { sendMail } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET;

const AuthService = {
  register: async ({ first_name, last_name, email, age, password }) => {
    const exists = await UserRepository.findByEmail(email);
    if (exists) throw new Error("El usuario ya existe");
    const hashed = bcrypt.hashSync(password, 10);
    const newUser = await UserRepository.create({
      first_name,
      last_name,
      email,
      age,
      password: hashed
    });
    return newUser;
  },

  login: async ({ email, password }) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) throw new Error("Contraseña incorrecta");
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { token, user };
  },

  generateResetToken: async (email) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");
    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_RESET_SECRET, { expiresIn: "1h" });
    return { token, user };
  },

  sendResetEmail: async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    const html = `
      <p>Hiciste una solicitud para cambiar tu contraseña.</p>
      <p>Este link expira en 1 hora.</p>
      <a href="${resetUrl}">Hacé click acá para cambiar tu contraseña</a>
    `;
    const info = await sendMail({
      to: email,
      subject: "Recuperar contraseña",
      html,
      text: `Link para reset: ${resetUrl}`
    });
    return info;
  },

  resetPassword: async (token, newPassword) => {
    let payload;
    try {
      payload = jwt.verify(token, JWT_RESET_SECRET);
    } catch (err) {
      throw new Error("Token inválido o expirado");
    }
    const user = await UserRepository.findById(payload.id);
    if (!user) throw new Error("Usuario no encontrado");

    // evitar misma contraseña
    const same = bcrypt.compareSync(newPassword, user.password);
    if (same) throw new Error("La nueva contraseña no puede ser igual a la anterior");

    const hashed = bcrypt.hashSync(newPassword, 10);
    const updated = await UserRepository.updateById(user._id, { password: hashed });
    return updated;
  }
};

export default AuthService;
