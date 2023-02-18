import "dotenv/config"
import { App } from "./app"
import { connectToAdminDB, connectToProductDB } from "./db"

const adminDBUrl: string = process.env.ADMIN_DB_URL || ""
const productDBUrl: string = process.env.PRODUCT_DB_URL || ""
const port: string = process.env.PORT || "4001"


const start = async () => {
  try {
    const adminDB = await connectToAdminDB(adminDBUrl, {})
    const productDB = await connectToProductDB(productDBUrl)


    const app = new App(adminDB, productDB)

    app.listenAndServer(port, () => {
      console.log(`Server Listen on port: ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
