import mongoose, { Connection, Model, ConnectionStates, ConnectOptions } from "mongoose";
import { userSchema, UserInterface } from "./schemas/userSchema"

interface MongoDBInterface {
  connectionStatus: () => ConnectionStates
  createUser: (user: UserInfo) => Promise<UserInterface>
  findUserById: (id: string) => Promise<UserInterface | null>
  findUserByEmail: (email: string) => Promise<UserInterface | null>
  updateUser: (id: string, opt: UserUpdateOption) => Promise<UserInterface | null>
  deleteUser: (id: string) => Promise<UserInterface | null>
}

type UserInfo = {
  username: string
  role: "admin" | "user"
  password: string
  email: string
}

type UserUpdateOption = {
  username: string
  role: "admin" | "user"
  password: string
  email: string
}


class MongoDB implements MongoDBInterface {
  private conn: Connection
  private User: Model<UserInterface>

  constructor(conn: Connection) {
    this.conn = conn
    this.User = this.conn.model("User", userSchema)
  }

  public connectionStatus() {
    return this.conn.readyState
  }

  public async createUser(user: UserInfo) {
    const newUser = new this.User(user)
    return await newUser.save()
  }

  public async findUserById(id: string) {
    return await this.User.findById(id).exec()
  }

  public async findUserByEmail(email: string) {
    return await this.User.findOne({ email }).exec()
  }

  public async updateUser(id: string, opt: UserUpdateOption) {
    return await this.User.findByIdAndUpdate(id, opt, { new: true })
  }

  public async deleteUser(id: string) {
    return await this.User.findByIdAndRemove(id)
  }
}



export {
  MongoDB
}

export type {
  UserInfo,
  UserUpdateOption
}
