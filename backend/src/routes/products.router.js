import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

// GET todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json({ status: "success", payload: products });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

// POST nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

export default router;
