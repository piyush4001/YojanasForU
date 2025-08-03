import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // adjust to your backend URL
  withCredentials: true, // always send cookies
})

export default axiosInstance
