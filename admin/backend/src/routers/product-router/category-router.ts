import express, { Router } from "express"
import { adminMiddleware, authMiddleware } from "../../middlewares/role"
import { CategoryController } from "../../services/products-service/controllers/category-controller"
import { ProductDB } from "../../services/products-service/db"


const configureCategoryRoute = (db: ProductDB): Router => {
  const controller = new CategoryController(db)
  const router = express.Router()

  router.post("", authMiddleware, controller.createCategory)
  router.get("", authMiddleware, controller.listCategory)
  router.patch("", authMiddleware, controller.updateCategory)
  router.delete("", authMiddleware, controller.deleteCategory)

  return router
}

export {
  configureCategoryRoute
}
