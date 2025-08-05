import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import path from "path";
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
connectDB();




const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

// Rutas
app.use("/", viewsRouter);

// WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado con WebSocket");
  // eventos personalizados acá
});

// Iniciar servidor
httpServer.listen(8081, () => {
  console.log("✅ Servidor corriendo en http://localhost:8081");
});

mongoose.connect("mongodb+srv://nicolas:nadielavaaadivinar@cluster0.wbgd2cc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("🟢 Conectado a MongoDB Atlas"))
  .catch(err => console.error("🔴 Error al conectar:", err));

