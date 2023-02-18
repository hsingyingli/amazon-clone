import express, { Router } from "express"
import { adminMiddleware, authMiddleware } from "../../middlewares/role"
import { ProductController } from "../../services/products-service/controllers/product-controller"
import { ProductDB } from "../../services/products-service/db"


const configureProductRoute = (db: ProductDB): Router => {
  const controller = new ProductController(db)
  const router = express.Router()

  router.post("", authMiddleware, controller.createProduct)
  router.get("", authMiddleware, controller.listProduct)
  router.patch("", authMiddleware, controller.updateProduct)
  router.delete("", authMiddleware, controller.deleteProduct)

  return router
}

export {
  configureProductRoute
}
