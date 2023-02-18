import { Request, Response } from "express";
import { ProductDB } from "../db";
import { Product } from "../schemas/schemas";


type CreateProductRequest = {
  title: string
  description: string
  price: number
  amount: number
  imageUrl: string
  categoryId: number
}

type UpdateProductRequest = {
  id: number
  title: string
  description: string
  price: number
  amount: number
  imageUrl: string
  categoryId: number
}

interface ProductControllerInterface {
  createProduct: (req: Request, res: Response) => Promise<void>
  listProduct: (req: Request, res: Response) => Promise<void>
  updateProduct: (req: Request, res: Response) => Promise<void>
  deleteProduct: (req: Request, res: Response) => Promise<void>
}

class ProductController implements ProductControllerInterface {
  private db: ProductDB
  constructor(db: ProductDB) {
    this.db = db

    this.createProduct = this.createProduct.bind(this)
    this.listProduct = this.listProduct.bind(this)
    this.updateProduct = this.updateProduct.bind(this)
    this.deleteProduct = this.deleteProduct.bind(this)
  }

  public async createProduct(req: Request, res: Response) {
    const { title, price, amount, description, imageUrl, categoryId }: CreateProductRequest = req.body
    try {
      const product = await this.db.createProduct(title, price, amount, description, imageUrl, categoryId)
      res.status(200).send({ product })
    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async listProduct(req: Request, res: Response) {
    let categoryId = req.query.categoryId
    let limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    let offset = req.query.offset ? parseInt(req.query.offset as string) : 0
    let products: Array<Product> = []
    try {
      if (categoryId === undefined) {
        products = await this.db.listProduct(limit, offset)
      } else {
        products = await this.db.listProductByCategory(parseInt(categoryId as string), limit, offset)
      }

      res.status(200).send({ products })
    } catch (error) {
      console.log(error)
      res.status(400).send({ error })
    }
  }

  public async updateProduct(req: Request, res: Response) {
    const { id, title, price, amount, description, imageUrl, categoryId }: UpdateProductRequest = req.body
    try {
      const now = new Date()
      const product = await this.db.updateProduct(id, title, price, amount, description, imageUrl, categoryId, now)
      res.status(200).send({ product })
    } catch (error) {
      console.log(error)
      res.status(400).send({ error })
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    const { id }: { id: number } = req.body
    try {
      await this.db.deleteProductById(id)
      res.status(204).send()
    } catch (error) {
      console.log(error)
      res.status(400).send({ error })
    }
  }
}

export {
  ProductController
}
