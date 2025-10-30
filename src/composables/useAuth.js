// composables/useAuth.js
import { ref, readonly, computed } from 'vue'

export const useAuth = () => {
  const user = useState('auth_user', () => null)
  const loading = useState('auth_loading', () => false)

  // Khởi tạo user từ localStorage (chỉ client)
  if (process.client && !user.value) {
    const stored = localStorage.getItem('admin_user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch (e) {
        localStorage.removeItem('admin_user')
      }
    }
  }

  const loginUser = async (email, password) => {
    loading.value = true
    try {
      const { login } = await import('~/services/authService')
      const loggedInUser = await login(email, password)

      user.value = loggedInUser

      if (process.client) {
        localStorage.setItem('admin_user', JSON.stringify(loggedInUser))
      }

      return loggedInUser
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logoutUser = async () => {
    loading.value = true
    try {
      const { logout } = await import('~/services/authService')
      await logout()

      user.value = null
      if (process.client) localStorage.removeItem('admin_user')

      await navigateTo('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    if (user.value) return user.value

    try {
      const { fetchMe } = await import('~/services/authService')
      const fetchedUser = await fetchMe()
      user.value = fetchedUser
      if (process.client) {
        localStorage.setItem('admin_user', JSON.stringify(fetchedUser))
      }
      return fetchedUser
    } catch (e) {
      user.value = null
      return null
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    loginUser,
    logoutUser,
    checkAuth,
    isAuthenticated: computed(() => !!user.value),
    isAdmin: computed(() => user.value?.role === 'admin')
  }
}
