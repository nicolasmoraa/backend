const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");
const pm = new ProductManager();

router.get("/", async (req, res) => {
  const productos = await pm.getAll();
  res.json(productos);
});

router.get("/:pid", async (req, res) => {
  const producto = await pm.getById(Number(req.params.pid));
  producto ? res.json(producto) : res.status(404).send("Producto no encontrado");
});

router.post("/", async (req, res) => {
  const nuevo = await pm.addProduct(req.body);
  res.status(201).json(nuevo);
});

router.put("/:pid", async (req, res) => {
  const actualizado = await pm.updateProduct(Number(req.params.pid), req.body);
  actualizado ? res.json(actualizado) : res.status(404).send("Producto no encontrado");
});

router.delete("/:pid", async (req, res) => {
  await pm.deleteProduct(Number(req.params.pid));
  res.status(204).send();
});

module.exports = router;
