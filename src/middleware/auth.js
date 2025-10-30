// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  // CHỈ chạy trên client (quan trọng!)
  if (process.server) return

  // Các route không cần login
  if (['/login', '/register'].includes(to.path)) return

  // Kiểm tra localStorage
  const user = localStorage.getItem('admin_user')

  if (!user) {
    console.log('❌ Chưa đăng nhập, chuyển về /login')
    return navigateTo('/login')
  }

  console.log('✅ Đã đăng nhập, cho phép truy cập')
})