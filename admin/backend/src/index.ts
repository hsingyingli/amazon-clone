import "dotenv/config"
import { App } from "./app"
import { connectToAdminDB } from "./db"



const dbUrl: string = process.env.ADMIN_DB_URL || ""
const port: string = process.env.PORT || "4001"

connectToAdminDB(dbUrl, {}).then((adminDB) => {
  console.log("connect to admin db")
  const app = new App(adminDB)

  app.listenAndServer(port, () => {
    console.log(`Server Listen on port: ${port}`)
  })
}).catch((error) => {
  console.log(error)
})


