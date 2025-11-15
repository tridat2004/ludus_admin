<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Báo cáo</h1>
        <p class="text-gray-600">Thống kê và phân tích dữ liệu</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <select v-model="dateRange" @change="handleDateRangeChange" class="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm font-medium">
          <option value="7">7 ngày qua</option>
          <option value="30">30 ngày qua</option>
          <option value="90">90 ngày qua</option>
          <option value="365">12 tháng qua</option>
        </select>
        <button @click="exportReport" class="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center">
          <ChartBarIcon class="h-5 w-5 mr-2" />
          Xuất báo cáo
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Đang tải dữ liệu báo cáo...</p>
      </div>
    </div>

    <!-- Report Content -->
    <div v-else>
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="card hover-lift p-5">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">💰</span>
            </div>
            <div class="ml-5">
              <p class="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
              <h3 class="text-xl font-bold text-gray-900">{{ formatCurrency(totalRevenue) }}</h3>
              <p class="text-xs mt-1" :class="revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ revenueGrowth >= 0 ? '+' : '' }}{{ revenueGrowth.toFixed(1) }}% so với kỳ trước
              </p>
            </div>
          </div>
        </div>

        <div class="card hover-lift p-5">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">📦</span>
            </div>
            <div class="ml-5">
              <p class="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
              <h3 class="text-xl font-bold text-gray-900">{{ totalOrders }}</h3>
              <p class="text-xs mt-1" :class="ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ ordersGrowth >= 0 ? '+' : '' }}{{ ordersGrowth.toFixed(1) }}% so với kỳ trước
              </p>
            </div>
          </div>
        </div>

        <div class="card hover-lift p-5">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">👥</span>
            </div>
            <div class="ml-5">
              <p class="text-sm text-gray-600 mb-1">Đơn hoàn thành</p>
              <h3 class="text-xl font-bold text-gray-900">{{ completedOrders }}</h3>
              <p class="text-xs mt-1 text-green-600">
                {{ completionRate.toFixed(1) }}% tỷ lệ hoàn thành
              </p>
            </div>
          </div>
        </div>

        <div class="card hover-lift p-5">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">📈</span>
            </div>
            <div class="ml-5">
              <p class="text-sm text-gray-600 mb-1">Giá trị TB/đơn</p>
              <h3 class="text-xl font-bold text-gray-900">{{ formatCurrency(avgOrderValue) }}</h3>
              <p class="text-xs mt-1 text-gray-500">
                Trung bình mỗi đơn hàng
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="lg:col-span-2 card">
          <div class="card-header flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Doanh thu theo thời gian</h3>
            <select v-model="chartGroupBy" @change="updateRevenueChart" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="day">Theo ngày</option>
              <option value="week">Theo tuần</option>
              <option value="month">Theo tháng</option>
            </select>
          </div>
          <div class="card-body">
            <canvas ref="revenueChartCanvas" class="w-full" style="height: 320px;"></canvas>
          </div>
        </div>

        <!-- Top Products -->
        <div class="card mb-6">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Top sản phẩm</h3>
          </div>
          <div class="card-body">
            <div v-if="topProducts.length === 0" class="text-center text-gray-500 py-8">
              Chưa có dữ liệu sản phẩm
            </div>
            <div v-else class="space-y-4">
              <div v-for="(product, i) in topProducts" :key="i" class="flex items-center">
                <span class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">#{{ i + 1 }}</span>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <div class="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-gradient-to-r from-primary-500 to-orange-500 h-1.5 rounded-full" :style="{ width: product.percentage + '%' }"></div>
                  </div>
                </div>
                <span class="ml-4 text-sm font-semibold text-gray-900">{{ product.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Categories -->
        <div class="card mb-6">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Phân loại đơn hàng</h3>
          </div>
          <div class="card-body">
            <div class="w-full max-w-sm mx-auto mb-4">
  <canvas ref="pieChartCanvas" class="w-full"></canvas>
</div>

            <div class="space-y-2">
              <div v-for="status in orderStatusData" :key="status.label" class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: status.color }"></span>
                  <span class="text-sm text-gray-700">{{ status.label }}</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ status.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="card mb-6">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Nguồn traffic</h3>
        </div>
        <div class="card-body">
          <div class="space-y-3">
            <div v-for="(source, i) in trafficSources" :key="i" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <span class="text-xl mr-3">🌐</span>
                <span class="font-medium text-gray-900">{{ source.name }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="font-semibold text-gray-900">{{ source.percentage }}%</span>
                <span class="text-sm text-gray-600">{{ source.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Transactions Table -->
      <div class="card">
        <div class="card-header flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Chi tiết giao dịch gần đây</h3>
          <button @click="exportExcel" class="btn btn-outline btn-sm">
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
            Xuất Excel
          </button>
        </div>
        
        <div class="table-container">
          <div v-if="recentTransactions.length === 0" class="p-8 text-center text-gray-500">
            Chưa có giao dịch nào
          </div>
          <table v-else class="table">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Ngày</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá trị</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentTransactions" :key="order.id">
                <td>
                  <span class="font-medium text-primary-600">#{{ order.id.slice(-8).toUpperCase() }}</span>
                </td>
                <td class="text-gray-600">{{ formatDate(order.orderDate) }}</td>
                <td class="text-gray-900">{{ order.userId?.slice(0, 15) || 'N/A' }}</td>
                <td class="text-gray-900">{{ order.itemCount }} sản phẩm</td>
                <td class="text-center">{{ order.totalQuantity || 0 }}</td>
                <td class="font-semibold text-gray-900">{{ formatCurrency(order.totalAmount) }}</td>
                <td>
                  <span class="badge" :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

// Composables
const { getAllOrder } = useOrder()
const { getProducts } = useProduct()
const { notify } = useNotification()

// State
const loading = ref(false)
const dateRange = ref('30')
const chartGroupBy = ref('day')
const allOrders = ref([])
const allProducts = ref([])

// Chart refs và instances
const revenueChartCanvas = ref(null)
const pieChartCanvas = ref(null)
let revenueChartInstance = null
let pieChartInstance = null

// Traffic sources - Mock data
const trafficSources = ref([
  { name: 'Direct', percentage: 30, count: 5000 },
  { name: 'Google', percentage: 25, count: 4200 },
  { name: 'Facebook', percentage: 20, count: 3400 },
  { name: 'Instagram', percentage: 15, count: 2600 },
  { name: 'Other', percentage: 10, count: 1800 }
])

// Computed - Filtered orders
const filteredOrders = computed(() => {
  const days = parseInt(dateRange.value)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  return allOrders.value.filter(order => {
    if (!order.orderDate) return false
    return new Date(order.orderDate) >= cutoffDate
  })
})

// Computed - Total revenue
const totalRevenue = computed(() => {
  return filteredOrders.value.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
})

// Computed - Total orders
const totalOrders = computed(() => filteredOrders.value.length)

// Computed - Completed orders
const completedOrders = computed(() => {
  return filteredOrders.value.filter(o => o.status === 'Delivered').length
})

// Computed - Completion rate
const completionRate = computed(() => {
  return totalOrders.value > 0 ? (completedOrders.value / totalOrders.value) * 100 : 0
})

// Computed - Average order value
const avgOrderValue = computed(() => {
  return totalOrders.value > 0 ? totalRevenue.value / totalOrders.value : 0
})

// Computed - Revenue growth
const revenueGrowth = computed(() => {
  const days = parseInt(dateRange.value)
  const previousPeriod = allOrders.value.filter(order => {
    if (!order.orderDate) return false
    const date = new Date(order.orderDate)
    const cutoffStart = new Date()
    cutoffStart.setDate(cutoffStart.getDate() - days * 2)
    const cutoffEnd = new Date()
    cutoffEnd.setDate(cutoffEnd.getDate() - days)
    return date >= cutoffStart && date < cutoffEnd
  })
  
  const prevRevenue = previousPeriod.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  if (prevRevenue === 0) return 0
  return ((totalRevenue.value - prevRevenue) / prevRevenue) * 100
})

// Computed - Orders growth
const ordersGrowth = computed(() => {
  const days = parseInt(dateRange.value)
  const previousPeriod = allOrders.value.filter(order => {
    if (!order.orderDate) return false
    const date = new Date(order.orderDate)
    const cutoffStart = new Date()
    cutoffStart.setDate(cutoffStart.getDate() - days * 2)
    const cutoffEnd = new Date()
    cutoffEnd.setDate(cutoffEnd.getDate() - days)
    return date >= cutoffStart && date < cutoffEnd
  })
  
  if (previousPeriod.length === 0) return 0
  return ((totalOrders.value - previousPeriod.length) / previousPeriod.length) * 100
})

// Computed - Top products
const topProducts = computed(() => {
  const productCount = {}
  
  filteredOrders.value.forEach(order => {
    if (order.orderDetails && Array.isArray(order.orderDetails)) {
      order.orderDetails.forEach(detail => {
        const productId = detail.productVariantId || detail.productId || 'unknown'
        productCount[productId] = (productCount[productId] || 0) + (detail.quantity || 1)
      })
    }
  })
  
  const sorted = Object.entries(productCount)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  if (sorted.length === 0) return []
  
  const maxCount = sorted[0].count
  
  return sorted.map(item => {
    const product = allProducts.value.find(p => p.id === item.id || p._id === item.id)
    return {
      id: item.id,
      name: product?.name || `Sản phẩm ${item.id.slice(0, 8)}`,
      count: item.count,
      percentage: (item.count / maxCount) * 100
    }
  })
})

// Computed - Order status data
const orderStatusData = computed(() => {
  const statusCount = {
    Delivered: 0,
    Processing: 0,
    Pending: 0,
    Confirmed: 0,
    Shipped: 0,
    Cancelled: 0
  }
  
  filteredOrders.value.forEach(order => {
    if (statusCount.hasOwnProperty(order.status)) {
      statusCount[order.status]++
    }
  })
  
  const total = filteredOrders.value.length || 1
  
  return [
    { 
      label: 'Hoàn thành', 
      value: statusCount.Delivered, 
      percentage: ((statusCount.Delivered / total) * 100).toFixed(1), 
      color: '#10b981' 
    },
    { 
      label: 'Đang xử lý', 
      value: statusCount.Processing + statusCount.Confirmed + statusCount.Shipped, 
      percentage: (((statusCount.Processing + statusCount.Confirmed + statusCount.Shipped) / total) * 100).toFixed(1), 
      color: '#f59e0b' 
    },
    { 
      label: 'Chờ xác nhận', 
      value: statusCount.Pending, 
      percentage: ((statusCount.Pending / total) * 100).toFixed(1), 
      color: '#3b82f6' 
    },
    { 
      label: 'Đã hủy', 
      value: statusCount.Cancelled, 
      percentage: ((statusCount.Cancelled / total) * 100).toFixed(1), 
      color: '#ef4444' 
    }
  ]
})

// Computed - Recent transactions
const recentTransactions = computed(() => {
  return [...filteredOrders.value]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 10)
    .map(order => {
      const itemCount = order.orderDetails?.length || 0
      const totalQuantity = order.orderDetails?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0
      return {
        ...order,
        itemCount,
        totalQuantity
      }
    })
})

// Prepare revenue chart data
const prepareRevenueChartData = () => {
  const grouped = {}
  
  filteredOrders.value.forEach(order => {
    if (!order.orderDate) return
    
    const date = new Date(order.orderDate)
    let key
    
    if (chartGroupBy.value === 'day') {
      key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    } else if (chartGroupBy.value === 'week') {
      const weekNum = Math.ceil(date.getDate() / 7)
      key = `Tuần ${weekNum}`
    } else if (chartGroupBy.value === 'month') {
      key = date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
    }
    
    grouped[key] = (grouped[key] || 0) + (order.totalAmount || 0)
  })
  
  const sortedEntries = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
  
  return {
    labels: sortedEntries.map(e => e[0]),
    data: sortedEntries.map(e => e[1])
  }
}

// Render Revenue Chart
const renderRevenueChart = () => {
  if (!revenueChartCanvas.value || typeof Chart === 'undefined') {
    console.warn('Canvas or Chart.js not ready')
    return
  }
  
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
  }
  
  const ctx = revenueChartCanvas.value.getContext('2d')
  const chartData = prepareRevenueChartData()
  
  if (chartData.labels.length === 0) {
    chartData.labels = ['Không có dữ liệu']
    chartData.data = [0]
  }
  
  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: chartData.data,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          callbacks: {
            label: (context) => 'Doanh thu: ' + formatCurrency(context.parsed.y)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
              if (value >= 1000) return (value / 1000).toFixed(0) + 'K'
              return value
            },
            font: { size: 11 }
          },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 11 },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  })
  
  console.log('✅ Revenue chart rendered')
}

// Render Pie Chart
const renderPieChart = () => {
  if (!pieChartCanvas.value || typeof Chart === 'undefined') {
    console.warn('Canvas or Chart.js not ready')
    return
  }
  
  if (pieChartInstance) {
    pieChartInstance.destroy()
    pieChartInstance = null
  }
  
  const ctx = pieChartCanvas.value.getContext('2d')
  const hasData = orderStatusData.value.some(s => s.value > 0)
  
  // Lấy snapshot của data để tránh reactivity issues
  const chartLabels = hasData ? orderStatusData.value.map(s => s.label) : ['Không có dữ liệu']
  const chartData = hasData ? orderStatusData.value.map(s => s.value) : [1]
  const chartColors = hasData ? orderStatusData.value.map(s => s.color) : ['rgba(200, 200, 200, 0.3)']
  const chartPercentages = hasData ? orderStatusData.value.map(s => s.percentage) : ['100']
  
  pieChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: chartColors,
        borderWidth: 3,
        borderColor: '#fff',
        hoverBorderWidth: 4,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          callbacks: {
            label: (context) => {
              if (!hasData) return 'Không có dữ liệu'
              const label = chartLabels[context.dataIndex] || ''
              const value = chartData[context.dataIndex] || 0
              const percentage = chartPercentages[context.dataIndex]
              return `${label}: ${value} đơn (${percentage}%)`
            }
          }
        }
      },
      cutout: '65%'
    }
  })
  
  console.log('✅ Pie chart rendered')
}

// Render all charts
const renderCharts = () => {
  renderRevenueChart()
  renderPieChart()
}

// Fetch data
const fetchData = async () => {
  loading.value = true
  try {
    const ordersRes = await getAllOrder({ limit: 10000, offset: 0 })
    allOrders.value = ordersRes.data?.data || ordersRes.data || []
    
    try {
      const productsRes = await getProducts({ limit: 10000, offset: 0 })
      allProducts.value = productsRes.data?.data || productsRes.data || []
    } catch (err) {
      console.warn('Could not fetch products:', err)
      allProducts.value = []
    }
    
    notify('Tải báo cáo thành công', 'success')
  } catch (error) {
    console.error('Error fetching report data:', error)
    notify('Lỗi tải dữ liệu báo cáo', 'error')
  } finally {
    loading.value = false
    await nextTick()
    setTimeout(() => {
      if (typeof Chart !== 'undefined') {
        renderCharts()
      }
    }, 100)
  }
}

const handleDateRangeChange = async () => {
  await nextTick()
  setTimeout(() => renderCharts(), 50)
}

const updateRevenueChart = async () => {
  await nextTick()
  setTimeout(() => renderRevenueChart(), 50)
}

// Export báo cáo tổng quan
const exportReport = () => {
  try {
    notify('Đang xuất báo cáo...', 'info')
    
    // Tạo workbook mới
    const wb = XLSX.utils.book_new()
    
    // Lấy giá trị computed và convert sang number
    const revenueGrowthValue = Number(revenueGrowth.value) || 0
    const ordersGrowthValue = Number(ordersGrowth.value) || 0
    const completionRateValue = Number(completionRate.value) || 0
    
    // Sheet 1: Thống kê tổng quan
    const summaryData = [
      ['BÁO CÁO THỐNG KÊ'],
      ['Thời gian:', `${dateRange.value} ngày qua`],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
      [],
      ['CHỈ SỐ TỔNG QUAN'],
      ['Chỉ số', 'Giá trị', 'Tăng trưởng'],
      ['Tổng doanh thu', formatCurrency(totalRevenue.value), `${revenueGrowthValue.toFixed(1)}%`],
      ['Tổng đơn hàng', totalOrders.value, `${ordersGrowthValue.toFixed(1)}%`],
      ['Đơn hoàn thành', completedOrders.value, `${completionRateValue.toFixed(1)}%`],
      ['Giá trị TB/đơn', formatCurrency(avgOrderValue.value), ''],
      [],
      ['PHÂN LOẠI ĐƠN HÀNG'],
      ['Trạng thái', 'Số lượng', 'Tỷ lệ'],
      ...orderStatusData.value.map(s => [s.label, s.value, `${s.percentage}%`])
    ]
    
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
    
    // Styling cho sheet 1
    ws1['!cols'] = [
      { width: 25 },
      { width: 20 },
      { width: 15 }
    ]
    
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan')
    
    // Sheet 2: Top sản phẩm
    if (topProducts.value.length > 0) {
      const productData = [
        ['TOP SẢN PHẨM BÁN CHẠY'],
        ['STT', 'Tên sản phẩm', 'Số lượng bán', 'Tỷ lệ'],
        ...topProducts.value.map((p, i) => [
          i + 1,
          p.name,
          p.count,
          `${p.percentage.toFixed(1)}%`
        ])
      ]
      
      const ws2 = XLSX.utils.aoa_to_sheet(productData)
      ws2['!cols'] = [
        { width: 8 },
        { width: 40 },
        { width: 15 },
        { width: 12 }
      ]
      
      XLSX.utils.book_append_sheet(wb, ws2, 'Top sản phẩm')
    }
    
    // Sheet 3: Doanh thu theo thời gian
    const revenueData = prepareRevenueChartData()
    if (revenueData.labels.length > 0) {
      const timeData = [
        ['DOANH THU THEO THỜI GIAN'],
        ['Thời gian', 'Doanh thu (VNĐ)'],
        ...revenueData.labels.map((label, i) => [
          label,
          revenueData.data[i]
        ])
      ]
      
      const ws3 = XLSX.utils.aoa_to_sheet(timeData)
      ws3['!cols'] = [
        { width: 20 },
        { width: 20 }
      ]
      
      XLSX.utils.book_append_sheet(wb, ws3, 'Doanh thu')
    }
    
    // Xuất file
    const fileName = `Bao_cao_${dateRange.value}_ngay_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    notify('Xuất báo cáo thành công!', 'success')
  } catch (error) {
    console.error('Lỗi xuất báo cáo:', error)
    notify('Lỗi khi xuất báo cáo', 'error')
  }
}

// Export chi tiết giao dịch
const exportExcel = () => {
  try {
    notify('Đang xuất Excel...', 'info')
    
    const wb = XLSX.utils.book_new()
    
    // Chuẩn bị dữ liệu giao dịch
    const transactionData = [
      ['CHI TIẾT GIAO DỊCH'],
      ['Thời gian:', `${dateRange.value} ngày qua`],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
      ['Tổng số giao dịch:', recentTransactions.value.length],
      [],
      ['Mã GD', 'Ngày', 'Khách hàng', 'Số SP', 'Số lượng', 'Giá trị', 'Trạng thái'],
      ...recentTransactions.value.map(order => [
        `#${order.id.slice(-8).toUpperCase()}`,
        formatDate(order.orderDate),
        order.userId?.slice(0, 20) || 'N/A',
        order.itemCount,
        order.totalQuantity,
        order.totalAmount,
        getStatusText(order.status)
      ])
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(transactionData)
    
    // Styling
    ws['!cols'] = [
      { width: 12 },
      { width: 12 },
      { width: 25 },
      { width: 10 },
      { width: 12 },
      { width: 15 },
      { width: 15 }
    ]
    
    XLSX.utils.book_append_sheet(wb, ws, 'Giao dịch')
    
    // Xuất file
    const fileName = `Chi_tiet_giao_dich_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    notify('Xuất Excel thành công!', 'success')
  } catch (error) {
    console.error('Lỗi xuất Excel:', error)
    notify('Lỗi khi xuất Excel', 'error')
  }
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
  return new Date(date).toLocaleDateString('vi-VN')
}

const getStatusClass = (status) => {
  const map = {
    Delivered: 'badge-success',
    Processing: 'badge-primary',
    Confirmed: 'badge-info',
    Shipped: 'badge-info',
    Pending: 'badge-warning',
    Cancelled: 'badge-secondary'
  }
  return map[status] || 'badge-secondary'
}

const getStatusText = (status) => {
  const map = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Processing: 'Đang xử lý',
    Shipped: 'Đang giao',
    Delivered: 'Hoàn thành',
    Cancelled: 'Đã hủy'
  }
  return map[status] || status
}

// Load Chart.js và XLSX
const loadChartJs = () => {
  return new Promise((resolve, reject) => {
    if (typeof Chart !== 'undefined') {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
    script.onload = () => {
      console.log('✅ Chart.js loaded')
      resolve()
    }
    script.onerror = () => {
      console.error('❌ Failed to load Chart.js')
      reject(new Error('Failed to load Chart.js'))
    }
    document.head.appendChild(script)
  })
}

const loadXLSX = () => {
  return new Promise((resolve, reject) => {
    if (typeof XLSX !== 'undefined') {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js'
    script.onload = () => {
      console.log('✅ XLSX loaded')
      resolve()
    }
    script.onerror = () => {
      console.error('❌ Failed to load XLSX')
      reject(new Error('Failed to load XLSX'))
    }
    document.head.appendChild(script)
  })
}

// Lifecycle
onMounted(async () => {
  try {
    await loadChartJs()
    await loadXLSX()
    await fetchData()
  } catch (error) {
    console.error('Error initializing reports page:', error)
    notify('Lỗi khởi tạo trang báo cáo', 'error')
  }
})

onUnmounted(() => {
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
  }
  if (pieChartInstance) {
    pieChartInstance.destroy()
  }
})
</script>

<style scoped>
.hover-lift {
  @apply transition-transform duration-200;
}

.hover-lift:hover {
  @apply transform -translate-y-1 shadow-md;
}

.badge {
  @apply px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success { @apply bg-green-100 text-green-800; }
.badge-info { @apply bg-blue-100 text-blue-800; }
.badge-primary { @apply bg-indigo-100 text-indigo-800; }
</style>