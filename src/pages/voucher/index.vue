<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
        <p class="text-gray-600">Tạo và quản lý các mã khuyến mãi</p>
      </div>
      
      <button @click="showAddModal = true" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200">
        <PlusIcon class="h-5 w-5 mr-2" />
        Tạo mã giảm giá
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600"></div>
      <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="stat in computedStats" :key="stat.name" class="stat-card">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg flex items-center justify-center" :class="stat.bgColor">
              <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
            </div>
            <div class="ml-4">
              <p class="stat-label">{{ stat.name }}</p>
              <p class="stat-value">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Mã hoặc loại khuyến mãi..."
                class="form-input"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
              <select v-model="filterType" class="form-select">
                <option value="">Tất cả</option>
                <option value="percentage">Phần trăm</option>
                <option value="fixed">Số tiền cố định</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select v-model="filterStatus" class="form-select">
                <option value="">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="expired">Hết hạn</option>
                <option value="disabled">Đã tắt</option>
              </select>
            </div>

            <div class="flex items-end">
              <button @click="resetFilters" class="btn btn-secondary w-full" style="height: 38px">
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Coupons Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Mã code</th>
                <th>Loại khuyến mãi</th>
                <th>Loại giảm</th>
                <th>Giảm giá</th>
                <th>Đơn tối thiểu</th>
                <th>Sử dụng</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredCoupons || filteredCoupons.length === 0">
                <td colspan="9" class="text-center py-8 text-gray-500">
                  Không có mã giảm giá nào
                </td>
              </tr>
              <tr v-for="coupon in filteredCoupons" :key="coupon.id">
                <td>
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-orange-100 rounded flex items-center justify-center mr-3">
                      <GiftIcon class="h-4 w-4 text-orange-600" />
                    </div>
                    <span class="font-mono font-semibold text-primary-600">{{ coupon.code }}</span>
                  </div>
                </td>
                <td>
                  <p class="text-sm text-gray-900 font-medium">{{ coupon.promotionalType }}</p>
                  <p class="text-xs text-gray-500">{{ coupon.description || 'Không có mô tả' }}</p>
                </td>
                <td>
                  <span class="badge badge-info">{{ getDiscountType(coupon.type) }}</span>
                </td>
                <td class="font-semibold text-green-600">
                  {{ coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value) }}
                </td>
                <td>{{ formatCurrency(coupon.minOrderValue || 0) }}</td>
                <td>
                  <div class="text-sm">
                    <p>{{ coupon.usedCount || 0 }} / {{ coupon.maxUses || '∞' }}</p>
                    <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        class="bg-primary-600 h-1.5 rounded-full" 
                        :style="`width: ${coupon.maxUses ? ((coupon.usedCount || 0) / coupon.maxUses * 100) : 0}%`"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-sm">
                    <p class="text-gray-600">Bắt đầu: {{ formatDate(coupon.startDate) }}</p>
                    <p :class="isExpired(coupon.expiresAt) ? 'text-red-600' : 'text-gray-600'">
                      Kết thúc: {{ formatDate(coupon.expiresAt) }}
                    </p>
                    <p class="text-xs mt-1" :class="isExpired(coupon.expiresAt) ? 'text-red-600 font-semibold' : 'text-gray-500'">
                      {{ isExpired(coupon.expiresAt) ? 'Đã hết hạn' : getTimeRemaining(coupon.expiresAt) }}
                    </p>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getStatusClass(coupon.status)">
                    {{ getStatusText(coupon.status) }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="copyCouponCode(coupon.code)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Sao chép"
                    >
                      <DocumentDuplicateIcon class="h-4 w-4" />
                    </button>
                    <button 
                      @click="confirmDelete(coupon)"
                      class="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Hiển thị {{ ((pagination.page - 1) * pagination.limit) + 1 }} đến 
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
              trong tổng số {{ pagination.total }} mã
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page === 1"
                class="btn btn-secondary btn-sm"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 }"
              >
                Trước
              </button>
              <span class="text-sm text-gray-700">
                Trang {{ pagination.page }} / {{ pagination.totalPages }}
              </span>
              <button 
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page === pagination.totalPages"
                class="btn btn-secondary btn-sm"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.page === pagination.totalPages }"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg font-semibold text-gray-900">Tạo mã giảm giá mới</h3>
          <button @click="closeModal">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveCoupon" class="p-6 space-y-4">
          <div class="form-group">
            <label class="form-label required">Loại khuyến mãi</label>
            <select v-model="formData.promotionalType" class="form-select" required>
              <option value="">-- Chọn loại --</option>
              <option value="PRODUCT">Sản phẩm (PRODUCT)</option>
              <option value="SHIPPING">Vận chuyển (SHIPPING)</option>
              <option value="ORDER">Đơn hàng (ORDER)</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Mã code sẽ được tự động tạo bởi hệ thống</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label required">Loại giảm giá</label>
              <select v-model="formData.discountType" class="form-select" required>
                <option value="PERCENTAGE">Phần trăm (%)</option>
                <option value="FIXED_AMOUNT">Số tiền cố định (₫)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label required">Giá trị giảm</label>
              <input
                v-model.number="formData.discountValue"
                type="number"
                class="form-input"
                :placeholder="formData.discountType === 'PERCENTAGE' ? '10' : '50000'"
                required
                min="1"
              >
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label required">Ngày bắt đầu</label>
              <input
                v-model="formData.startDate"
                type="datetime-local"
                class="form-input"
                required
                :min="new Date().toISOString().slice(0, 16)"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label required">Ngày hết hạn</label>
              <input
                v-model="formData.endDate"
                type="datetime-local"
                class="form-input"
                required
                :min="formData.startDate || new Date().toISOString().slice(0, 16)"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label required">Số lần sử dụng tối đa</label>
            <input
              v-model.number="formData.maxUsage"
              type="number"
              class="form-input"
              placeholder="Nhập số lần"
              required
              min="1"
            >
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Đang lưu...' : 'Tạo mã' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Xóa mã giảm giá</h3>
          <p class="text-gray-600 mb-4">
            Bạn có chắc chắn muốn xóa mã <span class="font-mono font-bold">{{ couponToDelete?.code }}</span>?
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteDialog = false" class="btn btn-secondary">
              Hủy
            </button>
            <button @click="deleteCoupon" class="btn bg-red-600 text-white hover:bg-red-700" :disabled="deleting">
              {{ deleting ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
  GiftIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})
import { useNotification } from '../../composables/useNotfication'

const { notify } = useNotification()

const showSuccess = (msg) => notify(msg, 'success')
const showError = (msg) => notify(msg, 'error')

const { getAllVoucher, createVoucher, deleteVoucher } = useVoucher()

// State
const loading = ref(true)
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const showDeleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const couponToDelete = ref(null)

const formData = ref({
  promotionalType: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  startDate: '',
  endDate: '',
  maxUsage: null,
})

const coupons = ref([])
const allCoupons = ref([]) // Lưu toàn bộ voucher để tính stats
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0
})

// Computed Stats - Dựa trên toàn bộ dữ liệu, không phụ thuộc phân trang
const computedStats = computed(() => {
  if (!Array.isArray(allCoupons.value)) {
    return [
      { name: 'Tổng mã', value: 0, icon: GiftIcon, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
      { name: 'Đang hoạt động', value: 0, icon: CheckCircleIcon, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      { name: 'Sắp hết hạn', value: 0, icon: ClockIcon, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      { name: 'Đã hết hạn', value: 0, icon: XCircleIcon, bgColor: 'bg-red-100', iconColor: 'text-red-600' }
    ]
  }

  const total = allCoupons.value.length
  const active = allCoupons.value.filter(c => c.status === 'active' && !isExpired(c.expiresAt)).length
  const expiringSoon = allCoupons.value.filter(c => {
    const days = Math.floor((new Date(c.expiresAt) - new Date()) / (1000*60*60*24))
    return days > 0 && days <= 7 && c.status === 'active'
  }).length
  const expired = allCoupons.value.filter(c => isExpired(c.expiresAt)).length

  return [
    { name: 'Tổng mã', value: total, icon: GiftIcon, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Đang hoạt động', value: active, icon: CheckCircleIcon, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { name: 'Sắp hết hạn', value: expiringSoon, icon: ClockIcon, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { name: 'Đã hết hạn', value: expired, icon: XCircleIcon, bgColor: 'bg-red-100', iconColor: 'text-red-600' }
  ]
})


// Computed
const filteredCoupons = computed(() => {
  if (!Array.isArray(coupons.value)) {
    return []
  }

  let filtered = coupons.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.code.toLowerCase().includes(query) ||
      c.promotionalType.toLowerCase().includes(query)
    )
  }

  if (filterType.value) {
    filtered = filtered.filter(c => c.type === filterType.value)
  }

  if (filterStatus.value) {
    if (filterStatus.value === 'expired') {
      filtered = filtered.filter(c => isExpired(c.expiresAt))
    } else {
      filtered = filtered.filter(c => c.status === filterStatus.value)
    }
  }

  return filtered
})

// Methods
const mapDiscountType = (type) => {
  // Map BE enum to FE display
  const typeMap = {
    'PERCENTAGE': 'percentage',
    'FIXED_AMOUNT': 'fixed',
    'FIXED': 'fixed',
    'AMOUNT': 'fixed'
  }
  return typeMap[type?.toUpperCase()] || 'fixed'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

const getDiscountType = (type) => type === 'percentage' ? 'Phần trăm' : 'Cố định'

const isExpired = (date) => new Date(date) < new Date()

const getTimeRemaining = (date) => {
  const days = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
  if (days > 30) return `Còn ${Math.floor(days / 30)} tháng`
  if (days > 0) return `Còn ${days} ngày`
  return 'Hết hạn hôm nay'
}

const getStatusClass = (status) => {
  return status === 'active' ? 'badge-success' : 'badge-secondary'
}

const getStatusText = (status) => {
  return status === 'active' ? 'Hoạt động' : 'Vô hiệu'
}

const resetFilters = () => {
  searchQuery.value = ''
  filterType.value = ''
  filterStatus.value = ''
}

const copyCouponCode = (code) => {
  navigator.clipboard.writeText(code)
  showSuccess(`Đã sao chép mã: ${code}`)
}

const closeModal = () => {
  showAddModal.value = false
  formData.value = {
    promotionalType: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    startDate: '',
    endDate: '',
    maxUsage: null,
  }
}

const loadVouchers = async (page = 1) => {
  loading.value = true
  try {
    const limit = pagination.value.limit
    const offset = (page - 1) * limit

    const response = await getAllVoucher(offset, limit)
    const responseData = response?.data?.data || []
    const paginationData = response?.data?.pagination || {}

    // Map dữ liệu cho trang hiện tại
    coupons.value = responseData.map(v => ({
      id: v.id || v._id,
      code: v.code,
      promotionalType: v.promotionalType,
      type: mapDiscountType(v.discountType),
      value: v.discountValue || 0,
      maxUses: v.maxUsage || 0,
      usedCount: v.usageCount || 0,
      startDate: v.startDate,
      expiresAt: v.endDate,
      status: v.isActive ? 'active' : 'disabled',
      description: v.description || ''
    }))

    // Nếu là trang đầu tiên, load toàn bộ dữ liệu cho stats
    if (page === 1) {
      const totalResponse = await getAllVoucher(0, paginationData.total || 1000)
      const allData = totalResponse?.data?.data || []
      
      allCoupons.value = allData.map(v => ({
        id: v.id || v._id,
        code: v.code,
        promotionalType: v.promotionalType,
        type: mapDiscountType(v.discountType),
        value: v.discountValue || 0,
        maxUses: v.maxUsage || 0,
        usedCount: v.usageCount || 0,
        startDate: v.startDate,
        expiresAt: v.endDate,
        status: v.isActive ? 'active' : 'disabled',
        description: v.description || ''
      }))
    }

    pagination.value = {
      page,
      limit: paginationData.limit || limit,
      total: paginationData.total || responseData.length,
      totalPages: paginationData.totalPages || Math.ceil((paginationData.total || responseData.length) / limit)
    }
  } catch (err) {
    console.error(err)
    showError('Không thể tải danh sách mã giảm giá')
  } finally {
    loading.value = false
  }
}


const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadVouchers(page)
  }
}

const saveCoupon = async () => {
  saving.value = true
  
  try {
    // Validate promotionalType
    if (!formData.value.promotionalType) {
      showError('Vui lòng chọn loại khuyến mãi')
      saving.value = false
      return
    }

    const data = {
      promotionalType: formData.value.promotionalType, // Đã là uppercase từ select
      discountType: formData.value.discountType,
      discountValue: formData.value.discountValue,
      startDate: new Date(formData.value.startDate).toISOString(),
      endDate: new Date(formData.value.endDate).toISOString(),
      maxUsage: formData.value.maxUsage
    }
    
    console.log('Sending data:', data)
    
    await createVoucher(data)
    showSuccess('Tạo mã thành công!')
    closeModal()
    await loadVouchers(pagination.value.page)
  } catch (error) {
    console.error('Error saving voucher:', error)
    const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo mã giảm giá'
    showError(errorMsg)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (coupon) => {
  couponToDelete.value = coupon
  showDeleteDialog.value = true
}

const deleteCoupon = async () => {
  deleting.value = true
  
  try {
    const id = couponToDelete.value.id || couponToDelete.value._id
    console.log('Deleting voucher with id:', id)
    
    await deleteVoucher(id)
    
    // Xóa trực tiếp khỏi cả 2 danh sách
    coupons.value = coupons.value.filter(c => c.id !== id)
    allCoupons.value = allCoupons.value.filter(c => c.id !== id)
    
    // Cập nhật lại pagination
    pagination.value.total = Math.max(0, pagination.value.total - 1)
    pagination.value.totalPages = Math.ceil(pagination.value.total / pagination.value.limit)
    
    // Nếu trang hiện tại không còn item nào và không phải trang 1, quay về trang trước
    if (coupons.value.length === 0 && pagination.value.page > 1) {
      await loadVouchers(pagination.value.page - 1)
    }
    
    showSuccess('Xóa thành công!')
    showDeleteDialog.value = false
    couponToDelete.value = null
  } catch (error) {
    console.error('Error deleting voucher:', error)
    showError(error.response?.data?.message || 'Có lỗi xảy ra khi xóa mã giảm giá')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadVouchers()
})
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>