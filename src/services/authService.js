// services/authService.js
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

let api = null

// Tạo axios instance với baseURL từ runtimeConfig
const getApiInstance = () => {
  if (!api) {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase || 'http://localhost:3000'

    api = axios.create({
      baseURL,
      withCredentials: true, // Gửi cookie
    })
  }
  return api
}

const ADMIN_CREDENTIALS = {
  email: "ngtuyenk4@gmail.com",
  password: "Pep!3101",
}

export const autoLoginAdmin = async () => {
  const api = getApiInstance()
  try {
    console.log("Auto login admin...")

    // Login
    await api.post("/auth/login", ADMIN_CREDENTIALS)

    await new Promise(resolve => setTimeout(resolve, 100))

    // Lấy user
    const response = await api.get("/me")
    const user = response.data?.data || response.data

    if (!user || typeof user !== "object") {
      throw new Error("Không thể lấy thông tin admin")
    }

    console.log("Đăng nhập thành công:", user)

    if (typeof window !== 'undefined') {
      localStorage.setItem("admin_user", JSON.stringify(user))
      window.dispatchEvent(new Event("auth-changed"))
    }

    return user
  } catch (error) {
    console.error("API Error in AuthService:", error)
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Lỗi không xác định khi đăng nhập"
    )
  }
}

export const fetchMe = async () => {
  const api = getApiInstance()
  try {
    const response = await api.get("/me")
    return response.data?.data || response.data
  } catch (err) {
    console.error("fetchMe thất bại:", err.message)
    return null
  }
}