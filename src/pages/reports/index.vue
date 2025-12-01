<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Báo cáo</h1>
        <p class="text-gray-600">Thống kê và phân tích dữ liệu</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Chọn tháng -->
        <select v-model="selectedMonth" @change="handleMonthChange" class="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm font-medium">
          <option :value="null">Tất cả</option>
          <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
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
              <p class="text-xs mt-1 text-green-600">
                Từ {{ revenueData?.pagination?.total || 0 }} thanh toán
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
              <p class="text-xs mt-1 text-gray-500">
                Delivered + Cancelled
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
                {{ safeFixed(completionRate) }}% tỷ lệ hoàn thành
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
                    <div class="bg-gradient-to-r from-primary-500 to-orange-500 h-1.5 rounded-full animate-progress" :style="{ width: product.percentage + '%' }"></div>
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
                  <span class="w-3 h-3 rounded-full mr-2 animate-pulse" :style="{ backgroundColor: status.color }"></span>
                  <span class="text-sm text-gray-700">{{ status.label }}</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ status.percentage }}%</span>
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
const { notify } = useNotification()
const { loading, allOrders, allProducts, revenueData, fetchData } = useReport()

// State
const selectedMonth = ref(null)
const chartGroupBy = ref('day')

// Chart refs và instances
const revenueChartCanvas = ref(null)
const pieChartCanvas = ref(null)
let revenueChartInstance = null
let pieChartInstance = null

// Computed - Total revenue từ BE
const totalRevenue = computed(() => {
  return revenueData.value?.totalRevenue || 0
})

// Computed - Total orders
const totalOrders = computed(() => allOrders.value.length)

// Computed - Completed orders
const completedOrders = computed(() => {
  return allOrders.value.filter(o => o.status === 'Delivered').length
})

// Computed - Completion rate
const completionRate = computed(() => {
  return totalOrders.value > 0 ? (completedOrders.value / totalOrders.value) * 100 : 0
})

// Computed - Average order value
const avgOrderValue = computed(() => {
  return completedOrders.value > 0 ? totalRevenue.value / completedOrders.value : 0
})

// Computed - Top products
const topProducts = computed(() => {
  const productCount = {}
  
  allOrders.value.forEach(order => {
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

// Computed - Order status data (CHỈ 2 STATUS)
const orderStatusData = computed(() => {
  const deliveredCount = allOrders.value.filter(o => o.status === 'Delivered').length
  const cancelledCount = allOrders.value.filter(o => o.status === 'Cancelled').length
  const total = allOrders.value.length || 1
  
  return [
    { 
      label: 'Hoàn thành', 
      value: deliveredCount, 
      percentage: ((deliveredCount / total) * 100).toFixed(1), 
      color: '#10b981' 
    },
    { 
      label: 'Đã hủy', 
      value: cancelledCount, 
      percentage: ((cancelledCount / total) * 100).toFixed(1), 
      color: '#ef4444' 
    }
  ]
})

// Computed - Recent transactions
const recentTransactions = computed(() => {
  return [...allOrders.value]
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
  
  // Dùng data từ revenueData.value.data (payments)
  const payments = revenueData.value?.data || []
  
  payments.forEach(payment => {
    if (!payment.updatedAt) return
    
    const date = new Date(payment.updatedAt)
    let key
    
    if (chartGroupBy.value === 'day') {
      key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    } else if (chartGroupBy.value === 'week') {
      const weekNum = Math.ceil(date.getDate() / 7)
      key = `Tuần ${weekNum}`
    }
    
    grouped[key] = (grouped[key] || 0) + (payment.amount || 0)
  })
  
  const sortedEntries = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
  
  return {
    labels: sortedEntries.map(e => e[0]),
    data: sortedEntries.map(e => e[1])
  }
}

// Render Revenue Chart với animation
const renderRevenueChart = () => {
  if (!revenueChartCanvas.value || typeof Chart === 'undefined') return
  
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
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      },
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
            }
          }
        }
      }
    }
  })
}

// Render Pie Chart với animation
const renderPieChart = () => {
  if (!pieChartCanvas.value || typeof Chart === 'undefined') return
  
  if (pieChartInstance) {
    pieChartInstance.destroy()
  }
  
  const ctx = pieChartCanvas.value.getContext('2d')
  const hasData = orderStatusData.value.some(s => s.value > 0)
  
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
        duration: 1500,
        easing: 'easeInOutQuart',
        animateRotate: true,
        animateScale: true
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
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
}

// Render all charts
const renderCharts = () => {
  renderRevenueChart()
  renderPieChart()
}

// Handle month change
const handleMonthChange = async () => {
  await fetchData({ month: selectedMonth.value })
  await nextTick()
  setTimeout(() => renderCharts(), 100)
}

const updateRevenueChart = async () => {
  await nextTick()
  setTimeout(() => renderRevenueChart(), 50)
}

// Export báo cáo
const exportReport = () => {
  try {
    notify('Đang xuất báo cáo...', 'info')
    
    const wb = XLSX.utils.book_new()
    
    const summaryData = [
      ['BÁO CÁO THỐNG KÊ'],
      ['Tháng:', selectedMonth.value ? `Tháng ${selectedMonth.value}` : 'Tất cả'],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
      [],
      ['CHỈ SỐ TỔNG QUAN'],
      ['Chỉ số', 'Giá trị'],
      ['Tổng doanh thu', formatCurrency(totalRevenue.value)],
      ['Tổng đơn hàng', totalOrders.value],
      ['Đơn hoàn thành', completedOrders.value],
      ['Giá trị TB/đơn', formatCurrency(avgOrderValue.value)],
      [],
      ['PHÂN LOẠI ĐƠN HÀNG'],
      ['Trạng thái', 'Số lượng', 'Tỷ lệ'],
      ...orderStatusData.value.map(s => [s.label, s.value, `${s.percentage}%`])
    ]
    
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan')
    
    const fileName = `Bao_cao_${selectedMonth.value ? `thang_${selectedMonth.value}` : 'tat_ca'}_${new Date().toISOString().split('T')[0]}.xlsx`
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
    
    const transactionData = [
      ['CHI TIẾT GIAO DỊCH'],
      ['Tháng:', selectedMonth.value ? `Tháng ${selectedMonth.value}` : 'Tất cả'],
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
    XLSX.utils.book_append_sheet(wb, ws, 'Giao dịch')
    
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
  return status === 'Delivered' ? 'badge-success' : 'badge-secondary'
}

const getStatusText = (status) => {
  return status === 'Delivered' ? 'Hoàn thành' : 'Đã hủy'
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
    await fetchData({ month: selectedMonth.value })
    await nextTick()
    setTimeout(() => renderCharts(), 100)
    notify('Tải báo cáo thành công', 'success')
  } catch (error) {
    console.error('Error initializing reports page:', error)
    notify('Lỗi tải dữ liệu báo cáo', 'error')
  }
})
const safeFixed = (val, digits = 1) => {
  const num = Number(val)
  return isNaN(num) ? '0.0' : num.toFixed(digits)
}
onUnmounted(() => {
  if (revenueChartInstance) revenueChartInstance.destroy()
  if (pieChartInstance) pieChartInstance.destroy()
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
.badge-secondary { @apply bg-red-100 text-red-800; }

@keyframes progress {
  from { width: 0; }
  to { width: var(--target-width); }
}

.animate-progress {
  animation: progress 1.5s ease-out forwards;
}
</style>