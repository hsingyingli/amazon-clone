import cookieParser from "cookie-parser"
import cors from 'cors';
import express, { Application } from "express"
import { configureAdminRoute } from "./routers/admin-router/user-router"
import { configureCategoryRoute } from "./routers/product-router/category-router";
import { configureProductRoute } from "./routers/product-router/product-router";
import { MongoDB } from "./services/admin-service/db"
import { ProductDB } from "./services/products-service/db";


const ORIGIN = process.env.ORIGIN || ""

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    ORIGIN
  ],
  credentials: true
};


class App {
  private app: Application
  private adminDB: MongoDB
  private productDB: ProductDB

  constructor(adminDB: MongoDB, productDB: ProductDB) {
    this.adminDB = adminDB
    this.productDB = productDB
    this.app = express()
    this.configureMiddleware()
    this.configureRoutes()
  }

  private configureMiddleware() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json())
    this.app.use(cookieParser())
  }

  private configureRoutes() {
    const adminRouter = configureAdminRoute(this.adminDB)
    this.app.use("", adminRouter)

    const productsRouter = configureProductRoute(this.productDB)
    this.app.use("/products", productsRouter)

    const categoryRouter = configureCategoryRoute(this.productDB)
    this.app.use("/categories", categoryRouter)
  }

  public listenAndServer(port: string, cb: () => void) {
    this.app.listen(port, cb)
  }
}


export {
  App
}
