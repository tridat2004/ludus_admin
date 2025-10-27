<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
        <p class="text-gray-600">Tạo và quản lý các mã khuyến mãi</p>
      </div>
      
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Tạo mã giảm giá
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.name" class="stat-card">
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
              placeholder="Mã hoặc tên..."
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
            <button @click="resetFilters" class="btn btn-secondary w-full">
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
              <th>Mô tả</th>
              <th>Loại</th>
              <th>Giảm giá</th>
              <th>Đơn tối thiểu</th>
              <th>Sử dụng</th>
              <th>Hết hạn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
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
                <p class="text-sm text-gray-900">{{ coupon.name }}</p>
                <p class="text-xs text-gray-500">{{ coupon.description }}</p>
              </td>
              <td>
                <span class="badge badge-info">{{ getDiscountType(coupon.type) }}</span>
              </td>
              <td class="font-semibold text-green-600">
                {{ coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value) }}
              </td>
              <td>{{ formatCurrency(coupon.minOrderValue) }}</td>
              <td>
                <div class="text-sm">
                  <p>{{ coupon.usedCount }} / {{ coupon.maxUses || '∞' }}</p>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      class="bg-primary-600 h-1.5 rounded-full" 
                      :style="`width: ${coupon.maxUses ? (coupon.usedCount / coupon.maxUses * 100) : 0}%`"
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <div class="text-sm">
                  <p>{{ formatDate(coupon.expiresAt) }}</p>
                  <p class="text-xs" :class="isExpired(coupon.expiresAt) ? 'text-red-600' : 'text-gray-500'">
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
                    @click="editCoupon(coupon)"
                    class="text-green-600 hover:text-green-900"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon class="h-4 w-4" />
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
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editMode ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá mới' }}
          </h3>
          <button @click="closeModal">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveCoupon" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label required">Mã code</label>
              <input
                v-model="formData.code"
                type="text"
                class="form-input font-mono uppercase"
                placeholder="SUMMER2024"
                required
              >
            </div>
            
            <div class="form-group">
              <label class="form-label required">Tên mã</label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="Khuyến mãi mùa hè"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="form-textarea"
              placeholder="Mô tả về chương trình khuyến mãi"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label required">Loại giảm giá</label>
              <select v-model="formData.type" class="form-select" required>
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định (₫)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label required">Giá trị giảm</label>
              <input
                v-model.number="formData.value"
                type="number"
                class="form-input"
                :placeholder="formData.type === 'percentage' ? '10' : '50000'"
                required
              >
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Giá trị đơn tối thiểu</label>
              <input
                v-model.number="formData.minOrderValue"
                type="number"
                class="form-input"
                placeholder="0"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">Số lần sử dụng tối đa</label>
              <input
                v-model.number="formData.maxUses"
                type="number"
                class="form-input"
                placeholder="Không giới hạn"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label required">Ngày hết hạn</label>
            <input
              v-model="formData.expiresAt"
              type="datetime-local"
              class="form-input"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <select v-model="formData.status" class="form-select">
              <option value="active">Hoạt động</option>
              <option value="disabled">Vô hiệu</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Đang lưu...' : (editMode ? 'Cập nhật' : 'Tạo mã') }}
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
  PencilIcon,
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

// State
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const showDeleteDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const couponToDelete = ref(null)

const formData = ref({
  code: '',
  name: '',
  description: '',
  type: 'percentage',
  value: 0,
  minOrderValue: 0,
  maxUses: null,
  expiresAt: '',
  status: 'active'
})

// Stats
const stats = [
  { name: 'Tổng mã', value: '4', icon: GiftIcon, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { name: 'Đang hoạt động', value: '3', icon: CheckCircleIcon, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { name: 'Sắp hết hạn', value: '1', icon: ClockIcon, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { name: 'Đã hết hạn', value: '0', icon: XCircleIcon, bgColor: 'bg-red-100', iconColor: 'text-red-600' }
]

// Mock data
const coupons = ref([
  {
    id: 1,
    code: 'SUMMER2024',
    name: 'Khuyến mãi mùa hè',
    description: 'Giảm 20% cho đơn từ 500k',
    type: 'percentage',
    value: 20,
    minOrderValue: 500000,
    maxUses: 100,
    usedCount: 45,
    expiresAt: new Date('2024-08-31'),
    status: 'active'
  },
  {
    id: 2,
    code: 'FREESHIP',
    name: 'Miễn phí vận chuyển',
    description: 'Free ship cho đơn từ 200k',
    type: 'fixed',
    value: 30000,
    minOrderValue: 200000,
    maxUses: 500,
    usedCount: 234,
    expiresAt: new Date('2024-12-31'),
    status: 'active'
  },
  {
    id: 3,
    code: 'NEWUSER',
    name: 'Khách hàng mới',
    description: 'Giảm 15% cho KH mới',
    type: 'percentage',
    value: 15,
    minOrderValue: 0,
    maxUses: null,
    usedCount: 89,
    expiresAt: new Date('2024-06-30'),
    status: 'disabled'
  }
])

// Computed
const filteredCoupons = computed(() => {
  let filtered = coupons.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.code.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query)
    )
  }

  if (filterType.value) {
    filtered = filtered.filter(c => c.type === filterType.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(c => c.status === filterStatus.value)
  }

  return filtered
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
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
  alert(`Đã sao chép mã: ${code}`)
}

const editCoupon = (coupon) => {
  editMode.value = true
  formData.value = {
    ...coupon,
    expiresAt: new Date(coupon.expiresAt).toISOString().slice(0, 16)
  }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editMode.value = false
  formData.value = {
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    minOrderValue: 0,
    maxUses: null,
    expiresAt: '',
    status: 'active'
  }
}

const saveCoupon = async () => {
  saving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const data = {
      ...formData.value,
      code: formData.value.code.toUpperCase(),
      expiresAt: new Date(formData.value.expiresAt),
      usedCount: editMode.value ? formData.value.usedCount : 0
    }
    
    if (editMode.value) {
      const index = coupons.value.findIndex(c => c.id === formData.value.id)
      if (index > -1) coupons.value[index] = data
      alert('Cập nhật thành công!')
    } else {
      coupons.value.push({ ...data, id: Date.now() })
      alert('Tạo mã thành công!')
    }
    
    closeModal()
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = coupons.value.findIndex(c => c.id === couponToDelete.value.id)
    if (index > -1) coupons.value.splice(index, 1)
    
    alert('Xóa thành công!')
    showDeleteDialog.value = false
    couponToDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
 