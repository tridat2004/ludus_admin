// plugins/auth.client.js
import { fetchMe } from "~/services/authService"

export default defineNuxtPlugin(async () => {
  const authState = useState('auth_user')
  
  // ✅ Nếu đã có user trong localStorage thì set lại luôn, không fetchMe
  const stored = localStorage.getItem('user')
  if (stored) {
    authState.value = JSON.parse(stored)
    console.log("🔁 Khôi phục user từ localStorage:", authState.value.email)
    return
  }

  // ✅ Nếu không có, thử gọi /me để check cookie/session (nếu có)
  try {
    const user = await fetchMe()
    if (user) {
      console.log("✅ User đã đăng nhập:", user.email)
      authState.value = user
    } else {
      console.log("ℹ️ Chưa có user đăng nhập")
    }
  } catch (error) {
    console.warn("⚠️ Không thể xác thực phiên đăng nhập:", error.message)
  }
})
