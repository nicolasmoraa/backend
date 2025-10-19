import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "../repositories/user.repository.js";
import { toUserDTO } from "../dto/user.dto.js";
import { authService } from "../services/auth.service.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
const userRepo = new UserRepository();


// 🟢 REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios (nombre, apellido, email, password)" });
    }

    // Verificar si el usuario ya existe
    const exists = await userRepo.findByEmail(email);
    if (exists) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hashear contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear usuario
    const user = await userRepo.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: toUserDTO(user), // se devuelve DTO (sin password)
    });
  } catch (err) {
    console.error("❌ ERROR en register:", err);
    res.status(500).json({ error: "Error en el servidor", detail: err.message });
  }
});


// 🟢 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario
    const user = await userRepo.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    // Validar password
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Crear token JWT
    const token = authService.generateToken(user);

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error("❌ ERROR en login:", err);
    res.status(500).json({ error: "Error en el servidor", detail: err.message });
  }
});


// 🟢 CURRENT (validar token con middleware)
router.get("/current", verifyToken, async (req, res) => {
  try {
    res.json({ user: toUserDTO(req.user) });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
