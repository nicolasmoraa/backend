// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ error: "No token" });
    const parts = header.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "Formato inválido de Authorization" });
    const token = parts[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
