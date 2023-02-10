import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""

const base = axios.create({

  baseURL: BASE_URL
})

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  }
})

export { axiosPrivate, base as axios }
