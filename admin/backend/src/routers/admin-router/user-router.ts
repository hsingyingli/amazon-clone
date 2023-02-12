import express, { Router } from "express"
import { adminMiddleware, authMiddleware } from "../../middlewares/role"
import { UserController } from "../../services/admin-service/controllers/user-controller"
import { MongoDB } from "../../services/admin-service/db"


const configureAdminRoute = (db: MongoDB): Router => {
  const controller = new UserController(db)
  const router = express.Router()

  // need to provide vaild token and user must be admin
  router.post("/admin/user", authMiddleware, adminMiddleware, controller.createUser)
  router.get("/admin/user", authMiddleware, adminMiddleware, controller.getUser)

  // need to provide vaild token
  router.get("/user/me", authMiddleware, controller.getCurrentUser)
  router.delete("/user/me", authMiddleware, controller.deleteUser)

  return router
}

export {
  configureAdminRoute
}
