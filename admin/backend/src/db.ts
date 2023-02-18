import mongoose, { ConnectOptions } from "mongoose"
import { Pool } from "pg"
import { MongoDB } from "./services/admin-service/db"
import { ProductDB } from "./services/products-service/db"

const connectToAdminDB = async (dbUrl: string, opt: ConnectOptions): Promise<MongoDB> => {
  console.log("Connecting to Admin DB...")
  const conn = await mongoose.createConnection(dbUrl, opt).asPromise()

  if (conn.readyState !== 1) {
    throw new Error("Can't connect to DB")
  }

  const adminDB = new MongoDB(conn)
  return adminDB
}

const connectToProductDB = async (dbUrl: string) => {
  console.log("Connecting to Product DB...")
  const pool = new Pool({ connectionString: dbUrl })
  const productDB = new ProductDB(pool)
  return productDB
}


export {
  connectToAdminDB,
  connectToProductDB
}
