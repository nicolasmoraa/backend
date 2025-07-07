const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../data/carts.json");
  }

  async getAll() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getById(id) {
    const carts = await this.getAll();
    return carts.find(c => c.id === id);
  }

  async createCart() {
    const carts = await this.getAll();
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getAll();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;

    const existing = cart.products.find(p => p.product === productId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;
