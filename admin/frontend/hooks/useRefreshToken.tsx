import { User } from "@/store/providers/AuthProvider";
import { axios } from "@/utils/axios"
import { useAuth } from "./useAuth";


type RefreshTokenAPIResponse = {
  user: { email: string, username: string, role: "admin" | "user" },
  access_token: string
}

type RefresonTokenReturn = {
  user: User | null,
  error: Error | null
}


const useRefreshToken = () => {
  const { updateUser } = useAuth()

  /** renew access token, return null if success otherwise error */
  const refreshToken = async (): Promise<RefresonTokenReturn> => {
    try {
      const res = await axios.post("/renew_access", {}, {
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

      updateUser(user)

      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  return refreshToken
}

export {
  useRefreshToken
}
