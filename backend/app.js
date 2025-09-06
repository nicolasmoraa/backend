import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
app.use("/api/sessions", sessionsRouter);

// mongo
await connectDB();

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
