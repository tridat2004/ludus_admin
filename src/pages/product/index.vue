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
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tên sản phẩm, SKU..."
                class="form-input pl-10"
              >
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Category Dropdown -->
          <div class="relative" ref="categoryDropdown">
            <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <button
              type="button"
              @click="toggleCategoryDropdown"
              class="form-select w-full text-left flex items-center justify-between bg-white hover:border-primary-500 transition-colors"
            >
              <span class="truncate text-gray-700">{{ selectedCategoryLabel }}</span>
              <svg 
                class="h-5 w-5 text-gray-400 transition-transform duration-200" 
                :class="{ 'rotate-180': showCategoryDropdown }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Parent Categories -->
            <transition name="dropdown">
              <div
                v-show="showCategoryDropdown"
                class="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto"
              >
                <button
                  type="button"
                  @click="selectCategory('')"
                  :class="[
                    'w-full text-left px-4 py-3 text-sm font-medium transition-all duration-150',
                    !selectedCategory ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <svg class="h-5 w-5" :class="!selectedCategory ? 'text-primary-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>Tất cả danh mục</span>
                  </div>
                </button>

                <div class="border-t border-gray-100"></div>

                <div
                  v-for="cat in categories"
                  :key="cat.id || cat._id"
                  class="relative border-b border-gray-50 last:border-0"
                  @mouseenter="showSubCategory(cat, $event)"
                  @mouseleave="hideSubCategory"
                >
                  <div class="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-150 cursor-pointer group">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span>{{ cat.name }}</span>
                      <span class="text-xs text-gray-500 font-normal bg-gray-100 px-2 py-0.5 rounded-full">
                        {{ getSubcategoriesByParent(cat.id || cat._id).length }}
                      </span>
                    </div>
                    <svg class="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Subcategories Panel -->
            <transition name="slide-fade">
              <div
                v-if="activeSubCategory && subCategoryPosition"
                class="fixed z-[60] bg-white border border-gray-200 rounded-xl shadow-2xl w-72 overflow-hidden"
                :style="{ top: subCategoryPosition.top + 'px', left: subCategoryPosition.left + 'px' }"
                @mouseenter="cancelHideSubCategory"
                @mouseleave="hideSubCategory"
              >
                <div class="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600">
                  <div class="flex items-center gap-2 text-white">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span class="font-semibold text-sm">{{ activeSubCategory.name }}</span>
                  </div>
                </div>

                <div class="max-h-80 overflow-y-auto">
                  <button
                    v-for="(sub, index) in getSubcategoriesByParent(activeSubCategory.id || activeSubCategory._id)"
                    :key="sub.id || sub._id"
                    @click="selectCategory(sub.id || sub._id)"
                    :class="[
                      'w-full text-left px-4 py-3 text-sm transition-all duration-150',
                      (sub.id || sub._id) === selectedCategory 
                        ? 'bg-primary-50 text-primary-700 font-medium border-l-4 border-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:pl-6 border-l-4 border-transparent'
                    ]"
                  >
                    <div class="flex items-center gap-2">
                      <svg class="h-4 w-4" :class="(sub.id || sub._id) === selectedCategory ? 'text-primary-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{{ sub.name }}</span>
                    </div>
                  </button>

                  <div
                    v-if="getSubcategoriesByParent(activeSubCategory.id || activeSubCategory._id).length === 0"
                    class="px-4 py-8 text-center"
                  >
                    <svg class="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="text-sm text-gray-500 italic">Chưa có danh mục con</p>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <div class="flex gap-2">
              <select v-model="selectedStatus" class="form-select flex-1">
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang bán</option>
                <option value="false">Ngừng bán</option>
              </select>
              
              <button 
                @click="resetFilters" 
                class="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-primary-500 transition-all duration-200 inline-flex items-center justify-center group"
                title="Đặt lại bộ lọc"
              >
                <svg class="h-5 w-5 text-gray-600 group-hover:text-primary-600 group-hover:rotate-180 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
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

    <!-- Products Grid -->
    <div v-else>
      <!-- Select All -->
      

      <div v-if="products.length > 0" class="grid grid-cols-1 gap-4">
        <div v-for="product in products" :key="product._id" class="card hover-lift">
          <div class="card-body p-4">
            <div class="flex gap-4">
              <!-- Checkbox & Images Gallery -->
              <div class="flex items-start space-x-3">
                <!-- <input 
                  type="checkbox" 
                  :value="product._id" 
                  v-model="selectedProducts"
                  class="mt-1"
                > -->
                
                <!-- Image Gallery (Main + Additional) -->
                <div class="w-32 flex-shrink-0">
                  <!-- Main Image -->
                  <div class="relative group mb-2">
                    <template v-if="product.imageUrl && !imageErrors[product._id + '-main']">
                      <img 
                        :src="product.imageUrl" 
                        :alt="product.name" 
                        class="w-full h-32 object-cover rounded-lg border-2 border-primary-300"
                        @error="() => handleImageError(product._id + '-main')"
                        loading="lazy"
                      >
                      <div class="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                        CHÍNH
                      </div>
                    </template>
                    <template v-else>
                      <div class="w-full h-32 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
                        <PhotoIcon class="h-8 w-8 text-gray-300" />
                      </div>
                    </template>
                  </div>

                  <!-- Additional Images (Small thumbnails) -->
                  <div v-if="product.productImages && product.productImages.length > 0" class="grid grid-cols-3 gap-1">
                    <div 
                      v-for="(img, idx) in product.productImages.slice(0, 6)" 
                      :key="idx"
                      class="relative group"
                    >
                      <template v-if="!imageErrors[product._id + '-' + idx]">
                        <img 
                          :src="img.imageUrl" 
                          :alt="`${product.name} ${idx + 1}`" 
                          class="w-full h-10 object-cover rounded border border-gray-200 hover:border-primary-400 transition-colors cursor-pointer"
                          @error="() => handleImageError(product._id + '-' + idx)"
                          @click="openImagePreview(product, idx)"
                          loading="lazy"
                        >
                        <!-- Image count overlay on last thumbnail -->
                        <div 
                          v-if="idx === 5 && product.productImages.length > 6"
                          class="absolute inset-0 bg-black bg-opacity-60 rounded flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                          @click="openImagePreview(product, idx)"
                        >
                          +{{ product.productImages.length - 6 }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="w-full h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                          <PhotoIcon class="h-3 w-3 text-gray-300" />
                        </div>
                      </template>
                    </div>
                  </div>
                  
                  <!-- Total images count -->
                  <div v-if="getTotalImages(product) > 0" class="text-center mt-1">
                    <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      📸 {{ getTotalImages(product) }} ảnh
                    </span>
                  </div>
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
                    {{ product.isActive ? 'Đang bán' : 'Ngừng bán' }}
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

    <!-- Image Preview Modal -->
    <Modal
      v-model="showImagePreview"
      title="Xem ảnh sản phẩm"
      size="large"
    >
      <div v-if="previewProduct" class="space-y-4">
        <h3 class="text-lg font-semibold">{{ previewProduct.name }}</h3>
        
        <!-- Main preview image -->
        <div class="relative">
          <img 
            :src="currentPreviewImage" 
            :alt="previewProduct.name"
            class="w-full h-96 object-contain bg-gray-50 rounded-lg"
          >
        </div>

        <!-- Thumbnails -->
        <div class="grid grid-cols-6 gap-2">
          <!-- Main image thumbnail -->
          <button
            v-if="previewProduct.imageUrl"
            @click="currentPreviewImage = previewProduct.imageUrl"
            :class="[
              'relative border-2 rounded-lg overflow-hidden transition-all',
              currentPreviewImage === previewProduct.imageUrl ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-primary-300'
            ]"
          >
            <img :src="previewProduct.imageUrl" class="w-full h-16 object-cover">
            <div class="absolute top-0 left-0 bg-green-500 text-white text-[8px] px-1 rounded-br">CHÍNH</div>
          </button>

          <!-- Additional images thumbnails -->
          <button
            v-for="(img, idx) in previewProduct.productImages"
            :key="idx"
            @click="currentPreviewImage = img.imageUrl"
            :class="[
              'border-2 rounded-lg overflow-hidden transition-all',
              currentPreviewImage === img.imageUrl ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-primary-300'
            ]"
          >
            <img :src="img.imageUrl" class="w-full h-16 object-cover">
          </button>
        </div>
      </div>

      <template #footer>
        <button @click="showImagePreview = false" class="btn btn-primary">
          Đóng
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

const { notify } = useNotification()
const success = (msg) => notify(msg, 'success', 3000)
const error = (msg) => notify(msg, 'error', 4000)

const { getProducts, deleteProduct,deleteProductVariantByProduct } = useProduct()
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
const showImagePreview = ref(false)
const previewProduct = ref(null)
const currentPreviewImage = ref('')

// Dropdown states
const showCategoryDropdown = ref(false)
const categoryDropdown = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(6)
const totalProducts = ref(0)
const activeSubCategory = ref(null)
const subCategoryPosition = ref(null)
let hideTimeout = null

const showSubCategory = (cat, event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  activeSubCategory.value = cat
  subCategoryPosition.value = {
    top: rect.top,
    left: rect.right + 10,
  }
  clearTimeout(hideTimeout)
}

const hideSubCategory = () => {
  hideTimeout = setTimeout(() => {
    activeSubCategory.value = null
    subCategoryPosition.value = null
  }, 150)
}

const cancelHideSubCategory = () => {
  clearTimeout(hideTimeout)
}

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

const getTotalImages = (product) => {
  let count = product.imageUrl ? 1 : 0
  count += product.productImages?.length || 0
  return count
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

const handleImageError = (key) => {
  imageErrors.value[key] = true
}

const openImagePreview = (product, startIndex = 0) => {
  previewProduct.value = product
  
  // Set initial preview image
  if (startIndex === 0 && product.imageUrl) {
    currentPreviewImage.value = product.imageUrl
  } else if (product.productImages && product.productImages[startIndex]) {
    currentPreviewImage.value = product.productImages[startIndex].imageUrl
  } else if (product.imageUrl) {
    currentPreviewImage.value = product.imageUrl
  }
  
  showImagePreview.value = true
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  showCategoryDropdown.value = false
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
  const id = productToDelete.value?._id || productToDelete.value?.id;
  if (!id) return;

  deleting.value = true;
  try {
    // Xoá biến thể trước
    await deleteProductVariantByProduct(id);

    // Xoá sản phẩm
    await deleteProduct(id);

    showDeleteDialog.value = false;
    productToDelete.value = null;

    await nextTick();
    await fetchProducts();

    success("Xóa sản phẩm thành công!");
  } catch (err) {
    error(err.response?.data?.message || "Lỗi khi xóa sản phẩm!");
  } finally {
    deleting.value = false;
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
    for (const productId of selectedProducts.value) {
      try {
        await deleteProduct(productId)
        successCount++
      } catch (err) {
        console.error(`Failed to delete product ${productId}:`, err)
        failCount++
      }
    }

    showBulkDeleteDialog.value = false
    selectedProducts.value = []
    selectAll.value = false
    
    await nextTick()
    await fetchProducts()

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
  selectedProducts.value = []
  selectAll.value = false
  fetchProducts()
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(selectedProducts, () => {
  if (products.value.length === 0) {
    selectAll.value = false
    return
  }
  
  selectAll.value = products.value.every(p => selectedProducts.value.includes(p._id))
}, { deep: true })

watch(products, () => {
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
  
  document.addEventListener('click', (e) => {
    if (categoryDropdown.value && !categoryDropdown.value.contains(e.target)) {
      showCategoryDropdown.value = false
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-5px);
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

.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>