import { useContext } from "react"
import { AuthContext } from "@/store/providers/AuthProvider"


const useAuth = () => {
  return useContext(AuthContext)
}

export {
  useAuth
}
