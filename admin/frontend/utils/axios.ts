import { User } from "@/store/providers/AuthProvider";
import axios from "axios";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

const base = axios.create({
  baseURL: BASE_URL
})

type LoginResponse = {
  user: User | null,
  error: Error | null
}

const loginAPI = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const res = await base.post("/login", {
      email, password
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })


    console.log(res)

    const user: User = {
      username: res.data.user.username,
      email: res.data.user.email,
      role: res.data.user.role,
      accessToken: res.data.access_token
    }
    return { user, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

type RefreshTokenAPIResponse = {
  user: { email: string, username: string, role: "admin" | "user" },
  access_token: string
}

type RefresonTokenReturn = {
  user: User | null,
  error: Error | null
}

const renewAccessAPI = async (): Promise<RefresonTokenReturn> => {
  try {
    const res = await base.post("/renew_access", {}, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })

    const data: RefreshTokenAPIResponse = res.data
    const user = {
      username: data.user.username,
      email: data.user.email,
      role: data.user.role,
      accessToken: data.access_token
    }

    return { user, error: null }
  } catch (error) {
    console.log(error)
    return { user: null, error: error as Error }
  }
}


export {
  axiosPrivate,
  loginAPI,
  renewAccessAPI
}

export type {
  RefresonTokenReturn
}
