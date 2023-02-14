import { LoadingPage } from "@/components/Loading";
import { loginAPI, renewAccessAPI } from "@/utils/axios";
import { useRouter } from "next/router";
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
  loginUser: (email: string, password: string) => Promise<Error | null>
}


const initState: AuthContextInterface = {
  user: null,
  updateUser: (user: User | null) => { console.log("default") },
  loginUser: async (email: string, password: string): Promise<Error | null> => { return Error("DEFAULT") }
}

const AuthContext = createContext<AuthContextInterface>(initState)


interface Props {
  children: React.ReactNode
}


const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const path = router.asPath

  const updateUser = (user: User | null) => {
    setUser(user)
  }

  const loginUser = async (email: string, password: string) => {
    const { user, error } = await loginAPI(email, password)
    if (error === null) {
      setUser(user)
    }

    return error
  }

  useEffect(() => {
    const handleFinishRedirect = () => setIsLoading(false)
    router.events.on("routeChangeComplete", handleFinishRedirect)
    return () => router.events.off("routeChangeComplete", handleFinishRedirect)
  }, [])


  useEffect(() => {
    setIsLoading(true)
    const initUser = async () => {
      const { user } = await renewAccessAPI()
      setUser(user)
      const isNotRequiredAuth = path.includes("/login") || path.includes("/signup")

      if (user === null && isNotRequiredAuth) {
        setIsLoading(false)
      } else if (user === null && !isNotRequiredAuth) {
        router.push("/login")
      } else if (user !== null && isNotRequiredAuth) {
        router.push("/")
      } else {
        setIsLoading(false)
      }
    }
    if (user === null) {
      initUser()
    }


  }, [path, user])



  return (
    isLoading ?
      <LoadingPage />
      : (
        <AuthContext.Provider value={{ user, updateUser, loginUser }}>
          {children}
        </AuthContext.Provider >
      )
  )
}

export {
  AuthContext,
  AuthProvider
}

export type {
  User
}
