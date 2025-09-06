import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

// 🔹 Registro
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // verificar si ya existe
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "El usuario ya existe" });

    // encriptar
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res.status(201).json({ message: "Usuario registrado", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Current (validar token)
router.get("/current", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
