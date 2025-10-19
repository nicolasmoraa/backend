// utils/mocking.js
import bcrypt from "bcrypt";
import mongoose from "mongoose";

/**
 * Generadores simples para usuarios y pets.
 * No depende de faker para no añadir más dependencias.
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const speciesList = ["dog", "cat", "bird", "hamster", "fish"];
const firstNames = ["Alex","María","Juan","Lucía","Mateo","Sofía","Luis","Ana","Pedro","Carla"];
const lastNames = ["García","Pérez","Rodríguez","Martínez","López","Gómez","Sosa","Fernández"];

// Genera N pets (objetos con _id, name, species, age, createdAt)
export function generatePets(count = 10) {
  const pets = [];
  for (let i = 0; i < count; i++) {
    const _id = new mongoose.Types.ObjectId();
    pets.push({
      _id,
      name: `Pet-${_id.toString().slice(-6)}`,
      species: sample(speciesList),
      age: randInt(1, 15),
      createdAt: new Date()
    });
  }
  return pets;
}

// Genera N usuarios con password encriptada ("coder123"), role 'user'/'admin', pets: []
export function generateUsers(count = 50) {
  const users = [];
  const plainPassword = "coder123";
  const hashedPassword = bcrypt.hashSync(plainPassword, 10);

  for (let i = 0; i < count; i++) {
    const _id = new mongoose.Types.ObjectId();
    const first_name = sample(firstNames) + (i+1);
    const last_name = sample(lastNames);
    const suffix = _id.toString().slice(-6);
    const email = `user_${suffix}@mock.com`;

    // Random role: ~15% admin, 85% user
    const role = Math.random() < 0.15 ? "admin" : "user";

    users.push({
      _id,
      first_name,
      last_name,
      email,
      age: randInt(18, 75),
      password: hashedPassword, // encriptada
      role,
      pets: [],                 // ARRAY VACÍO como pide la consigna
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  return users;
}
