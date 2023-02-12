import bcrypt from "bcrypt"
import { Request, Response } from "express";
import { AuthRequest } from "../../../middlewares/role";
import { MongoDB, UserInfo } from "../db";
import { UserInterface } from "../schemas/userSchema";

interface UserControllerInterface {
  createUser: (req: Request, res: Response) => Promise<void>
  getUser: (req: Request, res: Response) => Promise<void>
  getCurrentUser: (req: AuthRequest, res: Response) => Promise<void>
  updateUser: (req: Request, res: Response) => Promise<void>
  deleteUser: (req: Request, res: Response) => Promise<void>
}

type UserResponse = {
  username: string
  email: string
  role: "admin" | "user"
}

type GetUserRequest = {
  id?: string
  email?: string
}

class UserController implements UserControllerInterface {
  private db: MongoDB
  constructor(db: MongoDB) {
    this.db = db
  }

  public async createUser(req: Request, res: Response) {
    const { username, email, password, role }: UserInfo = req.body
    try {
      const salt: string = process.env.SALT || ""
      const hashedPassword = await bcrypt.hash(password, salt)
      await this.db.createUser({ username, email, role, password: hashedPassword })
      res.status(204)
    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async getUser(req: Request, res: Response) {
    const { id, email }: GetUserRequest = req.query
    // check if id or email is provided 
    if (id === undefined && email === undefined) {
      res.status(400).send({ "message": "must provide one of id and email" })
      return
    }
    try {
      let user: UserInterface | null = null
      if (id !== undefined) {
        user = await this.db.findUserById(id)
      } else if (email !== undefined) {
        user = await this.db.findUserByEmail(email)
      }

      if (user === null) {
        res.status(404).send({ "error": "Not found" })
        return
      }

      const resp: UserResponse = {
        username: user.username as string,
        email: user.email as string,
        role: user.role
      }

      res.status(200).send({ "user": resp })

    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const payload = req.payload
      if (payload === undefined) {
        throw new Error("Not auth")
      }

      const user = await this.db.findUserById(payload.uid as string)

      if (user === null) {
        throw new Error("Not auth")
      }

      const resp: UserResponse = {
        username: user.username as string,
        email: user.email as string,
        role: user.role
      }
      res.status(200).send({ "user": resp })
    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async updateUser(req: AuthRequest, res: Response) {
  }

  public async deleteUser(req: AuthRequest, res: Response) {
    try {
      const payload = req.payload
      if (payload === undefined) {
        throw new Error("not auth")
      }

      const user = await this.db.deleteUser(payload.id)

      if (user === null) {
        res.status(404).send({ "message": "Not found" })
        return
      }
      res.status(204)
    } catch (error) {
      res.status(400).send({ error })
    }
  }
}

export {
  UserController
}
