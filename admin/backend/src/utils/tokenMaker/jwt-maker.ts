import jwt, { Secret } from "jsonwebtoken"
import mongoose from "mongoose";
import { createPayload, verifyPayload, Payload } from "./payload";


const createToken = (uid: mongoose.Types.ObjectId | string, role: "admin" | "user", duration: number, privateKey: Secret): string => {
  const payload = createPayload(uid, role, duration)
  return jwt.sign(payload, privateKey, { expiresIn: duration })
}

const verifyToken = (token: string, privateKey: Secret): Payload | null => {
  try {
    const payload: Payload = jwt.verify(token, privateKey) as Payload
    if (!verifyPayload(payload)) {
      throw Error()
    }

    return payload
  } catch (error) {
    return null
  }
}


export { createToken, verifyToken }
