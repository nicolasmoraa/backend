import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

router.get('/', (_req, res) => res.redirect('/products'));

// /products -> paginación y render
router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query, category, status } = req.query;
  const filter = {};
  if (query) {
    const [k, v] = String(query).split(':');
    if (k === 'category' && v) filter.category = v;
    if (k === 'status' && typeof v !== 'undefined') filter.status = v === 'true';
  }
  if (category) filter.category = category;
  if (typeof status !== 'undefined') filter.status = status === 'true';

  const L = Math.max(parseInt(limit), 1);
  const P = Math.max(parseInt(page), 1);
  const sortOpt = {};
  if (sort === 'asc') sortOpt.price = 1;
  if (sort === 'desc') sortOpt.price = -1;

  const skip = (P - 1) * L;
  const [docs, total] = await Promise.all([
    Product.find(filter).sort(sortOpt).skip(skip).limit(L).lean(),
    Product.countDocuments(filter)
  ]);

  const totalPages = Math.max(Math.ceil(total / L), 1);
  const hasPrevPage = P > 1;
  const hasNextPage = P < totalPages;
  const makeLink = (p) => p ? `/products?${new URLSearchParams({ ...req.query, page: String(p) })}` : null;

  res.render('products', {
    title: 'Listado',
    products: docs,
    page: P,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevLink: makeLink(hasPrevPage ? P - 1 : null),
    nextLink: makeLink(hasNextPage ? P + 1 : null),
  });
});

// Product detail view
router.get('/products/:pid', async (req, res) => {
  const prod = await Product.findById(req.params.pid).lean();
  if (!prod) return res.status(404).send('Producto no encontrado');
  res.render('productDetail', { product: prod });
});

// Cart view
router.get('/carts/:cid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
  if (!cart) return res.status(404).send('Carrito no encontrado');
  res.render('cart', { cart });
});

export default router;
