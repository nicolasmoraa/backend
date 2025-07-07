const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");
const cm = new CartManager();

router.post("/", async (req, res) => {
  const nuevoCarrito = await cm.createCart();
  res.status(201).json(nuevoCarrito);
});

router.get("/:cid", async (req, res) => {
  const carrito = await cm.getById(Number(req.params.cid));
  carrito ? res.json(carrito) : res.status(404).send("Carrito no encontrado");
});

router.post("/:cid/product/:pid", async (req, res) => {
  const carritoActualizado = await cm.addProductToCart(
    Number(req.params.cid),
    Number(req.params.pid)
  );
  carritoActualizado
    ? res.json(carritoActualizado)
    : res.status(404).send("Error al agregar producto");
});

module.exports = router;
