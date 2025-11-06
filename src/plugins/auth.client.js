// plugins/auth.client.js
import { fetchMe } from "~/services/authService"

export default defineNuxtPlugin(async () => {
  const authState = useState('auth_user')

  try {
    const user = await fetchMe() // check server session/cookie
    if (user) {
      authState.value = user
      console.log("✅ User đã đăng nhập:", user.email)
    } else {
      console.log("❌ Chưa đăng nhập hoặc session hết hạn")
      authState.value = null
      localStorage.removeItem('user')
    }
  } catch (error) {
    console.warn("⚠️ Không thể xác thực phiên đăng nhập:", error.message)
    authState.value = null
    localStorage.removeItem('user')
  }
})

