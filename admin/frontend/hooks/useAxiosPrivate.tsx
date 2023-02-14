import { axiosPrivate, renewAccessAPI } from "@/utils/axios"
import { useEffect } from "react"
import { useAuth } from "./useAuth"

const useAxiosPrivate = () => {
  const { user, updateUser } = useAuth()

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
          const { user } = await renewAccessAPI()
          updateUser(user)
          prevRequest.headers[`Authorization`] = `Bearer ${user?.accessToken}`
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
