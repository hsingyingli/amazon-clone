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

export {
  axiosPrivate,
  base as axios
}
