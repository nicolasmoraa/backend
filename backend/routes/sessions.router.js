import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

// 🟢 REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        error: "Faltan campos obligatorios (nombre, apellido, email, password)"
      });
    }

    // Verificar si el usuario ya existe
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hashear contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear usuario
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    console.error("ERROR en register:", err);
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
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    // Validar password
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error("ERROR en login:", err);
    res.status(500).json({ error: "Error en el servidor", detail: err.message });
  }
});

// 🟢 CURRENT (validar token)
router.get("/current", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ user: decoded });
  } catch (err) {
    console.error("ERROR en current:", err);
    res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
