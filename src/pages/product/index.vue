<!-- pages/product/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <p class="text-gray-600 mt-1">Quản lý tất cả sản phẩm trong cửa hàng</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Bulk Delete Button -->
        <button
          v-if="selectedProducts.length > 0"
          @click="confirmBulkDelete"
          class="btn btn-danger inline-flex items-center justify-center"
        >
          <TrashIcon class="h-5 w-5 mr-2" />
          Xóa {{ selectedProducts.length }} sản phẩm
        </button>
        
        <NuxtLink to="/product/create" class="btn btn-primary inline-flex items-center justify-center">
          <PlusIcon class="h-5 w-5 mr-2" />
          Thêm sản phẩm
        </NuxtLink>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tên sản phẩm, SKU..."
              class="form-input"
            >
          </div>
          
          <!-- ✅ Custom Dropdown với Hover -->
          <!-- Dropdown chọn danh mục -->
<div class="relative" ref="categoryDropdown" style="margin-top: 24px;">
  <button
    type="button"
    @click="toggleCategoryDropdown"
    class="form-select w-full text-left flex items-center justify-between"
  >
    <span class="truncate">{{ selectedCategoryLabel }}</span>
    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <!-- Danh mục cha -->
  <div
    v-show="showCategoryDropdown"
    class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto"
  >
    <button
      type="button"
      @click="selectCategory('')"
      class="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
    >
      Tất cả danh mục
    </button>

    <div
      v-for="cat in categories"
      :key="cat.id || cat._id"
      class="relative group border-t border-gray-100 hover:bg-gray-50 transition"
      @mouseenter="showSubCategory(cat, $event)"
      @mouseleave="hideSubCategory"
    >
      <div class="flex items-center justify-between px-4 py-2 font-semibold text-gray-900 cursor-pointer">
        <span>{{ cat.name }}</span>
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>

  <!-- ✅ Bảng danh mục con tách riêng -->
  <transition name="fade">
    <div
      v-if="activeSubCategory && subCategoryPosition"
      class="fixed z-[60] bg-white border border-gray-300 rounded-lg shadow-2xl w-64"
      :style="{ top: subCategoryPosition.top + 'px', left: subCategoryPosition.left + 'px' }"
      @mouseenter="cancelHideSubCategory"
      @mouseleave="hideSubCategory"
    >
      <div class="px-4 py-2 bg-gray-50 border-b font-semibold text-gray-800">
        Danh mục con của "{{ activeSubCategory.name }}"
      </div>
      <div>
        <button
          v-for="sub in getSubcategoriesByParent(activeSubCategory.id || activeSubCategory._id)"
          :key="sub.id || sub._id"
          @click="selectCategory(sub.id || sub._id)"
          class="w-full text-left px-4 py-2 hover:bg-primary-50 border-b border-gray-100 text-gray-700"
        >
          {{ sub.name }}
        </button>
        <div
          v-if="getSubcategoriesByParent(activeSubCategory.id || activeSubCategory._id).length === 0"
          class="px-4 py-3 text-sm text-gray-500 italic"
        >
          Chưa có danh mục con
        </div>
      </div>
    </div>
  </transition>
</div>


          <div style="margin-top: -5px;">
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <div class="flex gap-2 items-center">
              <select v-model="selectedStatus" class="form-select flex-1">
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang bán</option>
                <option value="false">Ngưng bán</option>
              </select>
              
              <button 
                @click="resetFilters" 
                class="btn btn-secondary inline-flex items-center justify-center whitespace-nowrap"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>
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
      <!-- Select All -->
      <div v-if="products.length > 0" class="flex items-center gap-2 mb-4">
        <input 
          type="checkbox" 
          v-model="selectAll"
          @change="toggleSelectAll"
          class="h-4 w-4 text-primary-600 rounded"
        >
        <label class="text-sm text-gray-700">
          Chọn tất cả {{ products.length }} sản phẩm
        </label>
      </div>

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
                  <template v-if="product.imageUrl && !imageErrors[product._id]">
                    <img 
                      :src="product.imageUrl" 
                      :alt="product.name" 
                      class="h-full w-full object-cover"
                      @error="() => handleImageError(product._id)"
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
                        <span v-if="imageErrors[product._id]" class="text-xs text-red-500 block mt-1">Lỗi tải</span>
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

    <!-- Delete Single Product Modal -->
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

    <!-- Bulk Delete Modal -->
    <Modal
      v-model="showBulkDeleteDialog"
      title="Xác nhận xóa nhiều sản phẩm"
      :loading="deleting"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          Bạn có chắc chắn muốn xóa <strong>{{ selectedProducts.length }} sản phẩm</strong> đã chọn?
        </p>
        <div class="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3">
          <ul class="space-y-1 text-sm">
            <li v-for="id in selectedProducts" :key="id" class="text-gray-700">
              • {{ getProductName(id) }}
            </li>
          </ul>
        </div>
        <p class="text-sm text-red-600 font-medium">
          ⚠️ Hành động này không thể hoàn tác!
        </p>
      </div>

      <template #footer>
        <button @click="showBulkDeleteDialog = false" class="btn btn-secondary">
          Hủy
        </button>
        <button @click="handleBulkDelete" :disabled="deleting" class="btn btn-danger">
          {{ deleting ? 'Đang xóa...' : `Xóa ${selectedProducts.length} sản phẩm` }}
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

// ✅ FIX: useNotification đúng cách
const { notify } = useNotification()
const success = (msg) => notify(msg, 'success', 3000)
const error = (msg) => notify(msg, 'error', 4000)

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
const showBulkDeleteDialog = ref(false)
const productToDelete = ref(null)
const imageErrors = ref({})

// ✅ Dropdown states
const showCategoryDropdown = ref(false)
const hoveredCategory = ref(null)
const categoryDropdown = ref(null)

// Pagination - 6 items per page
const currentPage = ref(1)
const itemsPerPage = ref(6)
const totalProducts = ref(0)
const activeSubCategory = ref(null);
const subCategoryPosition = ref(null);
let hideTimeout = null;

const showSubCategory = (cat, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  activeSubCategory.value = cat;
  subCategoryPosition.value = {
    top: rect.top,
    left: rect.right + 10,
  };
  clearTimeout(hideTimeout);
};

const hideSubCategory = () => {
  hideTimeout = setTimeout(() => {
    activeSubCategory.value = null;
    subCategoryPosition.value = null;
  }, 150);
};

const cancelHideSubCategory = () => {
  clearTimeout(hideTimeout);
};

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
const getSubcategoriesByParent = (parentId) => {
  return subcategories.value.filter(sub => {
    const categoryId = sub.categoryId || sub.category?._id || sub.category?.id || sub.category
    return String(categoryId) === String(parentId)
  })
}

const selectedCategoryLabel = computed(() => {
  if (!selectedCategory.value) return 'Tất cả danh mục'
  
  const subcategory = subcategories.value.find(sub => 
    String(sub.id || sub._id) === String(selectedCategory.value)
  )
  
  if (!subcategory) return 'Tất cả danh mục'
  
  const category = categories.value.find(cat => {
    const catId = cat.id || cat._id
    const subCatId = subcategory.categoryId || subcategory.category?._id || subcategory.category?.id || subcategory.category
    return String(catId) === String(subCatId)
  })
  
  return category ? `${category.name} > ${subcategory.name}` : subcategory.name
})

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
const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  showCategoryDropdown.value = false
  hoveredCategory.value = null
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = products.value.map(p => p._id)
  } else {
    selectedProducts.value = []
  }
}

const getProductName = (productId) => {
  const product = products.value.find(p => p._id === productId)
  return product?.name || 'Không xác định'
}

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

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  showCategoryDropdown.value = false
  hoveredCategory.value = null
  fetchProducts()
}

const editProduct = (product) => {
  const id = product._id || product.id
  if (!id) {
    return error('Không tìm thấy ID sản phẩm!')
  }
  navigateTo(`/product/edit?id=${id}`)
}

// Single delete
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

// Bulk delete
const confirmBulkDelete = () => {
  if (selectedProducts.value.length === 0) {
    error('Vui lòng chọn ít nhất 1 sản phẩm!')
    return
  }
  showBulkDeleteDialog.value = true
}

const handleBulkDelete = async () => {
  if (selectedProducts.value.length === 0) return

  deleting.value = true
  const totalSelected = selectedProducts.value.length
  let successCount = 0
  let failCount = 0

  try {
    // Xóa từng sản phẩm
    for (const productId of selectedProducts.value) {
      try {
        await deleteProduct(productId)
        successCount++
      } catch (err) {
        console.error(`Failed to delete product ${productId}:`, err)
        failCount++
      }
    }

    // Đóng modal và reset
    showBulkDeleteDialog.value = false
    selectedProducts.value = []
    selectAll.value = false
    
    // Refresh danh sách
    await nextTick()
    await fetchProducts()

    // Hiển thị kết quả
    if (failCount === 0) {
      success(`Xóa thành công ${successCount} sản phẩm!`)
    } else {
      error(`Xóa thành công ${successCount}/${totalSelected} sản phẩm. ${failCount} sản phẩm lỗi!`)
    }
  } catch (err) {
    error('Có lỗi xảy ra khi xóa sản phẩm!')
  } finally {
    deleting.value = false
  }
}

// Watchers
watch([currentPage, searchQuery, selectedCategory, selectedStatus], () => {
  imageErrors.value = {}
  // ✅ Reset selected products khi filter thay đổi
  selectedProducts.value = []
  selectAll.value = false
  fetchProducts()
})

watch(searchQuery, () => {
  currentPage.value = 1
})

// ✅ FIX: Sync selectAll với selectedProducts
watch(selectedProducts, () => {
  if (products.value.length === 0) {
    selectAll.value = false
    return
  }
  
  selectAll.value = products.value.every(p => selectedProducts.value.includes(p._id))
}, { deep: true })

watch(products, () => {
  // Auto update selectAll khi products thay đổi
  if (products.value.length === 0) {
    selectAll.value = false
    selectedProducts.value = []
  } else {
    selectAll.value = products.value.every(p => selectedProducts.value.includes(p._id))
  }
})

// Init
onMounted(() => {
  fetchCategories()
  fetchSubCategories()
  fetchProducts()
  
  // ✅ Close dropdown when click outside
  document.addEventListener('click', (e) => {
    if (categoryDropdown.value && !categoryDropdown.value.contains(e.target)) {
      showCategoryDropdown.value = false
      hoveredCategory.value = null
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-3px);
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