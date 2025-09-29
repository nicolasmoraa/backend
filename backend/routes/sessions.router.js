// routes/sessions.router.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendResetEmail } from "../config/mailer.js";
import dotenv from "dotenv";
dotenv.config();

const repo = new UserRepository();
const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios (first_name, last_name, email, password)" });
    }
    const user = await repo.register({ first_name, last_name, email, age, password });
    res.status(201).json({ message: "Usuario creado", userId: user._id });
  } catch (err) {
    if (err.message === "USER_EXISTS") return res.status(400).json({ error: "El usuario ya existe" });
    console.error("ERROR register:", err);
    res.status(500).json({ error: "Error en servidor", detail: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email y contraseña requeridos" });

    const user = await repo.validatePassword(email, password);
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error("ERROR login:", err);
    res.status(500).json({ error: "Error en servidor", detail: err.message });
  }
});

// CURRENT (devuelve DTO sin password)
router.get("/current", authMiddleware, async (req, res) => {
  try {
    const user = await repo.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const dto = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart
    };

    res.json({ user: dto });
  } catch (err) {
    console.error("ERROR current:", err);
    res.status(500).json({ error: "Error en servidor", detail: err.message });
  }
});

// FORGOT (envía link de reset)
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const user = await repo.findByEmail(email);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const resetToken = jwt.sign({ id: user._id, email: user.email }, process.env.RESET_JWT_SECRET, { expiresIn: process.env.RESET_EXPIRES_IN || "1h" });
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    await repo.setReset(user._id, resetToken, expiry);

    const resetUrl = `http://localhost:${process.env.PORT || 8080}/api/sessions/reset/${resetToken}`;
    // send email (o console.log)
    try {
      await sendResetEmail(user.email, resetUrl);
    } catch (err) {
      // si falla el envío, igual devolvemos el URL en la respuesta en modo dev (no en producción)
      console.warn("No se pudo enviar mail, mostrando resetUrl para dev (solo debug).");
    }

    res.json({ message: "Si el email existe se envió un enlace de recuperación (revisá consola si estás en dev)." });
  } catch (err) {
    console.error("ERROR forgot:", err);
    res.status(500).json({ error: "Error en servidor", detail: err.message });
  }
});

// RESET (token en URL)
router.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password: newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ error: "Nueva contraseña requerida" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.RESET_JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const user = await repo.findById(payload.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Validar que token coincida con el guardado y no expiró
    if (!user.resetToken || user.resetToken !== token || new Date() > user.resetExpires) {
      return res.status(400).json({ error: "Token inválido o caducado" });
    }

    // Evitar pasar la misma contraseña anterior
    const bcrypt = (await import("bcrypt")).default;
    const same = bcrypt.compareSync(newPassword, user.password);
    if (same) return res.status(400).json({ error: "No podés usar la misma contraseña anterior" });

    await repo.updatePassword(user._id, newPassword);
    await repo.clearReset(user._id);

    res.json({ message: "Contraseña restablecida correctamente" });
  } catch (err) {
    console.error("ERROR reset:", err);
    res.status(500).json({ error: "Error en servidor", detail: err.message });
  }
});

export default router;
