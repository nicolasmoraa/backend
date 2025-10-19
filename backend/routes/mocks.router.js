// routes/mocks.router.js
import { Router } from "express";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import { generateUsers, generatePets } from "../utils/mocking.js";

const router = Router();

/**
 * Migración de /mockingpets:
 * GET /api/mocks/mockingpets?count=50
 * Devuelve N pets generados (no guardados).
 */
router.get("/mockingpets", (req, res) => {
  const count = Number(req.query.count) || 50;
  const pets = generatePets(count);
  return res.json({ status: "success", payload: pets });
});

/**
 * GET /api/mocks/mockingusers?count=50
 * Genera N usuarios (en memoria) y los devuelve.
 */
router.get("/mockingusers", (req, res) => {
  const count = Number(req.query.count) || 50;
  const users = generateUsers(count);
  return res.json({ status: "success", payload: users });
});

/**
 * POST /api/mocks/generateData
 * Body JSON: { users: <num>, pets: <num> }
 * Genera y guarda en DB la cantidad solicitada.
 */
router.post("/generateData", async (req, res) => {
  try {
    const usersCount = Number(req.body.users) || 0;
    const petsCount = Number(req.body.pets) || 0;

    // Validaciones básicas
    if (usersCount < 0 || petsCount < 0) {
      return res.status(400).json({ status: "error", message: "Los valores deben ser >= 0" });
    }

    // Generar
    const usersToInsert = usersCount > 0 ? generateUsers(usersCount) : [];
    const petsToInsert = petsCount > 0 ? generatePets(petsCount) : [];

    // Insertar en DB (usar insertMany para eficiencia)
    const insertedPets = petsToInsert.length ? await Pet.insertMany(petsToInsert) : [];
    const insertedUsers = usersToInsert.length ? await User.insertMany(usersToInsert) : [];

    return res.json({
      status: "success",
      inserted: {
        users: insertedUsers.length,
        pets: insertedPets.length
      }
    });
  } catch (err) {
    console.error("ERROR /api/mocks/generateData:", err);
    // Si hay errores por duplicados (email unique) se puede capturar aquí.
    return res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;