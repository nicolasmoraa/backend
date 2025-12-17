import { Router } from "express";
import UserRepository from "../repositories/user.repository.js";
import { toUserDTO } from "../dto/user.dto.js";

const router = Router();
const userRepo = new UserRepository();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints del módulo de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", async (req, res) => {
  try {
    const users = await userRepo.getAll();
    res.json(users.map(u => toUserDTO(u)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", async (req, res) => {
  try { const user = await userRepo.getById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(toUserDTO(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
