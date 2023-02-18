import { Request, Response } from "express";
import { ProductDB } from "../db";


interface CategoryControllerInterface {
  createCategory: (req: Request, res: Response) => Promise<void>
  listCategory: (req: Request, res: Response) => Promise<void>
  deleteCategory: (req: Request, res: Response) => Promise<void>
}

class CategoryController implements CategoryControllerInterface {
  private db: ProductDB
  constructor(db: ProductDB) {
    this.db = db

    this.createCategory = this.createCategory.bind(this)
    this.listCategory = this.listCategory.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this)
  }

  public async createCategory(req: Request, res: Response) {
    const { title }: { title: string } = req.body
    try {
      const category = await this.db.createCategory(title)
      res.status(200).send({ category })
    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async listCategory(req: Request, res: Response) {
    try {
      const categories = await this.db.listCategory()
      res.status(200).send({ categories })
    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async updateCategory(req: Request, res: Response) {
    const { id, title }: { id: number, title: string } = req.body
    try {
      const now = new Date()
      const category = await this.db.updateCategory(id, title, now)
      res.status(200).send({ category })
    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async deleteCategory(req: Request, res: Response) {
    const { id }: { id: number } = req.body
    try {
      await this.db.deleteCategoryById(id)
      res.status(204).send()
    } catch (error) {
      console.log(error)
      res.status(400).send({ error })
    }
  }
}

export {
  CategoryController
}
