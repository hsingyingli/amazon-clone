import { LoadingPage } from "@/components/Loading";
import { useRefreshToken } from "@/hooks/useRefreshToken";
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
  const router = useRouter()
  const path = router.asPath

  const updateUser = (user: User | null) => {
    setUser(user)
  }

  useEffect(() => {
    const handleFinishRedirect = () => setIsLoading(false)
    router.events.on("routeChangeComplete", handleFinishRedirect)
    return () => router.events.off("routeChangeComplete", handleFinishRedirect)
  }, [])


  useEffect(() => {
    setIsLoading(true)
    const initUser = async () => {
      const { error } = await refreshToken()
      if (error === null) {
        setIsLoading(false)
      } else {
        router.push("/login")
      }
    }

    const isNotRequiredAuth = path.includes("/login") || path.includes("/signup")

    if (user === null && isNotRequiredAuth) {
      setIsLoading(false)
    } else if (user !== null && isNotRequiredAuth) {
      router.push("/")
    } else if (user === null && !isNotRequiredAuth) {
      initUser()
    }

  }, [path])



  return (
    isLoading ?
      <LoadingPage />
      : (
        <AuthContext.Provider value={{ user, updateUser }}>
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
