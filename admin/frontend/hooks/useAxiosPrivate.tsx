import { axiosPrivate } from "@/utils/axios"
import { useEffect } from "react"
import { useAuth } from "./useAuth"
import { useRefreshToken } from "./useRefreshToken"

const useAxiosPrivate = () => {
  const { user } = useAuth()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const reqIntercept = axiosPrivate.interceptors.request.use((config) => {
      if (config.headers && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${user?.accessToken}`
      }
      return config
    }, (error) => Promise.reject(error))

    const resIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true
          const { user } = await refreshToken()
          const accessToken = user?.accessToken
          prevRequest.headers[`Authorization`] = `Bearer ${accessToken}`
          return axiosPrivate(prevRequest)
        }

        return Promise.reject(error)
      }
    )
    return () => {
      axiosPrivate.interceptors.request.eject(reqIntercept)
      axiosPrivate.interceptors.response.eject(resIntercept)
    }
  }, [user])

  return axiosPrivate
}


export {
  useAxiosPrivate
}
