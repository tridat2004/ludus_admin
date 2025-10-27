<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p class="text-gray-600">Theo dõi và xử lý đơn hàng</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Chờ xác nhận</p>
              <p class="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Đang xử lý</p>
              <p class="text-2xl font-bold text-gray-900">18</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TruckIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Hoàn thành</p>
              <p class="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Đã hủy</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircleIcon class="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Danh sách đơn hàng</h2>
          <div class="flex items-center space-x-3">
            <select v-model="filterStatus" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ order.code }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ order.customer }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ order.date }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ formatCurrency(order.total) }}</td>
                <td class="px-6 py-4">
                  <span class="badge" :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button class="text-primary-600 hover:text-primary-900">
                    <EyeIcon class="h-5 w-5" />
                  </button>
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
import { 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon 
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })

const filterStatus = ref('')

const orders = ref([
  { id: 1, code: '3005', customer: 'Hoàng Văn E', date: '27/10/2025', total: 15000000, status: 'pending' },
  { id: 2, code: '3004', customer: 'Trần Thị D', date: '27/10/2025', total: 8500000, status: 'processing' },
  { id: 3, code: '3003', customer: 'Lê Văn C', date: '26/10/2025', total: 12000000, status: 'completed' },
  { id: 4, code: '3002', customer: 'Nguyễn Thị B', date: '26/10/2025', total: 6500000, status: 'completed' },
  { id: 5, code: '3001', customer: 'Phạm Văn A', date: '25/10/2025', total: 9200000, status: 'cancelled' }
])

const filteredOrders = computed(() => {
  if (!filterStatus.value) return orders.value
  return orders.value.filter(o => o.status === filterStatus.value)
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    processing: 'badge-primary',
    completed: 'badge-success',
    cancelled: 'badge-secondary'
  }
  return classes[status] || 'badge-secondary'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }
  return texts[status] || status
}
</script>