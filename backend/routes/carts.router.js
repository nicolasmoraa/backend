import { Router } from "express";
import { CartModel } from "../models/cart.model.js";

const router = Router();

// Crear un carrito vacío
router.post("/", async (req, res) => {
  try {
    const cart = await CartModel.create({ products: [] });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

// Obtener carrito por id (populate)
router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate("products.product");
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

export default router;
