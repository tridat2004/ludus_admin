<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <button class="btn btn-secondary">
          <ArrowPathIcon class="h-4 w-4 mr-2" />
          Làm mới
        </button>
        <button class="btn btn-primary">
          <PlusIcon class="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.name" class="stat-card hover-lift">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.bgColor">
              <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="stat-label">{{ stat.name }}</p>
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-change positive">
              <ArrowUpIcon class="inline h-3 w-3 mr-1" />
              {{ stat.change }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
          </div>
          <div class="card-body">
            <div class="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg">
              <div class="text-center">
                <ChartBarIcon class="h-12 w-12 text-primary-400 mx-auto mb-2" />
                <p class="text-gray-600">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="space-y-6">
        <!-- Top Products -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
          </div>
          <div class="card-body p-0">
            <div v-for="product in topProducts" :key="product.id" class="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
              <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-lg object-cover">
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ product.sold }}</p>
                <p class="text-xs text-green-600">+{{ product.growth }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
          </div>
          <div class="card-body p-0">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" :class="activity.iconBg">
                <component :is="activity.icon" class="h-4 w-4" :class="activity.iconColor" />
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm text-gray-900">{{ activity.message }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          <NuxtLink to="/orders" class="btn btn-outline btn-sm">
            Xem tất cả
            <ArrowRightIcon class="h-4 w-4 ml-1" />
          </NuxtLink>
        </div>
      </div>
      
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Đơn hàng</th>
              <th>Khách hàng</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td>
                <span class="font-medium text-primary-600">#{{ order.id }}</span>
              </td>
              <td>
                <div>
                  <p class="font-medium text-gray-900">{{ order.customer.name }}</p>
                  <p class="text-sm text-gray-500">{{ order.customer.email }}</p>
                </div>
              </td>
              <td>
                <span class="badge" :class="getOrderStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="font-semibold text-gray-900">{{ formatCurrency(order.total) }}</td>
              <td class="text-gray-500">{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  plugins: 'auth.client',
  middleware: 'auth'
})

const stats = [
  {
    name: 'Tổng doanh thu',
    value: '₫45.2M',
    change: '20.1% tháng này',
    icon: CurrencyDollarIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    name: 'Đơn hàng',
    value: '1,259',
    change: '18.7% tháng này',
    icon: ShoppingCartIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    name: 'Sản phẩm',
    value: '892',
    change: '3.2% tháng này',
    icon: ShoppingBagIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    name: 'Khách hàng',
    value: '2,350',
    change: '12.5% tháng này',
    icon: UsersIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }
]

const recentOrders = [
  {
    id: '3001',
    customer: { name: 'Nguyễn Văn A', email: 'nguyenvana@email.com' },
    total: 2340000,
    status: 'Hoàn thành',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3002',
    customer: { name: 'Trần Thị B', email: 'tranthib@email.com' },
    total: 1560000,
    status: 'Đang xử lý',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3003',
    customer: { name: 'Lê Văn C', email: 'levanc@email.com' },
    total: 890000,
    status: 'Đã giao',
    createdAt: new Date('2024-01-14')
  }
]

const topProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
    sold: 234,
    growth: 23
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop',
    sold: 156,
    growth: 18
  },
  {
    id: 3,
    name: 'AirPods Pro',
    category: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop',
    sold: 445,
    growth: 31
  }
]

const recentActivities = [
  {
    id: 1,
    message: 'Đơn hàng #3005 đã được đặt bởi Hoàng Văn E',
    time: '2 phút trước',
    icon: ShoppingCartIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    message: 'Khách hàng mới Lý Thị F đã đăng ký',
    time: '5 phút trước',
    icon: UserPlusIcon,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 3,
    message: 'Đơn hàng #3001 đã được hoàn thành',
    time: '10 phút trước',
    icon: CheckCircleIcon,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  }
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const getOrderStatusClass = (status) => {
  const statusClasses = {
    'Hoàn thành': 'badge-success',
    'Đang xử lý': 'badge-info',
    'Đã giao': 'badge-success',
    'Chờ thanh toán': 'badge-warning',
    'Đã hủy': 'badge-danger'
  }
  return statusClasses[status] || 'badge-secondary'
}
</script>