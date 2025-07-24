import fs from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async addProduct(producto) {
    const productos = await this.getProducts();
    const nuevo = {
      id: Date.now().toString(),
      ...producto,
    };
    productos.push(nuevo);
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
  }

  async deleteProduct(id) {
    let productos = await this.getProducts();
    productos = productos.filter((p) => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
  }
}

export default ProductManager;
