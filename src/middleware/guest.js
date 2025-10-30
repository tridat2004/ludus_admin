// middleware/guest.js
export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const stored = localStorage.getItem('user')
    if (stored) {
      console.log('🔁 Đã đăng nhập, quay về trang admin')
      return navigateTo('/')
    }
  }
})
