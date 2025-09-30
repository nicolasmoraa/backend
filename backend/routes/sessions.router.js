// routes/sessions.router.js
import { Router } from "express";
import AuthService from "../services/auth.service.js";
import UserRepository from "../repositories/user.repository.js";
import { toUserDTO } from "../dtos/user.dto.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// registro
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const user = await AuthService.register({ first_name, last_name, email, age, password });
    res.status(201).json({ message: "Usuario creado", user: toUserDTO(user) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await AuthService.login({ email, password });
    res.json({ message: "Login exitoso", token, user: toUserDTO(user) });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// current -> ahora devuelve DTO (sin password)
router.get("/current", verifyToken, async (req, res) => {
  try {
    const user = await UserRepository.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ user: toUserDTO(user) });
  } catch (err) {
    res.status(500).json({ error: "Error en servidor" });
  }
});

// forgot -> enviar mail con token (expira 1h)
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });
    const { token } = await AuthService.generateResetToken(email);
    await AuthService.sendResetEmail(email, token);
    res.json({ message: "Email de recupero enviado (si existe usuario)" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// reset -> body { token, newPassword }
router.post("/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token y nueva contraseña requeridos" });
    const updated = await AuthService.resetPassword(token, newPassword);
    res.json({ message: "Contraseña actualizada", user: toUserDTO(updated) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
