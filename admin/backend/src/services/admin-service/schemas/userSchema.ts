import { Schema, Types } from "mongoose"
import validator from "validator";

interface UserInterface {
  _id: Types.ObjectId
  username: String
  role: "admin" | "user"
  password: String
  email: String
}

const userSchema = new Schema<UserInterface>({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    validate(value: string) {
      if (value !== "admin" && value !== "user") {
        throw new Error("role must be one of admin and user")
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate(value: string) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Password can't contain password");
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trum: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        console.log("--", value)
        throw new Error("Email is invaldated")
      }
    }
  },
}, {
  timestamps: true
})


export {
  userSchema
}

export type {
  UserInterface
}
