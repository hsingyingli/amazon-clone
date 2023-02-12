import express, { Application } from "express"
import { configureAdminRoute } from "./routers/admin-router/user-router"
import { MongoDB } from "./services/admin-service/db"

class App {
  private app: Application
  private adminDB: MongoDB

  constructor(adminDB: MongoDB) {
    this.adminDB = adminDB
    this.app = express()
    this.configureMiddleware()
    this.configureRoutes()
  }

  private configureMiddleware() {
    this.app.use(express.json())
  }

  private configureRoutes() {
    const adminRouter = configureAdminRoute(this.adminDB)
    this.app.use("/admin", adminRouter)
    // const productsRouter =
    //this.app.use("/products")
  }

  public listenAndServer(port: string, cb: () => void) {
    this.app.listen(port, cb)
  }
}


export {
  App
}
