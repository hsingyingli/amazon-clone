import { JwtPayload } from "jsonwebtoken"
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

interface Payload extends JwtPayload {
  id: string
  uid: mongoose.Types.ObjectId | string
  role: "admin" | "user"
  issued_at: number
  expired_at: number
}


const createPayload = (uid: mongoose.Types.ObjectId | string, role: "admin" | "user", duration: number) => {

  const payload: Payload = {
    id: uuidv4(),
    uid: uid,
    role: role,
    issued_at: Date.now(),
    expired_at: Date.now() + duration
  }
  return payload
}

const verifyPayload = (payload: Payload): boolean => {
  return payload.expired_at > Date.now()
}

export {
  createPayload,
  verifyPayload
}

export type {
  Payload
}
