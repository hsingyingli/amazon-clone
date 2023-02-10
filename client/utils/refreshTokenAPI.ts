import { User } from "@/store/providers/AuthProvider"
import { axios } from "./axios"


const refreshTokenAPI: () => Promise<User | null> = async () => {
  try {
    const res = await axios.post('/v1/user/renew_access', {
      withCredentials: true
    })
    const user: User = res.data
    return user
  } catch (error) {
    return null
  }
}

export default refreshTokenAPI
