import { useRefreshToken } from "@/hooks/useRefreshToken";
import React, { createContext, useEffect, useState } from "react";


type User = {
  username: string
  email: string
  role: "admin" | "user"
  accessToken: string
}

interface AuthContextInterface {
  user: User | null
  updateUser: (user: User | null) => void
}


const initState: AuthContextInterface = {
  user: null,
  updateUser: (user: User | null) => { console.log("default") }
}

const AuthContext = createContext<AuthContextInterface>(initState)


interface Props {
  children: React.ReactNode
}


const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const refreshToken = useRefreshToken()

  const updateUser = (user: User | null) => {
    setUser(user)
  }

  useEffect(() => {
    const initUser = async () => {
      await refreshToken()
      setIsLoading(false)
    }
    initUser()

  }, [])

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthContext,
  AuthProvider
}

export type {
  User
}
