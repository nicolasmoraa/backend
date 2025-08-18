import express from "express";
import { connectDB } from "./config/db.js"; // 👈 importa la función

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a Mongo
connectDB();

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
