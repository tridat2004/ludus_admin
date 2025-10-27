<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <p class="text-gray-600">Quản lý thông tin khách hàng và lịch sử mua hàng</p>
      </div>
      
      <div class="flex space-x-3">
        <button @click="exportCustomers" class="btn btn-secondary">
          <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
          Xuất Excel
        </button>
        <button @click="showAddCustomerModal = true" class="btn btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Thêm khách hàng
        </button>
      </div>
    </div>

    <!-- Customer stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in customerStats" :key="stat.name" class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-full flex items-center justify-center"
              :class="stat.bgColor">
              <component :is="stat.icon" class="h-5 w-5" :class="stat.iconColor" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">{{ stat.name }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tên, email, số điện thoại..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Loại khách hàng</label>
          <select 
            v-model="selectedType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tất cả</option>
            <option value="vip">VIP</option>
            <option value="regular">Thường</option>
            <option value="new">Mới</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select 
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="blocked">Bị khóa</option>
          </select>
        </div>

        <div class="flex items-end">
          <button @click="resetFilters" class="btn btn-secondary w-full">
            Đặt lại
          </button>
        </div>
      </div>
    </div>

    <!-- Customers table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="bg-gray-50">
            <tr>
              <th>
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Loại KH</th>
              <th>Tổng đơn hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Lần cuối mua</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50">
              <td>
                <input 
                  type="checkbox" 
                  :value="customer.id" 
                  v-model="selectedCustomers"
                >
              </td>
              <td>
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-700">
                      {{ customer.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <p class="font-medium text-gray-900">{{ customer.name }}</p>
                    <p class="text-sm text-gray-600">ID: #{{ customer.id }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="text-sm">
                  <p class="text-gray-900">{{ customer.email }}</p>
                  <p class="text-gray-600">{{ customer.phone }}</p>
                </div>
              </td>
              <td>
                <span 
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="getTypeClass(customer.type)"
                >
                  {{ getTypeText(customer.type) }}
                </span>
              </td>
              <td class="font-medium">{{ customer.totalOrders }}</td>
              <td class="font-medium">{{ formatCurrency(customer.totalSpent) }}</td>
              <td>
                <div class="text-sm">
                  <p>{{ formatDate(customer.lastOrderDate) }}</p>
                  <p class="text-gray-600">{{ getTimeDiff(customer.lastOrderDate) }}</p>
                </div>
              </td>
              <td>
                <span 
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(customer.status)"
                >
                  {{ getStatusText(customer.status) }}
                </span>
              </td>
              <td>
                <div class="flex items-center space-x-2">
                  <NuxtLink 
                    :to="`/customers/${customer.id}`"
                    class="text-primary-600 hover:text-primary-900"
                    title="Xem chi tiết"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </NuxtLink>
                  <button 
                    @click="editCustomer(customer)"
                    class="text-green-600 hover:text-green-900"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button 
                    @click="sendEmail(customer.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Gửi email"
                  >
                    <EnvelopeIcon class="h-4 w-4" />
                  </button>
                  <button 
                    @click="deleteCustomer(customer.id)"
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
      <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} đến 
            {{ Math.min(currentPage * itemsPerPage, totalCustomers) }} 
            trong tổng số {{ totalCustomers }} khách hàng
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="btn btn-secondary disabled:opacity-50"
          >
            Trước
          </button>
          
          <div class="flex space-x-1">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              class="px-3 py-2 text-sm rounded-md"
              :class="currentPage === page 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="btn btn-secondary disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Add Customer Modal -->
    <div v-if="showAddCustomerModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Thêm khách hàng mới</h3>
          <button @click="showAddCustomerModal = false">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <form @submit.prevent="addCustomer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input
              v-model="newCustomer.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="newCustomer.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              v-model="newCustomer.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <textarea
              v-model="newCustomer.address"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showAddCustomerModal = false" class="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary">
              Thêm khách hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  EnvelopeIcon,
  TrashIcon,
  XMarkIcon,
  UsersIcon,
  UserPlusIcon,
  StarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

// Reactive data
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const selectedCustomers = ref([])
const selectAll = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showAddCustomerModal = ref(false)

const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// Customer stats
const customerStats = [
  {
    name: 'Tổng khách hàng',
    value: '2,350',
    icon: UsersIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    name: 'Khách hàng mới',
    value: '89',
    icon: UserPlusIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    name: 'Khách VIP',
    value: '156',
    icon: StarIcon,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    name: 'Khách thân thiết',
    value: '445',
    icon: ShieldCheckIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
]

// Mock customers data
const customers = ref([
  {
    id: 'C001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    type: 'vip',
    status: 'active',
    totalOrders: 25,
    totalSpent: 15000000,
    lastOrderDate: new Date('2024-01-10'),
    createdAt: new Date('2023-03-15')
  },
  {
    id: 'C002',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0987654321',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    type: 'regular',
    status: 'active',
    totalOrders: 12,
    totalSpent: 8500000,
    lastOrderDate: new Date('2024-01-08'),
    createdAt: new Date('2023-06-20')
  },
  {
    id: 'C003',
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0555666777',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    type: 'new',
    status: 'active',
    totalOrders: 3,
    totalSpent: 2100000,
    lastOrderDate: new Date('2024-01-05'),
    createdAt: new Date('2023-12-01')
  },
  {
    id: 'C004',
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '0888999000',
    address: '321 Đường GHI, Quận 4, TP.HCM',
    type: 'regular',
    status: 'inactive',
    totalOrders: 18,
    totalSpent: 12300000,
    lastOrderDate: new Date('2023-11-20'),
    createdAt: new Date('2022-08-10')
  },
  {
    id: 'C005',
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    phone: '0111222333',
    address: '654 Đường JKL, Quận 5, TP.HCM',
    type: 'vip',
    status: 'blocked',
    totalOrders: 35,
    totalSpent: 28000000,
    lastOrderDate: new Date('2023-12-15'),
    createdAt: new Date('2022-01-05')
  }
])

// Computed properties
const filteredCustomers = computed(() => {
  let filtered = customers.value

  if (searchQuery.value) {
    filtered = filtered.filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.phone.includes(searchQuery.value) ||
      customer.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(customer => customer.type === selectedType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(customer => customer.status === selectedStatus.value)
  }

  // Sort by creation date (newest first)
  filtered.sort((a, b) => b.createdAt - a.createdAt)

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const totalCustomers = computed(() => {
  let filtered = customers.value

  if (searchQuery.value) {
    filtered = filtered.filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.phone.includes(searchQuery.value) ||
      customer.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(customer => customer.type === selectedType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(customer => customer.status === selectedStatus.value)
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalCustomers.value / itemsPerPage.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
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

const getTimeDiff = (date) => {
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 ngày trước'
  if (diffDays < 30) return `${diffDays} ngày trước`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
  return `${Math.floor(diffDays / 365)} năm trước`
}

const getTypeClass = (type) => {
  const typeClasses = {
    'vip': 'bg-yellow-100 text-yellow-800',
    'regular': 'bg-blue-100 text-blue-800',
    'new': 'bg-green-100 text-green-800'
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800'
}

const getTypeText = (type) => {
  const typeTexts = {
    'vip': 'VIP',
    'regular': 'Thường',
    'new': 'Mới'
  }
  return typeTexts[type] || 'Không xác định'
}

const getStatusClass = (status) => {
  const statusClasses = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'blocked': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'blocked': 'Bị khóa'
  }
  return statusTexts[status] || 'Không xác định'
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedCustomers.value = filteredCustomers.value.map(c => c.id)
  } else {
    selectedCustomers.value = []
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

const addCustomer = () => {
  const newId = 'C' + String(customers.value.length + 1).padStart(3, '0')
  const customer = {
    id: newId,
    ...newCustomer.value,
    type: 'new',
    status: 'active',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: null,
    createdAt: new Date()
  }
  
  customers.value.unshift(customer)
  showAddCustomerModal.value = false
  
  // Reset form
  newCustomer.value = {
    name: '',
    email: '',
    phone: '',
    address: ''
  }
}

const editCustomer = (customer) => {
  console.log('Edit customer:', customer.id)
}

const deleteCustomer = (customerId) => {
  if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
    const index = customers.value.findIndex(c => c.id === customerId)
    if (index > -1) {
      customers.value.splice(index, 1)
    }
  }
}

const sendEmail = (customerId) => {
  console.log('Send email to customer:', customerId)
}

const exportCustomers = () => {
  console.log('Export customers')
}

// Watch for changes in filtered customers to update select all checkbox
watch([filteredCustomers, selectedCustomers], () => {
  selectAll.value = filteredCustomers.value.length > 0 && 
    filteredCustomers.value.every(c => selectedCustomers.value.includes(c.id))
}, { deep: true })
</script>