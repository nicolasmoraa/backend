// backend/routes/carts.router.js
import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = Router();

// POST /api/carts  -> crear carrito vacío
router.post('/', async (_req, res) => {
  const cart = await Cart.create({ products: [] });
  res.status(201).json({ status: 'success', payload: cart });
});

// GET /api/carts/:cid -> traer carrito con populate
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch { res.status(400).json({ status: 'error', error: 'Invalid id' }); }
});

// POST /api/carts/:cid/product/:pid -> agregar/incrementar
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const prod = await Product.findById(pid);
  if (!prod) return res.status(404).json({ status: 'error', error: 'Product not found' });

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  const item = cart.products.find(p => p.product.toString() === pid);
  if (item) item.quantity += 1;
  else cart.products.push({ product: pid, quantity: 1 });

  await cart.save();
  res.json({ status: 'success', payload: cart });
});

// DELETE /api/carts/:cid/products/:pid -> eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const updated = await Cart.findByIdAndUpdate(
    req.params.cid,
    { $pull: { products: { product: req.params.pid } } },
    { new: true }
  ).populate('products.product').lean();

  if (!updated) return res.status(404).json({ status: 'error', error: 'Cart not found' });
  res.json({ status: 'success', payload: updated });
});

// PUT /api/carts/:cid -> reemplazar todo el arreglo de products
router.put('/:cid', async (req, res) => {
  const { products } = req.body; // [{ product: "<id>", quantity: 2 }, ...]
  if (!Array.isArray(products)) return res.status(400).json({ status: 'error', error: 'products must be an array' });

  const cart = await Cart.findByIdAndUpdate(req.params.cid, { $set: { products } }, { new: true }).populate('products.product').lean();
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
  res.json({ status: 'success', payload: cart });
});

// PUT /api/carts/:cid/products/:pid -> actualizar SOLO la cantidad
router.put('/:cid/products/:pid', async (req, res) => {
  const { quantity } = req.body;
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ status: 'error', error: 'quantity must be a positive integer' });

  const cart = await Cart.findById(req.params.cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  const item = cart.products.find(p => p.product.toString() === req.params.pid);
  if (!item) return res.status(404).json({ status: 'error', error: 'Product not in cart' });

  item.quantity = quantity;
  await cart.save();
  await cart.populate('products.product').execPopulate(); // si querés la versión poblada
  const cartPop = await Cart.findById(req.params.cid).populate('products.product').lean();
  res.json({ status: 'success', payload: cartPop });
});

// DELETE /api/carts/:cid -> vaciar carrito
router.delete('/:cid', async (req, res) => {
  const cart = await Cart.findByIdAndUpdate(req.params.cid, { $set: { products: [] } }, { new: true }).populate('products.product').lean();
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
  res.json({ status: 'success', payload: cart });
});

export default router;
