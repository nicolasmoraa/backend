import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import sessionsRouter from "./routes/sessions.router.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/sessions", sessionsRouter);
console.log("✅ Router de sesiones montado en /api/sessions");

// Conexión a Mongo
await connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
