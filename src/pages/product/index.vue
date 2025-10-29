<!-- pages/product/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <p class="text-gray-600 mt-1">Quản lý tất cả sản phẩm trong cửa hàng</p>
      </div>
      <NuxtLink to="/product/create" class="btn btn-primary inline-flex items-center justify-center">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục con</label>
            <select v-model="selectedCategory" class="form-select">
              <option value="">Tất cả danh mục con</option>
              <option v-for="sub in subcategories" :key="sub.id || sub._id" :value="sub.id || sub._id">
                {{ sub.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select v-model="selectedStatus" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang bán</option>
              <option value="false">Ngưng bán</option>
            </select>
          </div>

          <div class="flex items-end">
            <button 
              @click="resetFilters" 
              class="btn btn-secondary w-full inline-flex items-center justify-center"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Products Grid (Card Style) -->
    <div v-else>
      <div v-if="products.length > 0" class="grid grid-cols-1 gap-4">
        <div v-for="product in products" :key="product._id" class="card hover-lift">
          <div class="card-body p-4">
            <div class="flex gap-4">
              <!-- Checkbox & Image -->
              <div class="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  :value="product._id" 
                  v-model="selectedProducts"
                  class="mt-1"
                >
                <div 
                  class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative group"
                >
                  <template v-if="product.imageUrl && !imageErrors[product.id]">
                    <img 
                      :src="product.imageUrl" 
                      :alt="product.name" 
                      class="h-full w-full object-cover"
                      @error="() => handleImageError(product.id)"
                      loading="lazy"
                    >
                    <div class="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PhotoIcon class="h-6 w-6 text-white" />
                    </div>
                  </template>
                  
                  <template v-else>
                    <div class="h-full w-full flex items-center justify-center bg-gray-50">
                      <div class="text-center">
                        <PhotoIcon class="h-8 w-8 text-gray-300 mx-auto" />
                        <span v-if="imageErrors[product.id]" class="text-xs text-red-500 block mt-1">Lỗi tải</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4">
                <!-- Name & Description -->
                <div class="md:col-span-3">
                  <h3 class="font-semibold text-gray-900 truncate">{{ product.name }}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ product.description || 'Chưa có mô tả' }}</p>
                  <p class="text-xs text-gray-500 mt-1 font-mono">SKU: {{ product.productCode || 'N/A' }}</p>
                </div>

                <!-- Category -->
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-500 mb-1">Danh mục</p>
                  <p class="text-sm font-medium text-gray-900">{{ getCategoryName(product.subcategoryId) }}</p>
                </div>

                <!-- Price & Stock -->
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-500 mb-1">Giá bán</p>
                  <p class="text-base font-bold text-primary-600">{{ formatCurrency(product.price) }}</p>
                  <p class="text-sm mt-1">
                    <span class="text-gray-500">Kho:</span>
                    <span :class="product.stockQuantity <= 10 ? 'text-red-600 font-semibold' : 'text-gray-900 font-medium'">
                      {{ product.stockQuantity || 0 }}
                    </span>
                  </p>
                </div>

                <!-- Size/Color -->
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-500 mb-1">Biến thể</p>
                  <div class="flex flex-col text-sm">
                    <span v-if="product.sizes?.length" class="text-gray-700">
                      <strong>Size:</strong> {{ product.sizes.join(', ') }}
                    </span>
                    <span v-if="product.colors?.length" class="text-gray-700">
                      <strong>Màu:</strong> {{ product.colors.join(', ') }}
                    </span>
                    <span v-if="!product.sizes?.length && !product.colors?.length" class="text-gray-400 italic">
                      Không có
                    </span>
                  </div>
                </div>

                <!-- Status & Date -->
                <div class="md:col-span-2">
                  <span class="badge" :class="product.isActive ? 'badge-success' : 'badge-secondary'">
                    {{ product.isActive ? 'Đang bán' : 'Ngưng bán' }}
                  </span>
                  <p class="text-xs text-gray-500 mt-2">{{ formatDate(product.createdAt) }}</p>
                </div>

                <!-- Actions -->
                <div class="md:col-span-1 flex md:flex-col gap-2 md:items-end md:justify-center">
                  <button
                    @click="editProduct(product)"
                    class="flex items-center justify-center p-2.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button 
                    @click="confirmDelete(product)"
                    class="flex items-center justify-center p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có sản phẩm' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu bằng cách thêm sản phẩm mới' }}
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && products.length > 0" class="flex items-center justify-between mt-6 pt-6 border-t">
        <div class="text-sm text-gray-700">
          Hiển thị {{ startItem }} đến {{ endItem }} trong tổng số {{ totalProducts }} sản phẩm
        </div>
        
        <div v-if="totalPages > 1" class="flex items-center space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Trước
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="(page, index) in displayPages"
              :key="index"
              @click="page !== '...' && (currentPage = page)"
              :class="[
                'min-w-[40px] px-3 py-2 border rounded-lg transition-colors',
                page === currentPage 
                  ? 'bg-primary-600 text-white border-primary-600 font-semibold' 
                  : page === '...'
                  ? 'cursor-default border-transparent'
                  : 'border-gray-300 hover:bg-gray-50'
              ]"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-model="showDeleteDialog"
      title="Xác nhận xóa"
      :loading="deleting"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          Bạn có chắc chắn muốn xóa sản phẩm <strong>{{ productToDelete?.name }}</strong>?
        </p>
        <p class="text-sm text-red-600">
          Hành động này không thể hoàn tác!
        </p>
      </div>

      <template #footer>
        <button @click="showDeleteDialog = false" class="btn btn-secondary">
          Hủy
        </button>
        <button @click="handleDelete" :disabled="deleting" class="btn btn-danger">
          {{ deleting ? 'Đang xóa...' : 'Xóa sản phẩm' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShoppingBagIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import Modal from '~/components/ui/Modal.vue'

definePageMeta({
  layout: 'default'
})

const { success, error } = useNotification()
const { getProducts, deleteProduct } = useProduct()
const { getCategories } = useCategory()
const { getSubCategories } = useSubCategory()

// State
const products = ref([])
const categories = ref([])
const subcategories = ref([])
const loading = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedProducts = ref([])
const selectAll = ref(false)
const showDeleteDialog = ref(false)
const productToDelete = ref(null)
const imageErrors = ref({})

// Pagination - 6 items per page
const currentPage = ref(1)
const itemsPerPage = ref(6)
const totalProducts = ref(0)

// Fetch data
const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      q: searchQuery.value || undefined,
      id: selectedCategory.value || undefined,
      isActive: selectedStatus.value ? selectedStatus.value === 'true' : undefined
    }

    const response = await getProducts(params)
    // 🔥 lấy đúng cấp
    const apiData = response.data || response

    products.value = apiData.data || []
    totalProducts.value = apiData.pagination?.total || 0
  } catch (err) {
    console.error('❌ Error fetching products:', err)
    error('Không thể tải danh sách sản phẩm!')
    products.value = []
    totalProducts.value = 0
  } finally {
    loading.value = false
  }
}


const fetchCategories = async () => {
  try {
    const response = await getCategories({ limit: 1000 })
    categories.value = response.data || response || []
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const fetchSubCategories = async () => {
  try {
    const response = await getSubCategories({ limit: 1000 })
    subcategories.value = response.data || response || []
  } catch (err) {
    console.error('Error fetching subcategories:', err)
  }
}

// Computed
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value))

const startItem = computed(() => {
  if (totalProducts.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, totalProducts.value)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    pages.push(total)
  }
  
  return pages
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const getCategoryName = (subcategoryId) => {
  if (!subcategoryId) return 'Chưa phân loại'
  
  const subcategory = subcategories.value.find(sub => 
    sub.id === subcategoryId || 
    sub._id === subcategoryId ||
    String(sub.id) === String(subcategoryId) ||
    String(sub._id) === String(subcategoryId)
  )
  
  if (!subcategory) return 'Chưa phân loại'
  
  const category = categories.value.find(cat => 
    cat.id === subcategory.categoryId || 
    cat._id === subcategory.categoryId ||
    String(cat.id) === String(subcategory.categoryId) ||
    String(cat._id) === String(subcategory.categoryId)
  )
  
  return category ? `${category.name} > ${subcategory.name}` : subcategory.name
}

const handleImageError = (productId) => {
  imageErrors.value[productId] = true
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Image load failed for product: ${productId}`)
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = products.value.map(p => p._id)
  } else {
    selectedProducts.value = []
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  fetchProducts()
}

const editProduct = (product) => {
  const id = product._id || product.id
  if (!id) {
    return error('Không tìm thấy ID sản phẩm!')
  }
  console.log('Navigate to edit product with ID:', id)  // kiểm tra
  navigateTo(`/product/edit?id=${id}`)
}



const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  const id = productToDelete.value?._id || productToDelete.value?.id
  if (!id) return

  deleting.value = true
  try {
    await deleteProduct(id)
    showDeleteDialog.value = false
    productToDelete.value = null
    await nextTick()
    await fetchProducts()
    success('Xóa sản phẩm thành công!')
  } catch (err) {
    error(err.response?.data?.message || 'Lỗi khi xóa sản phẩm!')
  } finally {
    deleting.value = false
  }
}

// Watchers
watch([currentPage, searchQuery, selectedCategory, selectedStatus], () => {
  // Reset image errors when page changes
  imageErrors.value = {}
  fetchProducts()
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch([products, selectedProducts], () => {
  selectAll.value = products.value.length > 0 && 
    products.value.every(p => selectedProducts.value.includes(p._id))
}, { deep: true })

// Init
onMounted(() => {
  fetchCategories()
  fetchSubCategories()
  fetchProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow;
}
</style>