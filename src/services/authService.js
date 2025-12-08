// services/authService.js
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

let api = null

// Tạo axios instance với baseURL từ runtimeConfig
const getApiInstance = () => {
  if (!api) {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase || 'https://www.pepnguyen.id.vn'

    api = axios.create({
      baseURL,
      withCredentials: true,
    })
  }
  return api
}

// Login thông thường - user nhập email/password
export const login = async (email, password) => {
  const api = getApiInstance()
  try {
    const response = await api.post("/auth/login", { email, password })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const userResponse = await api.get("/me")
    const user = userResponse.data?.data || userResponse.data

    if (!user || typeof user !== "object") {
      throw new Error("Không thể lấy thông tin user")
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(user))
      window.dispatchEvent(new Event("auth-changed"))
    }

    return user
  } catch (error) {
    console.error("Login error:", error)
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Lỗi đăng nhập"
    )
  }
}

// Logout
export const logout = async () => {
  const api = getApiInstance()
  try {
    await api.post("/auth/logout")
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user")
      window.dispatchEvent(new Event("auth-changed"))
    }
  } catch (error) {
    console.error("Logout error:", error)
  }
}

// Kiểm tra session hiện tại
export const fetchMe = async () => {
  const api = getApiInstance()
   if (typeof window !== 'undefined') {
    const hasSession = document.cookie.includes('token=') || localStorage.getItem('user')
    if (!hasSession) {
      console.info('⚠️ Bỏ qua fetchMe vì chưa có session hoặc token')
      return null
    }
  }
  try {
    const response = await api.get("/me")
    const user = response.data?.data || response.data
    
    if (user && typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(user))
    }
    
    return user
  } catch (err) {
    console.error("fetchMe failed:", err.message)
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user")
    }
    
    return null
  }
}

// Lấy user từ localStorage
export const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  }
  return null
}