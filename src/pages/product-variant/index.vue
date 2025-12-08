<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý biến thể sản phẩm</h1>
        <p class="text-gray-600">Quản lý màu sắc và kích cỡ của sản phẩm</p>
      </div>
      <button 
        @click="openAddModal" 
        class="btn btn-primary  px-5 py-2 text-base rounded-xl"
        :disabled="!selectedProductId"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm biến thể
      </button>
    </div>

    <!-- Product Selector -->
    <div class="card">
      <div class="card-body">
        <label class="form-label font-semibold">Chọn sản phẩm để quản lý biến thể</label>
        <select 
          v-model="selectedProductId" 
          class="form-select"
          :disabled="loadingProducts"
        >
          <option value="">
            {{ loadingProducts ? 'Đang tải sản phẩm...' : '-- Chọn sản phẩm --' }}
          </option>
          <option 
            v-for="product in products" 
            :key="product._id || product.id" 
            :value="product._id || product.id"
          >
            {{ product.productName || product.name || product.title || 'Không có tên' }}
            {{ product.category?.categoryName ? `(${product.category.categoryName})` : '' }}
          </option>
        </select>
      </div>
    </div>

    <!-- Filters (Only show when product is selected) -->
    <div v-if="selectedProductId" class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Tìm theo SKU, màu, size..." 
            class="form-input"
          >
          <select v-model="filterColor" class="form-select">
            <option value="">Tất cả màu</option>
            <option v-for="color in uniqueColors" :key="color" :value="color">
              {{ color }}
            </option>
          </select>
          <select v-model="filterSize" class="form-select">
            <option value="">Tất cả kích cỡ</option>
            <option v-for="size in uniqueSizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card">
      <div class="card-body text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Đang tải biến thể...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedProductId" class="card">
      <div class="card-body text-center py-12">
        <p class="text-gray-500 text-lg">Vui lòng chọn sản phẩm để xem biến thể</p>
      </div>
    </div>

    <!-- Variants Table -->
    <div v-else-if="variants.length > 0" class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Màu sắc</th>
              <th>Kích cỡ</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variant in paginatedVariants" :key="variant._id || variant.id">
              <td>
                <img 
                  :src="variant.variantImageUrl || '/placeholder.png'" 
                  :alt="variant.color" 
                  class="h-12 w-12 rounded object-cover border"
                  @error="(e) => e.target.src = '/placeholder.png'"
                >
              </td>
              <td>
                <span class="font-medium">{{ variant.color || 'N/A' }}</span>
              </td>
              <td>
                <span class="badge badge-info">{{ variant.size || 'N/A' }}</span>
              </td>
              <td class="font-medium">{{ formatCurrency(variant.variantPrice) }}</td>
              <td :class="variant.stockQuantity <= 5 ? 'text-red-600 font-medium' : ''">
                {{ variant.stockQuantity }}
              </td>
              <td>
                <span 
                  class="badge" 
                  :class="variant.isActive ? 'badge-success' : 'badge-secondary'"
                >
                  {{ variant.isActive ? 'Hoạt động' : 'Ẩn' }}
                </span>
              </td>
              <td>
                <div class="flex items-center space-x-2">
                  <!-- Sửa -->
                  <button 
                    @click="editVariant(variant)" 
                    class="text-primary-600 hover:text-primary-900"
                    title="Sửa"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>

                  <!-- Ẩn / Hiện -->
                  <button 
                    @click="toggleVariantStatus(variant)" 
                    :class="variant.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                    :title="variant.isActive ? 'Ẩn biến thể' : 'Kích hoạt biến thể'"
                  >
                    <svg v-if="variant.isActive" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7C13.268 16.057 16.522 19 12 19c-4.478 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <!-- XÓA -->
                  <button 
                    @click="confirmDelete(variant)" 
                    class="text-red-600 hover:text-red-900"
                    title="Xóa biến thể vĩnh viễn"
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
      <div class="p-4 border-t flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Hiển thị <strong>{{ startIndex + 1 }}</strong> - <strong>{{ endIndex }}</strong> 
          trong tổng số <strong>{{ filteredVariants.length }}</strong> biến thể
        </div>
        
        <div class="flex items-center space-x-2">
          <button @click="currentPage = 1" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" title="Trang đầu">«</button>
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">‹ Trước</button>
          <div class="flex items-center space-x-1">
            <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
              :class="['px-3 py-1 border rounded', currentPage === page ? 'bg-primary-600 text-white' : 'hover:bg-gray-50']">
              {{ page }}
            </button>
          </div>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Sau ›</button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" title="Trang cuối">»</button>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="card">
      <div class="card-body text-center py-12">
        <p class="text-gray-500 text-lg mb-4">Chưa có biến thể nào cho sản phẩm này</p>
        <button @click="openAddModal" class="btn btn-primary  px-5 py-2 text-base rounded-xl">
          <PlusIcon class="h-5 w-5 mr-2" />
          Thêm biến thể đầu tiên
        </button>
      </div>
    </div>

    <!-- Modal Add/Edit -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 class="text-lg font-semibold">
            {{ editingVariant ? 'Sửa biến thể' : 'Thêm biến thể mới' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveVariant" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="form-label required">Sản phẩm</label>
              <select v-model="formData.productId" class="form-select" required :disabled="!!editingVariant">
                <option value="">Chọn sản phẩm</option>
                <option v-for="product in products" :key="product._id || product.id" :value="product._id || product.id">
                  {{ product.productName || product.name || product.title || 'N/A' }}
                </option>
              </select>
            </div>

            <div>
  <label class="form-label required">Màu sắc</label>
  <select v-model="formData.color" class="form-select" required>
    <option value="">-- Chọn màu --</option>
    <option v-for="c in productColors" :key="c" :value="c">{{ c }}</option>
  </select>
</div>

<div>
  <label class="form-label required">Kích cỡ</label>
  <select v-model="formData.size" class="form-select" required>
    <option value="">-- Chọn size --</option>
    <option v-for="s in productSizes" :key="s" :value="s">{{ s }}</option>
  </select>
</div>


            <div>
              <label class="form-label required">Giá (VNĐ)</label>
              <input v-model.number="formData.variantPrice" type="number" min="0" step="1000" class="form-input" required>
            </div>

            <div>
              <label class="form-label required">Tồn kho</label>
              <input v-model.number="formData.stockQuantity" type="number" min="0" class="form-input" required>
            </div>

            <div class="col-span-2">
              <label class="form-label" :class="{ 'required': !editingVariant }">Hình ảnh biến thể</label>
              <div 
                @drop.prevent="handleDrop"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                :class="['border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer', isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400']"
                @click="$refs.fileInput.click()"
              >
                <div v-if="imagePreview" class="relative inline-block mb-4">
                  <img :src="imagePreview" alt="Preview" class="h-32 w-32 object-cover rounded-lg border-2 border-gray-200">
                  <button type="button" @click.stop="removeImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div v-else>
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-600">
                    <span class="font-medium text-primary-600">Nhấp để chọn</span> hoặc kéo thả ảnh vào đây
                  </p>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (tối đa 5MB)</p>
                </div>
              </div>
              <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden">
              <p v-if="!editingVariant" class="text-xs text-red-500 mt-1">* Bắt buộc khi thêm mới</p>
            </div>

            <div class="col-span-2 flex items-center gap-2">
              <input v-model="formData.isActive" type="checkbox" id="isActive" class="form-checkbox h-5 w-5 rounded">
              <label for="isActive" class="cursor-pointer">Kích hoạt biến thể này</label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="closeModal" class="btn btn-secondary">Hủy</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Đang lưu...' : (editingVariant ? 'Cập nhật' : 'Thêm mới') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { PlusIcon, PencilIcon, XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline'
import useProduct_variant from '~/composables/useProduct_variant'
import useProduct from '~/composables/useProduct'
import { useNotification } from '~/composables/useNotfication'

definePageMeta({ layout: 'default' })

// State
const showAddModal = ref(false)
const editingVariant = ref(null)
const searchQuery = ref('')
const filterColor = ref('')
const filterSize = ref('')
const selectedProductId = ref('')
const loading = ref(false)
const saving = ref(false)
const loadingProducts = ref(false)
const isDragging = ref(false)
const imagePreview = ref('')
const imageFile = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6

// Composables
const { getProductVariants, createProductVariant, updateProductVariant, deleteProductVariant } = useProduct_variant()
const { getProducts } = useProduct()
const { notify } = useNotification()

const success = (msg) => notify(msg, 'success', 3000)
const error = (msg) => notify(msg, 'error', 4000)

// Data
const products = ref([])
const variants = ref([])

// Form data
const formData = ref({
  productId: '',
  color: '',
  size: '',
  variantPrice: 0,
  stockQuantity: 0,
  isActive: true
})

const selectedProduct = computed(() =>
  products.value.find(p => (p._id || p.id) === selectedProductId.value)
)

const productSizes = computed(() =>
  selectedProduct.value?.sizes || []
)

const productColors = computed(() =>
  selectedProduct.value?.colors || []
)

// Fetch products
const fetchProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await getProducts({ limit: 1000 })
    let apiData = response?.data?.data || response?.data || response || []
    if (!Array.isArray(apiData) && apiData.data) apiData = apiData.data
    products.value = Array.isArray(apiData) ? apiData : []
  } catch (err) {
    console.error('Error fetching products:', err)
    error('Không thể tải danh sách sản phẩm!')
  } finally {
    loadingProducts.value = false
  }
}

// Fetch variants
const fetchProductVariants = async (productId) => {
  if (!productId) {
    variants.value = []
    return
  }
  loading.value = true
  try {
    const response = await getProductVariants(productId, { limit: 1000 })
    const apiData = response.data?.data || response.data || response || []
    variants.value = Array.isArray(apiData) ? apiData : (apiData.data || [])
    currentPage.value = 1
  } catch (err) {
    console.error('Error fetching variants:', err)
    error('Không thể tải danh sách biến thể!')
    variants.value = []
  } finally {
    loading.value = false
  }
}

// Watchers
watch(selectedProductId, (newId) => {
  fetchProductVariants(newId)
  searchQuery.value = ''
  filterColor.value = ''
  filterSize.value = ''
})

watch([searchQuery, filterColor, filterSize], () => {
  currentPage.value = 1
})

// Computed
const uniqueColors = computed(() => [...new Set(variants.value.map(v => v.color).filter(Boolean))])
const uniqueSizes = computed(() => [...new Set(variants.value.map(v => v.size).filter(Boolean))])

const filteredVariants = computed(() => {
  return variants.value.filter(v => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchSearch = !searchQuery.value || 
      (v.sku && v.sku.toLowerCase().includes(searchLower)) ||
      (v.color && v.color.toLowerCase().includes(searchLower)) ||
      (v.size && v.size.toLowerCase().includes(searchLower))
    const matchColor = !filterColor.value || v.color === filterColor.value
    const matchSize = !filterSize.value || v.size === filterSize.value
    return matchSearch && matchColor && matchSize
  })
})

const totalPages = computed(() => Math.ceil(filteredVariants.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredVariants.value.length))
const paginatedVariants = computed(() => filteredVariants.value.slice(startIndex.value, endIndex.value))

const visiblePages = computed(() => {
  const pages = [], total = totalPages.value, current = currentPage.value
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 3) {
    pages.push(1, 2, 3, 4, 5)
  } else if (current >= total - 2) {
    pages.push(total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(current - 2, current - 1, current, current + 1, current + 2)
  }
  return pages
})

// Format currency
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)

// File handling
const handleDrop = (e) => { isDragging.value = false; if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }
const handleFileSelect = (e) => { if (e.target.files[0]) handleFile(e.target.files[0]) }
const handleFile = (file) => {
  if (!file.type.startsWith('image/')) return error('Vui lòng chọn file ảnh!')
  if (file.size > 5 * 1024 * 1024) return error('Kích thước ảnh không được vượt quá 5MB!')
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => imagePreview.value = e.target.result
  reader.readAsDataURL(file)
}
const removeImage = () => { imageFile.value = null; imagePreview.value = '' }

// Modal
const openAddModal = () => {
  if (!selectedProductId.value) return error('Vui lòng chọn sản phẩm trước!')
  formData.value.productId = selectedProductId.value
  showAddModal.value = true
}

const editVariant = (variant) => {
  const variantId = variant._id || variant.id
  if (!variantId) return error('Không tìm thấy ID của biến thể!')
  editingVariant.value = { ...variant, _id: variantId }
  formData.value = {
    productId: selectedProductId.value,
    color: variant.color || '',
    size: variant.size || '',
    variantPrice: variant.variantPrice || 0,
    stockQuantity: variant.stockQuantity || 0,
    isActive: variant.isActive ?? true
  }
  imageFile.value = null
  imagePreview.value = variant.variantImageUrl || ''
  showAddModal.value = true
}

const toggleVariantStatus = async (variant) => {
  const variantId = variant._id || variant.id
  if (!variantId) return error('Không tìm thấy ID của biến thể!')
  const newStatus = !variant.isActive
  const action = newStatus ? 'kích hoạt' : 'ẩn'
  if (!confirm(`Bạn có chắc muốn ${action} biến thể này?`)) return
  try {
    await updateProductVariant(variantId, { isActive: newStatus })
    variant.isActive = newStatus
    success(`Đã ${action} biến thể thành công`)
  } catch (err) {
    console.error('Toggle status error:', err)
    error(`Lỗi khi ${action} biến thể: ` + (err.response?.data?.message || err.message))
  }
}

// XÓA BIẾN THỂ
const confirmDelete = async (variant) => {
  const variantId = variant._id || variant.id
  if (!confirm('Xóa biến thể này?\n\n• Ảnh sẽ bị xóa vĩnh viễn\n• Không thể hoàn tác\n\nBạn có chắc chắn?')) return
  try {
    await deleteProductVariant(variantId)
    success('Xóa biến thể thành công')
    await fetchProductVariants(selectedProductId.value)
  } catch (err) {
    console.error('Delete error:', err)
    error(err.response?.data?.message || 'Lỗi xóa biến thể')
  }
}

const saveVariant = async () => {
    saving.value = true;
    
    try {
        // Validate ảnh khi tạo mới
        if (!editingVariant.value && !imageFile.value) {
            throw new Error('Hình ảnh sản phẩm là bắt buộc')
        }

        // ✅ Simple validations
        if (formData.value.stockQuantity < 0) {
            error('Số lượng không được âm');
            return;
        }

        if (formData.value.variantPrice < 0) {
            error('Giá không được âm');
            return;
        }

        // Gửi API
        const form = new FormData()
        form.append('color', formData.value.color)
        form.append('size', formData.value.size)
        form.append('variantPrice', formData.value.variantPrice)
        form.append('stockQuantity', formData.value.stockQuantity)
        if (imageFile.value) form.append('variantImageUrl', imageFile.value)

        if (editingVariant.value) {
            await updateProductVariant(
                editingVariant.value._id || editingVariant.value.id, 
                form
            )
            success('Cập nhật biến thể thành công')
        } else {
            await createProductVariant(selectedProductId.value, form)
            success('Thêm biến thể thành công')
        }

        await fetchProductVariants(selectedProductId.value)
        closeModal()

    } catch(err) {
        console.error('Save error:', err)
        error(err.response?.data?.message || err.message)
    } finally {
        saving.value = false
    }
}


const closeModal = () => {
  showAddModal.value = false
  editingVariant.value = null
  imagePreview.value = ''
  imageFile.value = null
  formData.value = {
    productId: selectedProductId.value,
    color: '', size: '', variantPrice: 0, stockQuantity: 0, isActive: true
  }
}

// Init
onMounted(() => fetchProducts())
</script>

<style scoped>
.required::after { content: " *"; color: #ef4444; }
.table-container { overflow-x: auto; }
</style>