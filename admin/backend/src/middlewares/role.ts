import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../utils/tokenMaker/jwt-maker"
import { Payload } from "../utils/tokenMaker/payload"

interface AuthRequest extends Request {
  payload?: Payload
}


const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload
    if (payload?.role !== "admin") {
      throw new Error()
    }
    next()
  } catch (error) {
    res.status(401).send({ error: 'please authenticate.' })
  }
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.header('Authorization')?.replace("Bearer ", "")
    const accessKey = process.env.ACCESS_SECRET_KEY

    if (!refreshToken || !accessKey) throw new Error()

    const payload = verifyToken(refreshToken, accessKey)
    if (!payload) throw new Error()
    req.payload = payload
    next();
  } catch (error) {
    res.status(401).send({ error: 'please authenticate.' })
  }
}

export {
  authMiddleware,
  adminMiddleware
}

export type {
  AuthRequest
}
