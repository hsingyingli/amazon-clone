import cookieParser from "cookie-parser"
import cors from 'cors';
import express, { Application } from "express"
import { configureAdminRoute } from "./routers/admin-router/user-router"
import { MongoDB } from "./services/admin-service/db"


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

  constructor(adminDB: MongoDB) {
    this.adminDB = adminDB
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
