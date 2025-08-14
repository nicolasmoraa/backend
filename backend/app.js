import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { engine } from 'express-handlebars';
import path from 'path';
import { __dirname } from './utils.js';


import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const httpServer = createServer(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Conexión a Atlas
const MONGO_URI = 'PON_AQUI_TU_URI_DE_ATLAS';
await mongoose.connect(MONGO_URI, { dbName: 'ecommerce' });
console.log('✅ Conectado a MongoDB Atlas');

const PORT = process.env.PORT ?? 8081;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
