const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
  }

  async getAll() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getById(id) {
    const products = await this.getAll();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getAll();
    const newProduct = {
      ...product,
      id: products.length ? products[products.length - 1].id + 1 : 1,
    };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates, id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getAll();
    const filtered = products.filter(p => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
  }
}

module.exports = ProductManager;
