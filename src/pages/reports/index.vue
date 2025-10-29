<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Báo cáo</h1>
        <p class="text-gray-600">Thống kê và phân tích dữ liệu</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>90 ngày qua</option>
          <option>12 tháng qua</option>
        </select>
        <button class="btn btn-primary">
          <ChartBarIcon class="h-4 w-4 mr-2" />
          Xuất báo cáo
        </button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card hover-lift">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <span class="text-2xl">💰</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Tổng doanh thu</p>
            <h3 class="text-xl font-bold text-gray-900">₫125.8M</h3>
            <p class="text-xs text-green-600">+15.3% so với kỳ trước</p>
          </div>
        </div>
      </div>

      <div class="card hover-lift">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span class="text-2xl">📦</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Tổng đơn hàng</p>
            <h3 class="text-xl font-bold text-gray-900">3,847</h3>
            <p class="text-xs text-green-600">+22.5% so với kỳ trước</p>
          </div>
        </div>
      </div>

      <div class="card hover-lift">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span class="text-2xl">👥</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Khách hàng mới</p>
            <h3 class="text-xl font-bold text-gray-900">1,245</h3>
            <p class="text-xs text-green-600">+8.7% so với kỳ trước</p>
          </div>
        </div>
      </div>

      <div class="card hover-lift">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <span class="text-2xl">📈</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Tỷ lệ chuyển đổi</p>
            <h3 class="text-xl font-bold text-gray-900">3.2%</h3>
            <p class="text-xs text-red-600">-0.5% so với kỳ trước</p>
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
          <select class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Theo ngày</option>
            <option>Theo tuần</option>
            <option>Theo tháng</option>
          </select>
        </div>
        <div class="card-body">
          <div class="h-80 flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg">
            <div class="text-center">
              <span class="text-6xl mb-4 block">📊</span>
              <p class="text-gray-600">Biểu đồ đường doanh thu theo thời gian</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Top sản phẩm</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center">
              <span class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">#{{ i }}</span>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">Sản phẩm {{ i }}</p>
                <div class="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div class="bg-gradient-to-r from-primary-500 to-orange-500 h-1.5 rounded-full" :style="{ width: (100 - i * 15) + '%' }"></div>
                </div>
              </div>
              <span class="ml-4 text-sm font-semibold text-gray-900">{{ 1000 - i * 100 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Categories -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Phân loại đơn hàng</h3>
        </div>
        <div class="card-body">
          <div class="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4">
            <div class="text-center">
              <span class="text-6xl">🥧</span>
              <p class="text-gray-600 mt-2">Biểu đồ tròn phân loại đơn hàng</p>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span class="text-sm text-gray-700">Hoàn thành</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">65%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span class="text-sm text-gray-700">Đang xử lý</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">25%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span class="text-sm text-gray-700">Hủy</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Traffic Sources -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-gray-900">Nguồn traffic</h3>
      </div>
      <div class="card-body">
        <div class="space-y-3">
          <div v-for="(source, i) in ['Direct', 'Google', 'Facebook', 'Instagram', 'Other']" :key="i" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <span class="text-xl mr-3">🌐</span>
              <span class="font-medium text-gray-900">{{ source }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="font-semibold text-gray-900">{{ 30 - i * 5 }}%</span>
              <span class="text-sm text-gray-600">{{ 5000 - i * 800 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Transactions Table -->
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Chi tiết giao dịch gần đây</h3>
        <button class="btn btn-outline btn-sm">
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
          Xuất Excel
        </button>
      </div>
      
      <div class="table-container">
        <table class="table">
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
            <tr v-for="i in 8" :key="i">
              <td>
                <span class="font-medium text-primary-600">#TRX{{ 10000 + i }}</span>
              </td>
              <td class="text-gray-600">{{ new Date().toLocaleDateString('vi-VN') }}</td>
              <td class="text-gray-900">Khách hàng {{ i }}</td>
              <td class="text-gray-900">Sản phẩm {{ i }}</td>
              <td class="text-center">{{ i }}</td>
              <td class="font-semibold text-gray-900">{{ formatCurrency(Math.random() * 10000000) }}</td>
              <td>
                <span class="badge" :class="getStatusClass(i % 3)">
                  {{ getStatusText(i % 3) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusClass = (index) => {
  const classes = ['badge-success', 'badge-warning', 'badge-danger']
  return classes[index]
}

const getStatusText = (index) => {
  const texts = ['Hoàn thành', 'Đang xử lý', 'Hủy']
  return texts[index]
}
</script>