import bcrypt from "bcrypt"
import { Request, Response } from "express";
import { AuthRequest } from "../../../middlewares/role";
import { createToken, verifyToken } from "../../../utils/tokenMaker/jwt-maker";
import { MongoDB, UserInfo } from "../db";
import { UserInterface } from "../schemas/userSchema";

type UserResponse = {
  username: string
  email: string
  role: "admin" | "user"
}

type GetUserRequest = {
  id?: string
  email?: string
}

type LoginUserRequest = {
  email: string
  password: string
}

interface UserControllerInterface {
  createUser: (req: Request, res: Response) => Promise<void>
  getUser: (req: Request, res: Response) => Promise<void>
  getCurrentUser: (req: AuthRequest, res: Response) => Promise<void>
  updateUser: (req: Request, res: Response) => Promise<void>
  deleteUser: (req: Request, res: Response) => Promise<void>
  loginUser: (req: Request, res: Response) => Promise<void>
  logoutUser: (req: Request, res: Response) => Promise<void>
  renewAccess: (req: Request, res: Response) => Promise<void>
}


class UserController implements UserControllerInterface {
  private db: MongoDB
  constructor(db: MongoDB) {
    this.db = db

    this.createUser = this.createUser.bind(this)
    this.createUser = this.createUser.bind(this)
    this.getUser = this.getUser.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
    this.renewAccess = this.renewAccess.bind(this)
  }

  public async createUser(req: Request, res: Response) {
    const { username, email, password, role }: UserInfo = req.body
    try {
      const salt: string = process.env.SALT || "8"
      const hashedPassword = await bcrypt.hash(password, parseInt(salt))
      await this.db.createUser({ username, email, role, password: hashedPassword })
      res.status(204).send()
    } catch (error) {
      console.log(error)
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

  public async loginUser(req: Request, res: Response) {
    const { email, password }: LoginUserRequest = req.body
    console.log(email, password)
    try {
      const user = await this.db.findUserByEmail(email)
      if (user === null) {
        res.status(404).send({ "message": "Wrong Email" })
        return
      }

      const isMatch = bcrypt.compare(password, user.password as string)
      if (!isMatch) {
        res.status(401).send({ "message": "Wrong Password" })
        return
      }

      const refreshKey = process.env.REFRESH_SECRET_KEY
      const refreshDuration = process.env.REFRESH_DURATION
      const accessKey = process.env.ACCESS_SECRET_KEY
      const accessDuration = process.env.ACCESS_DURATION
      const domain = process.env.DOMAIN
      if (!domain || !refreshKey || !refreshDuration || !user._id || !accessKey || !accessDuration) throw Error("")

      const refreshToken = createToken(user._id, user.role, parseInt(refreshDuration), refreshKey)
      const accessToken = createToken(user._id, user.role, parseInt(accessDuration), accessKey)

      res.cookie("refresh_token", refreshToken, {
        domain: domain,
        path: "/",
        httpOnly: true,
        //sameSite: 'none',
        secure: false, // change to true 
        maxAge: parseInt(refreshDuration)
      })
      const resp: UserResponse = {
        username: user.username as string,
        email: user.email as string,
        role: user.role
      }
      res.status(200).send({ "access_token": accessToken, user: resp })
    } catch (error) {
      res.status(400).send({ error })
    }
  }

  public async logoutUser(req: Request, res: Response) {
    try {
      const domain = process.env.DOMAIN
      res.cookie("nf_refresh_token", "", {
        domain: domain,
        path: "/",
        httpOnly: true,
        //sameSite: 'none',
        secure: false,
        maxAge: -1
      })
      res.status(204)

    } catch (error) {
      res.status(400).send({ error })
    }

  }

  public async renewAccess(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh_token
      const accessKey = process.env.ACCESS_SECRET_KEY
      const refreshKey = process.env.REFRESH_SECRET_KEY
      const accessDuration = process.env.ACCESS_DURATION
      console.log(refreshToken)

      console.log("======RENEW======")
      console.log(req.cookies.refresh_token)
      console.log("============")
      if (!refreshToken || !refreshKey || !accessKey || !accessDuration) throw Error("")
      const payload = verifyToken(refreshToken, refreshKey)
      if (!payload) throw Error()

      const user = await this.db.findUserById(payload.uid as string)
      if (!user) throw Error()
      const resp: UserResponse = {
        email: user.email as string,
        username: user.username as string,
        role: user.role
      }
      const accessToken = createToken(payload.uid, payload.role, parseInt(accessDuration), accessKey)
      res.status(200).send({ user: resp, access_token: accessToken })
    } catch (error) {
      const domain = process.env.DOMAIN
      res.cookie("refresh_token", "", {
        domain: domain,
        path: "/",
        httpOnly: true,
        //sameSite: 'none',
        secure: false, // set to true
        maxAge: -1
      })
      res.status(400).send({ error })
    }
  }
}

export {
  UserController
}
