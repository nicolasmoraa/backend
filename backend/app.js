import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager('./data/products.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Router de vistas
app.use('/', viewsRouter);

// Socket.io
io.on('connection', async (socket) => {
  console.log('🔌 Cliente conectado');

  // enviar productos actuales al conectar
  const productos = await productManager.getProducts();
  socket.emit('productos', productos);

  // agregar nuevo producto
  socket.on('nuevoProducto', async (prod) => {
    await productManager.addProduct(prod);
    const actualizados = await productManager.getProducts();
    io.emit('productos', actualizados);
  });

  // eliminar producto
  socket.on('eliminarProducto', async (id) => {
    await productManager.deleteProduct(id);
    const actualizados = await productManager.getProducts();
    io.emit('productos', actualizados);
  });
});

// Server
httpServer.listen(8080, () => {
  console.log('🚀 Servidor listo en http://localhost:8080');
});
