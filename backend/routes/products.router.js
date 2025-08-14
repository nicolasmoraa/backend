// backend/routes/products.router.js
import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products?limit=10&page=1&sort=asc&query=category:playa
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query, category, status } = req.query;

    // --- filtro
    const filter = {};
    if (query) {
      const [k, v] = String(query).split(':');
      if (k === 'category' && v) filter.category = v;
      if (k === 'status' && typeof v !== 'undefined') filter.status = v === 'true';
    }
    if (category) filter.category = category;
    if (typeof status !== 'undefined') filter.status = status === 'true';

    const L = Math.max(parseInt(limit) || 10, 1);
    const P = Math.max(parseInt(page) || 1, 1);

    const sortOpt = {};
    if (sort === 'asc') sortOpt.price = 1;
    if (sort === 'desc') sortOpt.price = -1;

    const skip = (P - 1) * L;

    const [docs, totalDocs] = await Promise.all([
      Product.find(filter).sort(sortOpt).skip(skip).limit(L).lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.max(Math.ceil(totalDocs / L), 1);
    const hasPrevPage = P > 1;
    const hasNextPage = P < totalPages;

    // Construir links completos (host + base)
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`; // ej: http://localhost:8081/api/products
    const makeLink = (p) => {
      if (!p) return null;
      const params = new URLSearchParams({ ...req.query, page: String(p) });
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: 'success',
      payload: docs,
      totalPages,
      prevPage: hasPrevPage ? P - 1 : null,
      nextPage: hasNextPage ? P + 1 : null,
      page: P,
      hasPrevPage,
      hasNextPage,
      prevLink: makeLink(hasPrevPage ? P - 1 : null),
      nextLink: makeLink(hasNextPage ? P + 1 : null),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

// Otros endpoints CRUD para products (opcionales: GET/:pid POST PUT DELETE)
router.get('/:pid', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.pid).lean();
    if (!prod) return res.status(404).json({ status: 'error', error: 'Not found' });
    res.json({ status: 'success', payload: prod });
  } catch { res.status(400).json({ status: 'error', error: 'Invalid id' }); }
});

router.post('/', async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: created });
  } catch (err) { res.status(400).json({ status: 'error', error: err.message }); }
});

router.put('/:pid', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ status: 'error', error: 'Not found' });
    res.json({ status: 'success', payload: updated });
  } catch { res.status(400).json({ status: 'error', error: 'Invalid id' }); }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: 'error', error: 'Not found' });
    res.json({ status: 'success', payload: deleted._id });
  } catch { res.status(400).json({ status: 'error', error: 'Invalid id' }); }
});

export default router;

