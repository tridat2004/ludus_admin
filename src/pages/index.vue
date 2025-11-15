<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <button @click="refreshAll" :disabled="loading" class="btn btn-secondary px-5 py-2 text-base rounded-xl">
          <ArrowPathIcon class="h-6 w-6 mr-2" :class="{ 'animate-spin': loading }" />
          Làm mới
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !dataLoaded" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p class="stat-change positive" v-if="stat.change">
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
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
                <select v-model="selectedYear" @change="updateChartData" class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
            <div class="card-body">
              <canvas ref="revenueChart" class="w-full h-64"></canvas>
            </div>
            <div class="px-6 pb-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span class="text-gray-600">Tổng doanh thu: <strong class="text-gray-900">{{ formatCurrency(totalRevenue) }}</strong></span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-gray-600">Trung bình/tháng: <strong class="text-gray-900">{{ formatCurrency(avgRevenuePerMonth) }}</strong></span>
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
              <div v-if="topProducts.length === 0" class="p-4 text-center text-gray-500">
                Chưa có dữ liệu sản phẩm
              </div>
              <div v-else v-for="product in topProducts" :key="product.id" class="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <img :src="product.image || 'https://via.placeholder.com/40'" :alt="product.name" class="h-12 w-12 rounded-lg object-cover">
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ product.category }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{{ product.sold }}</p>
                  <p class="text-xs text-green-600 mt-1">Bán chạy</p>
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
              <div v-if="recentActivities.length === 0" class="p-4 text-center text-gray-500">
                Chưa có hoạt động
              </div>
              <div v-else v-for="activity in recentActivities" :key="activity.id" class="flex items-start p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :class="activity.iconBg">
                  <component :is="activity.icon" class="h-5 w-5" :class="activity.iconColor" />
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm text-gray-900 leading-relaxed">{{ activity.message }}</p>
                  <p class="text-xs text-gray-500 mt-1.5">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card mt-8">
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
          <div v-if="recentOrders.length === 0" class="p-8 text-center text-gray-500">
            Chưa có đơn hàng nào
          </div>
          <table v-else class="table">
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
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 transition">
                <td class="py-4">
                  <span class="font-medium text-primary-600">#{{ order.id.slice(-8).toUpperCase() }}</span>
                </td>
                <td class="py-4">
                  <div>
                    <p class="font-medium text-gray-900">{{ order.userId?.slice(0, 12) || 'Khách hàng' }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ order.userId || 'N/A' }}</p>
                  </div>
                </td>
                <td class="py-4">
                  <span class="badge" :class="getOrderStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="font-semibold text-gray-900 py-4">{{ formatCurrency(order.totalAmount) }}</td>
                <td class="text-gray-500 py-4">{{ formatDate(order.orderDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
import { useOrder } from '~/composables/useOrder'
import  useProduct  from '~/composables/useProduct'
import { useNotification } from '~/composables/useNotfication'

definePageMeta({
  layout: 'default'
})

// Composables
const { getAllOrder } = useOrder()
const { getProducts } = useProduct()
const { notify } = useNotification()

// State
const loading = ref(false)
const dataLoaded = ref(false)
const allOrders = ref([])
const allProducts = ref([])
const totalRevenue = ref(0)
const revenueChart = ref(null)
const chartInstance = ref(null)
const selectedYear = ref(new Date().getFullYear())
const monthlyRevenue = ref(Array(12).fill(0))

// Stats với dữ liệu thực
const stats = computed(() => [
  {
    name: 'Tổng doanh thu',
    value: formatCurrency(totalRevenue.value),
    change: null,
    icon: CurrencyDollarIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    name: 'Đơn hàng',
    value: allOrders.value.length.toString(),
    change: 'Tổng số đơn',
    icon: ShoppingCartIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    name: 'Sản phẩm',
    value: allProducts.value.length.toString(),
    change: 'Tổng sản phẩm',
    icon: ShoppingBagIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    name: 'Đơn hoàn thành',
    value: allOrders.value.filter(o => o.status === 'Delivered').length.toString(),
    change: 'Đã giao thành công',
    icon: CheckCircleIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }
])

// Available years từ orders
const availableYears = computed(() => {
  const years = new Set()
  allOrders.value.forEach(order => {
    if (order.orderDate) {
      years.add(new Date(order.orderDate).getFullYear())
    }
  })
  const yearArray = Array.from(years).sort((a, b) => b - a)
  return yearArray.length > 0 ? yearArray : [new Date().getFullYear()]
})

// Trung bình doanh thu mỗi tháng
const avgRevenuePerMonth = computed(() => {
  const nonZeroMonths = monthlyRevenue.value.filter(v => v > 0).length
  return nonZeroMonths > 0 ? totalRevenue.value / nonZeroMonths : 0
})

// Recent orders (5 đơn gần nhất)
const recentOrders = computed(() => {
  return [...allOrders.value]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5)
})

// Top products (5 sản phẩm đầu tiên)
const topProducts = computed(() => {
  return allProducts.value.slice(0, 5).map((product, index) => ({
    id: product.id,
    name: product.name || 'Sản phẩm',
    category: product.categoryId || 'Danh mục',
    image: product.imageUrl || 'https://via.placeholder.com/100',
    sold: Math.floor(Math.random() * 500) + 50, // Mock data
  }))
})

// Recent activities từ orders
const recentActivities = computed(() => {
  const activities = []
  
  const recentOrdersList = [...allOrders.value]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 3)
  
  recentOrdersList.forEach((order, index) => {
    const timeAgo = getTimeAgo(order.orderDate)
    activities.push({
      id: order.id,
      message: `Đơn hàng #${order.id.slice(-8).toUpperCase()} - ${getStatusText(order.status)}`,
      time: timeAgo,
      icon: ShoppingCartIcon,
      iconBg: getActivityBg(order.status),
      iconColor: getActivityColor(order.status)
    })
  })
  
  return activities
})

// Fetch all data
const fetchAllData = async () => {
  loading.value = true
  try {
    // Fetch orders
    const ordersResponse = await getAllOrder({ limit: 10000, offset: 0 })
    allOrders.value = ordersResponse.data?.data || ordersResponse.data || []
    
    // Tính tổng doanh thu
    totalRevenue.value = allOrders.value.reduce((sum, order) => {
      return sum + (order.totalAmount || 0)
    }, 0)
    
    // Tính doanh thu theo tháng
    calculateMonthlyRevenue()
    
    // Fetch products
    try {
      const productsResponse = await getProducts({ limit: 10000, offset: 0 })
      allProducts.value = productsResponse.data?.data || productsResponse.data || []
    } catch (err) {
      console.error('Error fetching products:', err)
      allProducts.value = []
    }
    
    dataLoaded.value = true
    console.log('✅ Dashboard data loaded:', {
      orders: allOrders.value.length,
      products: allProducts.value.length,
      revenue: totalRevenue.value
    })
    
    // Render chart sau khi có dữ liệu
    await nextTick()
    renderChart()
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error)
    notify('Lỗi tải dữ liệu dashboard', 'error')
  } finally {
    loading.value = false
  }
}

// Tính doanh thu theo tháng
const calculateMonthlyRevenue = () => {
  monthlyRevenue.value = Array(12).fill(0)
  
  allOrders.value.forEach(order => {
    if (order.orderDate) {
      const orderDate = new Date(order.orderDate)
      const orderYear = orderDate.getFullYear()
      const orderMonth = orderDate.getMonth() // 0-11
      
      if (orderYear === selectedYear.value) {
        monthlyRevenue.value[orderMonth] += order.totalAmount || 0
      }
    }
  })
}

// Render chart với Chart.js
const renderChart = () => {
  if (!revenueChart.value) return
  
  // Destroy old chart nếu có
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  const ctx = revenueChart.value.getContext('2d')
  
  // Import Chart.js từ CDN
  if (typeof Chart === 'undefined') {
    console.error('Chart.js chưa được load')
    return
  }
  
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
               'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: monthlyRevenue.value,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          callbacks: {
            label: function(context) {
              return 'Doanh thu: ' + formatCurrency(context.parsed.y)
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return (value / 1000).toFixed(0) + 'K'
            },
            font: { size: 11 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 11 }
          }
        }
      }
    }
  })
}

// Update chart khi đổi năm
const updateChartData = () => {
  calculateMonthlyRevenue()
  renderChart()
}

// Refresh all
const refreshAll = () => {
  fetchAllData()
}

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const getTimeAgo = (date) => {
  if (!date) return 'N/A'
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  return `${diffDays} ngày trước`
}

const getStatusText = (status) => {
  const statusMap = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Processing: 'Đang xử lý',
    Shipped: 'Đang giao',
    Delivered: 'Đã giao',
    Cancelled: 'Đã hủy'
  }
  return statusMap[status] || status
}

const getOrderStatusClass = (status) => {
  const statusClasses = {
    Pending: 'badge-warning',
    Confirmed: 'badge-info',
    Processing: 'badge-primary',
    Shipped: 'badge-info',
    Delivered: 'badge-success',
    Cancelled: 'badge-secondary'
  }
  return statusClasses[status] || 'badge-secondary'
}

const getActivityBg = (status) => {
  const bgMap = {
    Pending: 'bg-yellow-100',
    Confirmed: 'bg-blue-100',
    Processing: 'bg-indigo-100',
    Shipped: 'bg-blue-100',
    Delivered: 'bg-green-100',
    Cancelled: 'bg-gray-100'
  }
  return bgMap[status] || 'bg-gray-100'
}

const getActivityColor = (status) => {
  const colorMap = {
    Pending: 'text-yellow-600',
    Confirmed: 'text-blue-600',
    Processing: 'text-indigo-600',
    Shipped: 'text-blue-600',
    Delivered: 'text-green-600',
    Cancelled: 'text-gray-600'
  }
  return colorMap[status] || 'text-gray-600'
}

// Load data on mount
onMounted(() => {
  fetchAllData()
  
  // Load Chart.js từ CDN
  if (typeof Chart === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
    script.onload = () => {
      console.log('✅ Chart.js loaded')
    }
    document.head.appendChild(script)
  }
})

// Cleanup chart khi unmount
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})
</script>

<style scoped>
.stat-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.stat-label {
  @apply text-sm font-medium text-gray-600;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900 mt-1;
}

.stat-change {
  @apply text-xs font-medium mt-1;
}

.stat-change.positive {
  @apply text-green-600;
}

.hover-lift {
  @apply transition-transform duration-200;
}

.hover-lift:hover {
  @apply transform -translate-y-1 shadow-md;
}

.badge {
  @apply px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-info {
  @apply bg-blue-100 text-blue-800;
}

.badge-primary {
  @apply bg-indigo-100 text-indigo-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-secondary {
  @apply bg-gray-100 text-gray-800;
}

.badge-danger {
  @apply bg-red-100 text-red-800;
}
</style>