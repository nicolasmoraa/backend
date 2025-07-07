const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Bienvenido a la API del ecommerce de viajes.");
});
