import { Pool } from "pg"
import * as query from "./query"
import { Category, Product } from "./schemas/schemas"


interface ProductDBInterface {
  createProduct: (title: string, price: number, amount: number, description: string, imageUrl: string, categoryId: number) => Promise<Product>
  updateProduct: (id: number, title: string, price: number, amount: number, description: string, imageUrl: string, categoryId: number, updatedAt: Date) => Promise<Product>
  listProduct: (limit: number, offset: number) => Promise<Array<Product>>
  listProductByCategory: (categoryId: number, limit: number, offset: number) => Promise<Array<Product>>
  deleteProductById: (id: number) => Promise<void>

  createCategory: (title: string) => Promise<Category>
  listCategory: () => Promise<Array<Category>>
  updateCategory: (id: number, title: string, updatedAt: Date) => Promise<Category>
  deleteCategoryById: (id: number) => Promise<void>
}

class ProductDB implements ProductDBInterface {
  private conn: Pool

  constructor(conn: Pool) {
    this.conn = conn

    this.createProduct = this.createProduct.bind(this)
    this.listProduct = this.listProduct.bind(this)
    this.listProductByCategory = this.listProductByCategory.bind(this)
    this.deleteProductById = this.deleteProductById.bind(this)
    this.updateProduct = this.updateProduct.bind(this)

    this.createCategory = this.createCategory.bind(this)
    this.deleteCategoryById = this.deleteCategoryById.bind(this)
  }

  public async createProduct(title: string, price: number, amount: number, description: string, imageUrl: string, categoryId: number) {
    const values = [title, price, amount, description, imageUrl, categoryId]
    const res = await this.conn.query(query.createProduct, values)
    return res.rows[0] as Product
  }

  public async updateProduct(id: number, title: string, price: number, amount: number, description: string, imageUrl: string, categoryId: number, updatedAt: Date) {
    const values = [id, title, price, amount, description, imageUrl, categoryId, updatedAt]
    const res = await this.conn.query(query.updateProduct, values)
    return res.rows[0] as Product
  }

  public async listProduct(limit: number, offset: number) {
    const values = [limit, offset]
    const res = await this.conn.query(query.listAllProduct, values)
    return res.rows as Array<Product>
  }

  public async listProductByCategory(categoryId: number, limit: number, offset: number) {
    const values = [categoryId, limit, offset]
    const res = await this.conn.query(query.listProductByCategory, values)
    return res.rows as Array<Product>
  }

  public async deleteProductById(id: number) {
    const values = [id]
    await this.conn.query(query.deleteProductById, values)
  }

  public async createCategory(title: string) {
    const values = [title]
    const res = await this.conn.query(query.createCategory, values)
    return res.rows[0] as Category
  }

  public async listCategory() {
    const res = await this.conn.query(query.listCategory)
    return res.rows as Array<Category>
  }

  public async updateCategory(id: number, title: string, updatedAt: Date) {
    const values = [id, title, updatedAt]
    const res = await this.conn.query(query.updateCategory, values)
    return res.rows[0] as Category
  }

  public async deleteCategoryById(id: number) {
    const values = [id]
    await this.conn.query(query.deleteCategoryById, values)
  }

}

export {
  ProductDB
}

