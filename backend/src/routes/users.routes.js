import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Users route OK" });
});

router.post("/", (req, res) => {
  res.json({ message: "User created (mock)" });
});

export default router;
