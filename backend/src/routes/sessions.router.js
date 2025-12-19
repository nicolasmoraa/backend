import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Sessions route OK" });
});

router.post("/login", (req, res) => {
  res.json({ message: "Login OK (mock)" });
});

export default router;
