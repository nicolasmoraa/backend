import express from "express";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Servidor funcionando OK");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
