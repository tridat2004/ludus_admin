<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p class="text-gray-600">Theo dõi và xử lý đơn hàng</p>
      </div>
      <button @click="refreshAll" class="btn btn-primary px-5 py-2 text-base rounded-xl" :disabled="loading">
        <span v-if="loading">Đang tải...</span>
        <span v-else>Làm mới</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Chờ xác nhận</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
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
              <p class="text-sm text-gray-600">Đã xác nhận</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.confirmed }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Đang xử lý</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.processing }}</p>
            </div>
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TruckIcon class="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Đã giao</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.delivered }}</p>
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
              <p class="text-2xl font-bold text-gray-900">{{ stats.cancelled }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircleIcon class="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search + Filter -->
    <div class="card">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input 
              v-model="searchQuery" 
              @input="debouncedSearch"
              type="text" 
              placeholder="Tìm mã đơn hoặc khách hàng..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
          <select v-model="filterStatus" @change="refreshAll" class="form-select md:w-64 px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Chờ xác nhận</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Processing">Đang xử lý</option>
            <option value="Shipped">Đang giao</option>
            <option value="Delivered">Đã giao</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600">Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="orders.length === 0" class="text-center py-12">
          <p class="text-gray-600">Không tìm thấy đơn hàng nào</p>
        </div>
        <div v-else>
          <!-- BỎ SCROLL NGANG -->
          <div class="overflow-hidden">
            <table class="w-full table-auto">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
  <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition group">
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      #{{ order.id.slice(-8).toUpperCase() }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {{ order.userId?.slice(0, 10) || 'N/A' }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
      {{ formatDate(order.orderDate) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {{ formatCurrency(order.totalAmount) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="badge" :class="getStatusClass(order.status)">
        {{ getStatusText(order.status) }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap relative">
      <div class="flex items-center space-x-3">
        <!-- Nút xem chi tiết -->
        <button @click="viewOrderDetails(order)" class="text-primary-600 hover:text-primary-900 transition" title="Xem chi tiết">
          <EyeIcon class="h-5 w-5" />
        </button>

        <!-- Dropdown trạng thái - ĐÃ FIX HIỆN ĐẦY ĐỦ -->
        <div v-if="canUpdateStatus(order.status)" class="relative inline-block">
          <!-- Nút tích (hover để hiện dropdown) -->
          <button @click.prevent class="text-green-600 hover:text-green-900 transition" title="Cập nhật trạng thái">
            <CheckCircleIcon class="h-5 w-5" />
          </button>

          <!-- Dropdown - DỪNG overflow, dùng fixed positioning -->
          <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible scale-95 transition-all duration-200 ease-out pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:pointer-events-auto z-50">
            <div class="py-2">
              <button
                v-for="nextStatus in getNextStatuses(order.status)"
                :key="nextStatus"
                @click="updateOrderStatus(order.id, nextStatus)"
                class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition flex items-center justify-between"
                :class="{ 'font-semibold text-green-600 bg-green-50': nextStatus === getNextStatus(order.status) }"
              >
                <div class="flex items-center space-x-2">
                  <CheckCircleIcon class="h-4 w-4" />
                  <span>{{ getStatusText(nextStatus) }}</span>
                </div>
                <span v-if="nextStatus === getNextStatus(order.status)" class="text-xs font-medium text-green-600">
                  Tiếp theo
                </span>
              </button>
              <div v-if="getNextStatuses(order.status).length === 0" class="px-4 py-2.5 text-sm text-gray-500 italic text-center">
                Không còn trạng thái tiếp theo
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
</tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="mt-6 flex flex-col sm:flex-row items-center justify-between border-t pt-4">
            <p class="text-sm text-gray-600 mb-4 sm:mb-0">
              Hiển thị {{ ((pagination.offset || 0) + 1) }} đến {{ Math.min((pagination.offset || 0) + orders.length, pagination.total || 0) }} trong {{ pagination.total || 0 }} đơn hàng
            </p>
            <div class="flex items-center space-x-1">
              <button @click="changePage(pagination.offset - pagination.limit)" :disabled="pagination.offset === 0"
                class="px-4 py-2 text-sm rounded-md transition"
                :class="pagination.offset === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'">
                Trước
              </button>
              <template v-for="pageNum in getPageNumbers()" :key="pageNum">
                <button v-if="pageNum !== '...'" @click="changePage((pageNum - 1) * pagination.limit)"
                  class="px-4 py-2 text-sm rounded-md transition min-w-10"
                  :class="getCurrentPage() === pageNum ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'">
                  {{ pageNum }}
                </button>
                <span v-else class="px-2 text-gray-500">...</span>
              </template>
              <button @click="changePage(pagination.offset + pagination.limit)"
                :disabled="pagination.offset + pagination.limit >= pagination.total"
                class="px-4 py-2 text-sm rounded-md transition"
                :class="pagination.offset + pagination.limit >= pagination.total ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showModal && selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Chi tiết đơn hàng #{{ selectedOrder.id.slice(-8).toUpperCase() }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition">
            <XCircleIcon class="h-6 w-6" />
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Thông tin cơ bản -->
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
              <p class="font-semibold text-gray-900">#{{ selectedOrder.id.slice(-8).toUpperCase() }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Ngày đặt</p>
              <p class="font-medium text-gray-900">{{ formatDate(selectedOrder.orderDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Khách hàng</p>
              <p class="font-medium text-gray-900">{{ selectedOrder.userId?.slice(0, 12) || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Trạng thái</p>
              <span class="badge" :class="getStatusClass(selectedOrder.status)">
                {{ getStatusText(selectedOrder.status) }}
              </span>
            </div>
          </div>

          <!-- Chi tiết sản phẩm -->
          <div v-if="selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              <span class="w-1 h-5 bg-primary-600 mr-2"></span>
              Sản phẩm trong đơn
            </h4>
            <div class="border rounded-lg overflow-hidden">
              <div 
                v-for="(detail, index) in selectedOrder.orderDetails" 
                :key="detail.id"
                class="flex justify-between items-center p-4 hover:bg-gray-50 transition"
                :class="{ 'border-b': index < selectedOrder.orderDetails.length - 1 }"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ detail.productVariantId }}</p>
                  <p class="text-sm text-gray-500 mt-1">
                    Số lượng: <span class="font-medium text-gray-700">{{ detail.quantity }}</span> × 
                    <span class="font-medium text-gray-700">{{ formatCurrency(detail.unitPrice) }}</span>
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{{ formatCurrency(detail.subtotal) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Thông tin thanh toán -->
          <div class="border-t pt-4">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium text-gray-900">{{ formatCurrency((selectedOrder.totalAmount || 0) - (selectedOrder.shippingCost || 0)) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Phí vận chuyển</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(selectedOrder.shippingCost) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span class="text-gray-900">Tổng cộng</span>
                <span class="text-primary-600">{{ formatCurrency(selectedOrder.totalAmount) }}</span>
              </div>
            </div>
          </div>

          <!-- Phương thức thanh toán -->
          <div v-if="selectedOrder.payments && selectedOrder.payments.length > 0">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              <span class="w-1 h-5 bg-green-600 mr-2"></span>
              Thanh toán
            </h4>
            <div 
              v-for="payment in selectedOrder.payments" 
              :key="payment.id"
              class="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-600">Phương thức</p>
                  <p class="font-medium text-gray-900">{{ payment.paymentMethodId || 'Chưa xác định' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">Số tiền</p>
                  <p class="font-semibold text-green-600">{{ formatCurrency(payment.amount) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ghi chú -->
          <div v-if="selectedOrder.notes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
              <span class="w-1 h-5 bg-yellow-600 mr-2"></span>
              Ghi chú
            </h4>
            <p class="text-sm text-gray-700">{{ selectedOrder.notes }}</p>
          </div>

          <!-- Action buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button 
              @click="showModal = false" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Đóng
            </button>
            <button 
              v-if="canUpdateStatus(selectedOrder.status)"
              @click="updateOrderStatus(selectedOrder.id, selectedOrder.status); showModal = false" 
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
            >
              Cập nhật trạng thái
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { 
  ClockIcon, TruckIcon, CheckCircleIcon, XCircleIcon, EyeIcon 
} from '@heroicons/vue/24/outline'
import { useNotification } from '../../composables/useNotfication'
import { useOrder } from '../../composables/useOrder'

definePageMeta({ layout: 'default' })

const { notify } = useNotification()
const { getAllOrder, updateOrder } = useOrder()

const showSuccess = (msg) => notify(msg, 'success')
const showError = (msg) => notify(msg, 'error')

// State
const searchQuery = ref('')
const filterStatus = ref('')
const orders = ref([])
const allOrders = ref([])        // THÊM: lưu toàn bộ dữ liệu
const loading = ref(false)
const selectedOrder = ref(null)
const showModal = ref(false)

const stats = ref({
  pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0
})

const pagination = ref({
  total: 0, totalPages: 0, limit: 6, offset: 0
})

// Debounce
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.offset = 0
    applyFiltersAndSearch()   // GỌI HÀM MỚI
  }, 400)
}

// Hàm mới: lọc + tìm kiếm ở client-side
const applyFiltersAndSearch = () => {
  let filtered = [...allOrders.value]

  // Filter trạng thái
  if (filterStatus.value) {
    filtered = filtered.filter(o => o.status === filterStatus.value)
  }

  // Search mã đơn HOẶC userId
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(q) || 
      (o.userId && o.userId.toLowerCase().includes(q))
    )
  }

  // Cập nhật stats
  const temp = { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  filtered.forEach(o => {
    const key = o.status.toLowerCase()
    if (temp.hasOwnProperty(key)) temp[key]++
  })
  stats.value = temp

  // Phân trang
  pagination.value.total = filtered.length
  pagination.value.totalPages = Math.ceil(filtered.length / pagination.value.limit)

  const start = pagination.value.offset
  const end = start + pagination.value.limit
  orders.value = filtered.slice(start, end)
}

// Lấy toàn bộ dữ liệu (không phân trang)
const fetchAllData = async () => {
  loading.value = true
  try {
    const response = await getAllOrder({ limit: 9999, offset: 0 })
    allOrders.value = response.data?.data || []
    applyFiltersAndSearch()   // Áp dụng filter + search ngay
    showSuccess("Tải dữ liệu thành công")
  } catch (err) {
    showError("Lỗi tải dữ liệu")
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Refresh
const refreshAll = () => {
  pagination.value.offset = 0
  fetchAllData()
}

// Cập nhật trạng thái
const updateOrderStatus = async (orderId, nextStatus) => {
  if (!confirm(`Xác nhận chuyển thành "${getStatusText(nextStatus)}"?`)) return
  loading.value = true
  try {
    await updateOrder(orderId, nextStatus)
    showSuccess(`Đã chuyển thành ${getStatusText(nextStatus)}`)
    await fetchAllData()   // Load lại toàn bộ
  } catch (err) {
    showError("Cập nhật thất bại")
  } finally {
    loading.value = false
  }
}

// Phân trang
const changePage = (newOffset) => {
  pagination.value.offset = newOffset
  applyFiltersAndSearch()
}

// Watch filter
watch(filterStatus, () => {
  pagination.value.offset = 0
  applyFiltersAndSearch()
})

// Helper functions (giữ nguyên)
const getCurrentPage = () => Math.floor(pagination.value.offset / pagination.value.limit) + 1

const getPageNumbers = () => {
  const current = getCurrentPage()
  const total = pagination.value.totalPages || 1
  const pages = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push('...'); pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1); pages.push('...')
      for (let i = total - 3; i <= total; i++) pages.push(i)
    } else {
      pages.push(1); pages.push('...')
      pages.push(current - 1); pages.push(current); pages.push(current + 1)
      pages.push('...'); pages.push(total)
    }
  }
  return pages
}

const canUpdateStatus = (s) => ['Pending','Confirmed','Processing','Shipped'].includes(s)
const getNextStatus = (s) => ({Pending:'Confirmed',Confirmed:'Processing',Processing:'Shipped',Shipped:'Delivered'}[s] || null)
const getNextStatuses = (s) => {
  const flow = ['Pending','Confirmed','Processing','Shipped','Delivered']
  const i = flow.indexOf(s)
  return i === -1 || i === flow.length-1 ? [] : flow.slice(i+1)
}

const formatCurrency = (a) => new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(a||0)
const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}) : 'N/A'

const getStatusClass = (s) => ({
  Pending:'badge-warning',Confirmed:'badge-info',Processing:'badge-primary',
  Shipped:'badge-info',Delivered:'badge-success',Cancelled:'badge-secondary'
}[s]||'badge-secondary')

const getStatusText = (s) => ({
  Pending:'Chờ xác nhận',Confirmed:'Đã xác nhận',Processing:'Đang xử lý',
  Shipped:'Đang giao',Delivered:'Đã giao',Cancelled:'Đã hủy'
}[s]||s)

const viewOrderDetails = (o) => { selectedOrder.value = o; showModal.value = true }

// Load lần đầu
onMounted(() => fetchAllData())
</script>

<style scoped>
.badge { @apply px-2.5 py-0.5 rounded-full text-xs font-medium; }
.badge-warning { @apply bg-yellow-100 text-yellow-800; }
.badge-info { @apply bg-blue-100 text-blue-800; }
.badge-primary { @apply bg-indigo-100 text-indigo-800; }
.badge-success { @apply bg-green-100 text-green-800; }
.badge-secondary { @apply bg-gray-100 text-gray-800; }
</style>