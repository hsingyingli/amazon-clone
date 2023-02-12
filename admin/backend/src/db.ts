import mongoose, { ConnectOptions } from "mongoose"
import { MongoDB } from "./services/admin-service/db"

const connectToAdminDB = async (dbUrl: string, opt: ConnectOptions): Promise<MongoDB> => {
  console.log("Connecting...")
  const conn = await mongoose.createConnection(dbUrl, opt).asPromise()

  if (conn.readyState !== 1) {
    throw new Error("Can't connect to DB")
  }

  const adminDB = new MongoDB(conn)
  return adminDB
}

export {
  connectToAdminDB
}
