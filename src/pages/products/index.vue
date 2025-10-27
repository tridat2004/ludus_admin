<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <p class="text-gray-600">Quản lý tất cả sản phẩm trong cửa hàng</p>
      </div>
      <NuxtLink to="/products/create" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm sản phẩm
      </NuxtLink>
    </div>

    <!-- Filters and search -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tên sản phẩm, SKU..."
              class="form-input"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select v-model="selectedCategory" class="form-select">
              <option value="">Tất cả danh mục</option>
              <option value="electronics">Điện tử</option>
              <option value="fashion">Thời trang</option>
              <option value="home">Gia dụng</option>
              <option value="books">Sách</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select v-model="selectedStatus" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngưng bán</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="resetFilters" class="btn btn-secondary w-full">
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Products table -->
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th>Sản phẩm</th>
              <th>SKU</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <input 
                  type="checkbox" 
                  :value="product.id" 
                  v-model="selectedProducts"
                >
              </td>
              <td>
                <div class="flex items-center">
                  <img :src="product.image" :alt="product.name" class="h-12 w-12 rounded-lg object-cover">
                  <div class="ml-4">
                    <p class="font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-600">{{ product.description }}</p>
                  </div>
                </div>
              </td>
              <td class="font-mono text-sm">{{ product.sku }}</td>
              <td>{{ product.category }}</td>
              <td class="font-medium">{{ formatCurrency(product.price) }}</td>
              <td>
                <span :class="product.stock <= 10 ? 'text-red-600 font-medium' : 'text-gray-900'">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(product.status)">
                  {{ getStatusText(product.status) }}
                </span>
              </td>
              <td class="text-sm text-gray-600">{{ formatDate(product.createdAt) }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <NuxtLink 
                    :to="`/products/${product.id}/edit`"
                    class="text-orange-600 hover:text-orange-900"
                    title="Sửa"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </NuxtLink>
                  <button 
                    @click="deleteProduct(product.id)"
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
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} đến 
          {{ Math.min(currentPage * itemsPerPage, totalProducts) }} 
          trong tổng số {{ totalProducts }} sản phẩm
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          
          <button class="px-3 py-2 bg-primary-600 text-white rounded-md text-sm">
            {{ currentPage }}
          </button>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedProducts = ref([])
const selectAll = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Mock data
const products = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: 'Điện thoại thông minh cao cấp',
    sku: 'IP15PM001',
    category: 'Điện tử',
    price: 30000000,
    stock: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    description: 'Laptop chuyên nghiệp',
    sku: 'MBP003M3',
    category: 'Điện tử',
    price: 50000000,
    stock: 23,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-08')
  },
  {
    id: 3,
    name: 'Áo sơ mi nam',
    description: 'Áo sơ mi công sở cao cấp',
    sku: 'ASM001',
    category: 'Thời trang',
    price: 650000,
    stock: 120,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-05')
  },
  {
    id: 4,
    name: 'Nồi cơm điện Panasonic',
    description: 'Nồi cơm điện 1.8L',
    sku: 'NCD18L',
    category: 'Gia dụng',
    price: 1200000,
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-03')
  },
  {
    id: 5,
    name: 'Sách lập trình JavaScript',
    description: 'Sách học lập trình cho người mới',
    sku: 'BOOK001',
    category: 'Sách',
    price: 320000,
    stock: 0,
    status: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    createdAt: new Date('2024-01-01')
  }
])

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => 
      product.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(product => product.status === selectedStatus.value)
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const totalProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => 
      product.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(product => product.status === selectedStatus.value)
  }

  return filtered.length
})

const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value))

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

const getStatusClass = (status) => {
  const statusClasses = {
    'active': 'badge-success',
    'inactive': 'badge-secondary',
    'out-of-stock': 'badge-danger'
  }
  return statusClasses[status] || 'badge-secondary'
}

const getStatusText = (status) => {
  const statusTexts = {
    'active': 'Đang bán',
    'inactive': 'Ngưng bán',
    'out-of-stock': 'Hết hàng'
  }
  return statusTexts[status] || 'Không xác định'
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = filteredProducts.value.map(p => p.id)
  } else {
    selectedProducts.value = []
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

const deleteProduct = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }
}

// Watch for changes in filtered products
watch([filteredProducts, selectedProducts], () => {
  selectAll.value = filteredProducts.value.length > 0 && 
    filteredProducts.value.every(p => selectedProducts.value.includes(p.id))
}, { deep: true })
</script>
 