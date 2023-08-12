 import { promises as fs } from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.readProducts();
  }

  async readProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }
  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error saving products', error);
    }
  }
  async addProduct(product) {
    const newProduct = {
      ...product,
      id: await this.#nuevoId(), 
    };
    this.products.push(newProduct);
    await this.saveProducts();
  }

  async getProducts() {
    await this.readProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.readProducts();
    const product = this.products.find((product) => product.id === id);

    if (product) {
      return product;
    } else {
      console.log('Not found');
      return null;
    }
  }

  async updateProduct(id, updatedFields) {
    await this.readProducts();
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedFields,
        id: id, 
      };
      await this.saveProducts();
      return true;
    } else {
      console.log('Product not found');
      return false;
    }
  }

  async deleteProduct(id) {
    await this.readProducts();
    this.products = this.products.filter((product) => product.id !== id);
    await this.saveProducts();
  }

  async #nuevoId() {
    await this.readProducts();
    let maxId = 0;
    this.products.forEach((product) => {
      if (product.id > maxId) maxId = product.id;
    });
    return maxId + 1;
  }
}

export default ProductManager