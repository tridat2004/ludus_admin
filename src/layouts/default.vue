<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Notification Component -->
    <NotificationComponent />
    
    <!-- Top Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div class="flex h-16 items-center justify-between px-6">
        <!-- Logo & Brand -->
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="lg:hidden text-gray-600 hover:text-gray-900">
            <Bars3Icon class="h-6 w-6" />
          </button>
          
          <div class="flex items-center space-x-3">
            <img src="/logo_ludus.jpg" alt="Ludus Logo" class="h-8 w-auto" />
          </div>
        </div>

        <!-- Search Bar -->
        <div class="hidden md:flex items-center max-w-md w-full mx-8">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
          </div>
        </div>

        <!-- Right Menu -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="relative text-gray-600 hover:text-gray-900">
            <BellIcon class="h-6 w-6" />
            <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs">3</span>
            </span>
          </button>

          <!-- Quick Actions -->
          <button class="text-gray-600 hover:text-gray-900">
            <PlusIcon class="h-6 w-6" />
          </button>

          <!-- Profile -->
          <div class="relative">
            <button @click="showProfileMenu = !showProfileMenu" class="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-primary-700 text-sm font-medium">{{ user.name ? user.name.charAt(0).toUpperCase() : 'A' }}</span>
              </div>
              <span class="text-sm font-medium">{{ user.name || 'Admin' }}</span>
              <ChevronDownIcon class="h-4 w-4" />
            </button>

            <!-- Profile Dropdown -->
            <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
              <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ</NuxtLink>
              <NuxtLink to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cài đặt</NuxtLink>
              <NuxtLink @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Đăng xuất
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar Navigation -->
    <aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 mt-16" 
           :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      
      <!-- Navigation Menu -->
      <nav class="h-full overflow-y-auto py-6 px-4">
        <!-- Main Navigation -->
        <div class="space-y-1 mb-8">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu chính</h3>
          <div class="mt-3 space-y-1">
            <NuxtLink 
              v-for="item in mainNavigation" 
              :key="item.name"
              :to="item.href"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
              :class="isActive(item.href)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
            >
              <component 
                :is="item.icon" 
                class="mr-3 h-5 w-5 transition-colors"
                :class="isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'"
              />
              {{ item.name }}
              <!-- 🔥 FIX: Hiển thị badge động từ orderCount -->
              <span 
                v-if="item.href === '/orders' && orderCount !== null && orderCount > 0" 
                class="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {{ orderCount }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Management Section -->
        <div class="space-y-1 mb-8">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quản lý</h3>
          <div class="mt-3 space-y-1">
            <NuxtLink 
              v-for="item in managementNavigation" 
              :key="item.name"
              :to="item.href"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
              :class="isActive(item.href)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
            >
              <component 
                :is="item.icon" 
                class="mr-3 h-5 w-5 transition-colors"
                :class="isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'"
              />
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Tools Section -->
        <div class="space-y-1">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Công cụ</h3>
          <div class="mt-3 space-y-1">
            <NuxtLink 
              v-for="item in toolsNavigation" 
              :key="item.name"
              :to="item.href"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
              :class="isActive(item.href)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
            >
              <component 
                :is="item.icon" 
                class="mr-3 h-5 w-5 transition-colors"
                :class="isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'"
              />
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="lg:ml-64 pt-16">
      <div class="px-6 py-6 max-w-[1400px] mx-auto">
        <slot />
      </div>
    </main>

    <!-- Mobile Sidebar Backdrop -->
    <div v-if="sidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"></div>
  </div>
</template>

<script setup>
import {
  HomeIcon, ShoppingBagIcon, ShoppingCartIcon, UsersIcon, ChartBarIcon,
  CogIcon, DocumentTextIcon, MagnifyingGlassIcon, BellIcon, PlusIcon,
  ChevronDownIcon, Bars3Icon, TagIcon, GiftIcon, PhotoIcon, StarIcon,
  CreditCardIcon, MapPinIcon, HeartIcon, ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'
import { provide } from 'vue'
import { useNotification } from '~/composables/useNotfication'
import { useOrder } from '~/composables/useOrder'
import NotificationComponent from '~/components/ui/NotificationComponent.vue'

const route = useRoute()
const sidebarOpen = ref(false)
const showProfileMenu = ref(false)
const searchQuery = ref('')
const orderCount = ref(null) // 🔥 THÊM: State để lưu số đơn hàng

const user = ref({ name: '', email: '' })

// 🔥 THÊM: Fetch order count
const { getAllOrder } = useOrder()

const fetchOrderCount = async () => {
  try {
    console.log('🔍 Fetching order count...')
    const response = await getAllOrder({ limit: 10000, offset: 0 })
    
    const orders = response.data?.data || response.data || []
    orderCount.value = orders.length
    
    console.log('✅ Order count:', orderCount.value)
  } catch (error) {
    console.error('❌ Error fetching order count:', error)
    orderCount.value = 0
  }
}

// 🔥 THÊM: Gọi fetch khi component mount
onMounted(() => {
  fetchOrderCount()
  
  // Auto refresh mỗi 30 giây (optional)
  const interval = setInterval(() => {
    fetchOrderCount()
  }, 30000)
  
  onUnmounted(() => clearInterval(interval))
})

if (process.client) {
  const saved = localStorage.getItem('admin_user')
  if (saved) {
    try {
      Object.assign(user.value, JSON.parse(saved))
    } catch (e) {
      console.error('Lỗi parse admin_user:', e)
    }
  }
}

const logout = () => {
  if (process.client) localStorage.removeItem('admin_user')
  useState('auth_user').value = null
  window.location.href = '/login'
}

// 🔥 SỬA: Bỏ badge hardcode '12'
const mainNavigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, badge: null },
  { name: 'Đơn hàng', href: '/orders', icon: ShoppingCartIcon, badge: null }, // Bỏ badge: '12'
  { name: 'Khách hàng', href: '/customers', icon: UsersIcon, badge: null },
]

const managementNavigation = [
  { name: 'Sản phẩm', href: '/product', icon: ShoppingBagIcon },
  { name: 'Danh mục', href: '/category', icon: TagIcon },
  { name: 'Biến thể sản phẩm', href: '/product-variant', icon: DocumentTextIcon },
  { name: 'Đánh giá', href: '/reviews', icon: StarIcon },
]

const toolsNavigation = [
  { name: 'Mã giảm giá', href: '/voucher', icon: GiftIcon },
  { name: 'Thanh toán', href: '/payments', icon: CreditCardIcon },
  { name: 'Phương thức TT', href: '/payment-methods', icon: CreditCardIcon },
  { name: 'Địa chỉ KH', href: '/addresses', icon: MapPinIcon },
  { name: 'Giỏ hàng', href: '/carts', icon: ShoppingCartIcon },
  { name: 'Tin nhắn', href: '/messages', icon: ChatBubbleLeftIcon },
  { name: 'Báo cáo', href: '/reports', icon: ChartBarIcon },
  { name: 'Cài đặt', href: '/settings', icon: CogIcon },
]

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const isActive = (href) => {
  if (href === '/') return route.path === '/'
  return route.path === href || route.path.startsWith(href + '/')
}

watch(() => route.path, () => {
  sidebarOpen.value = false
  
  // 🔥 THÊM: Refresh order count khi chuyển trang
  if (route.path === '/orders') {
    fetchOrderCount()
  }
})

onMounted(() => {
  const handleClickOutside = (e) => {
    if (showProfileMenu.value && !e.target.closest('.relative')) {
      showProfileMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => document.removeEventListener('click', handleClickOutside))
})

const notification = useNotification()
provide('notification', notification)
</script>

<style scoped>
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>