import { axios } from "@/utils/axios"
import refreshTokenAPI from "@/utils/refreshTokenAPI"
import { loginAPI } from "@/utils/userAPI"
import React, { useEffect, useState, createContext, useCallback } from "react"

type User = {
  id: number
  username: string
  email: string
  accessToken: string
}

interface AuthContextInterface {
  user: User | null
  updateUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<Error | null>
}

const initState: AuthContextInterface = {
  user: null,
  updateUser: (user) => { },
  login: async (email: string, password: string) => {
    console.log("default login")
    return null
  }
}

const AuthContext = createContext<AuthContextInterface>(initState)

interface Props {
  children: React.ReactNode
}


const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<bool>(true)

  const updateUser = (user: User | null) => {
    setUser(user)
  }

  const login = async (email: string, password: string) => {
    const { user, error } = await loginAPI(email, password)
    setUser(user)
    return error
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await refreshTokenAPI()
      setUser(user)
      setIsLoading(false)
    }
    fetchUser()
  }, [])


  return (
    <AuthContext.Provider value={{ user, updateUser, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export { AuthContext }
export type {
  User
}
