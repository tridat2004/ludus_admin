<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
        <p class="text-gray-600">Tạo sản phẩm mới cho cửa hàng của bạn</p>
      </div>
      
      <NuxtLink to="/product" class="btn btn-secondary">
        <ArrowLeftIcon class="h-4 w-4 mr-2" />
        Quay lại
      </NuxtLink>
    </div>

    <form @submit.prevent="saveProduct" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="form-group">
                <label class="form-label required">Tên sản phẩm</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-input" 
                  placeholder="Nhập tên sản phẩm"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Mô tả sản phẩm</label>
                <textarea 
                  v-model="formData.description" 
                  rows="6" 
                  class="form-textarea"
                  placeholder="Mô tả chi tiết về sản phẩm (tối thiểu 10 ký tự)"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">Tối thiểu 10 ký tự</p>
              </div>
            </div>
          </div>

          <!-- Main Product Image (Bắt buộc) -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Hình ảnh chính</h3>
              <p class="text-sm text-red-600 font-medium">Bắt buộc *</p>
            </div>
            <div class="card-body">
              <div 
                @click="triggerMainFileInput"
                @dragover.prevent="isDraggingMain = true"
                @dragleave.prevent="isDraggingMain = false"
                @drop.prevent="handleMainDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                  isDraggingMain ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                ]"
              >
                <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">Kéo thả hoặc click để upload ảnh chính</p>
                <p class="text-sm text-gray-500">PNG, JPG, WebP tối đa 10MB</p>
                <input 
                  ref="mainFileInput"
                  type="file" 
                  accept="image/*" 
                  @change="handleMainFileSelect"
                  class="hidden"
                >
              </div>
              
              <!-- Preview Main Image -->
              <div v-if="previewMainImage" class="mt-4">
                <div class="relative inline-block">
                  <img 
                    :src="previewMainImage" 
                    alt="Preview" 
                    class="w-full max-w-md h-64 object-cover rounded-lg border-2 border-primary-500"
                  >
                  <button 
                    type="button"
                    @click="removeMainImage"
                    class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                  <div class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    ẢNH CHÍNH
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-2">{{ mainFile?.name }}</p>
                <p class="text-xs text-gray-500">Kích thước: {{ formatFileSize(mainFile?.size) }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Images (Tùy chọn, tối đa 9 ảnh) -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Hình ảnh bổ sung</h3>
              <p class="text-sm text-gray-600">Tùy chọn - Tối đa 9 ảnh (sẽ upload sau khi tạo sản phẩm)</p>
            </div>
            <div class="card-body">
              <div 
                @click="triggerAdditionalFileInput"
                @dragover.prevent="isDraggingAdditional = true"
                @dragleave.prevent="isDraggingAdditional = false"
                @drop.prevent="handleAdditionalDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                  isDraggingAdditional ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                ]"
              >
                <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">Kéo thả hoặc click để upload nhiều ảnh</p>
                <p class="text-sm text-gray-500">PNG, JPG, WebP tối đa 10MB mỗi ảnh</p>
                <p class="text-xs text-primary-600 mt-2">Đã chọn: {{ additionalFiles.length }}/9 ảnh</p>
                <input 
                  ref="additionalFileInput"
                  type="file" 
                  accept="image/*" 
                  multiple
                  @change="handleAdditionalFileSelect"
                  class="hidden"
                >
              </div>
              
              <!-- Preview Additional Images Grid -->
              <div v-if="previewAdditionalImages.length > 0" class="mt-6">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div 
                    v-for="(preview, index) in previewAdditionalImages" 
                    :key="index"
                    class="relative group"
                  >
                    <img 
                      :src="preview.url" 
                      :alt="`Preview ${index + 1}`" 
                      class="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    >
                    <button 
                      type="button"
                      @click="removeAdditionalImage(index)"
                      class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                    <div class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {{ preview.name }}
                    </div>
                    <div class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {{ formatFileSize(preview.size) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Variants (Sizes & Colors) -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Biến thể sản phẩm</h3>
            </div>
            <div class="card-body space-y-4">
              <!-- Sizes -->
              <div class="form-group">
                <label class="form-label">Kích thước (Size)</label>
                <div class="flex items-center space-x-2">
                  <input 
                    v-model="sizeInput"
                    type="text" 
                    class="form-input flex-1" 
                    placeholder="Nhập size (VD: S, M, L)"
                    @keypress.enter.prevent="addSize"
                  >
                  <button 
                    type="button"
                    @click="addSize"
                    class="btn btn-secondary"
                  >
                    Thêm
                  </button>
                </div>
                
                <div v-if="formData.sizes.length > 0" class="flex flex-wrap gap-2 mt-3">
                  <span 
                    v-for="(size, index) in formData.sizes" 
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {{ size }}
                    <button 
                      type="button"
                      @click="removeSize(index)"
                      class="ml-2 hover:text-blue-900"
                    >
                      <XMarkIcon class="h-4 w-4" />
                    </button>
                  </span>
                </div>
              </div>

              <!-- Colors -->
              <div class="form-group">
                <label class="form-label">Màu sắc</label>
                <div class="flex items-center space-x-2">
                  <input 
                    v-model="colorInput"
                    type="text" 
                    class="form-input flex-1" 
                    placeholder="Nhập màu (VD: Đen, Trắng, Đỏ)"
                    @keypress.enter.prevent="addColor"
                  >
                  <button 
                    type="button"
                    @click="addColor"
                    class="btn btn-secondary"
                  >
                    Thêm
                  </button>
                </div>
                
                <div v-if="formData.colors.length > 0" class="flex flex-wrap gap-2 mt-3">
                  <span 
                    v-for="(color, index) in formData.colors" 
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {{ color }}
                    <button 
                      type="button"
                      @click="removeColor(index)"
                      class="ml-2 hover:text-purple-900"
                    >
                      <XMarkIcon class="h-4 w-4" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Category -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Phân loại</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="form-group">
                <label class="form-label required">Danh mục</label>
                <select 
                  v-model="selectedCategoryId" 
                  @change="loadSubcategories"
                  class="form-select" 
                  required
                >
                  <option value="">Chọn danh mục</option>
                  <option 
                    v-for="category in categories" 
                    :key="category.id || category._id" 
                    :value="category.id || category._id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Danh mục con</label>
                <select 
                  v-model="formData.subcategoryId" 
                  class="form-select" 
                  :disabled="!selectedCategoryId"
                  required
                >
                  <option value="">Chọn danh mục con</option>
                  <option 
                    v-for="sub in filteredSubcategories" 
                    :key="sub.id || sub._id" 
                    :value="sub.id || sub._id"
                  >
                    {{ sub.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Giá bán</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="form-group">
                <label class="form-label required">Giá bán (VNĐ)</label>
                <input 
                  v-model.number="formData.price" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                >
              </div>
            </div>
          </div>

          <!-- Inventory -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Kho hàng</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="form-group">
                <label class="form-label">Mã sản phẩm (SKU)</label>
                <div class="flex items-center space-x-2">
                  <input 
                    v-model="formData.productCode" 
                    type="text" 
                    class="form-input flex-1" 
                    placeholder="Tự động tạo"
                    :disabled="autoGenerateSKU"
                  >
                  <button 
                    type="button"
                    @click="generateSKU"
                    class="btn btn-secondary whitespace-nowrap"
                  >
                    Tạo mã
                  </button>
                </div>
                <div class="flex items-center mt-2">
                  <input 
                    id="autoSKU"
                    v-model="autoGenerateSKU" 
                    type="checkbox" 
                    class="h-4 w-4 text-primary-600 rounded"
                  >
                  <label for="autoSKU" class="ml-2 text-xs text-gray-600">
                    Tự động tạo mã khi lưu
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label required">Số lượng tồn kho</label>
                <input 
                  v-model.number="formData.stockQuantity" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                  required
                >
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Trạng thái</h3>
            </div>
            <div class="card-body">
              <div class="flex items-center">
                <input 
                  id="isActive" 
                  v-model="formData.isActive" 
                  type="checkbox" 
                  class="h-4 w-4 text-primary-600 rounded"
                >
                <label for="isActive" class="ml-2 text-sm text-gray-700">
                  Kích hoạt sản phẩm (hiển thị trên website)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <NuxtLink to="/product" class="btn btn-secondary">
          Hủy
        </NuxtLink>
        <button 
          type="submit" 
          :disabled="saving"
          class="btn btn-primary"
        >
          <CheckIcon v-if="!saving" class="h-4 w-4 mr-2" />
          <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ saving ? 'Đang tạo...' : 'Tạo sản phẩm' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { validateProduct } from '~/utils/validate'
definePageMeta({
  layout: 'default'
})

const { notify } = useNotification()
const showSuccess = (msg) => notify(msg, 'success', 3000)
const showError = (msg) => notify(msg, 'error', 4000)

const { createProduct, uploadProductImages } = useProduct()
const { getCategories } = useCategory()
const { getSubCategories } = useSubCategory()

// State
const validationErrors = ref([])
const saving = ref(false)
const isDraggingMain = ref(false)
const isDraggingAdditional = ref(false)
const mainFileInput = ref(null)
const additionalFileInput = ref(null)
const mainFile = ref(null)
const previewMainImage = ref(null)
const additionalFiles = ref([])
const previewAdditionalImages = ref([])
const sizeInput = ref('')
const colorInput = ref('')
const selectedCategoryId = ref('')
const autoGenerateSKU = ref(true)

const categories = ref([])
const subcategories = ref([])
const filteredSubcategories = ref([])

const formData = ref({
  name: '',
  description: '',
  price: null,
  stockQuantity: null,
  productCode: '',
  sizes: [],
  colors: [],
  subcategoryId: '',
  isActive: true
})

// Fetch data
const fetchCategories = async () => {
  try {
    const response = await getCategories({ limit: 1000 })
    categories.value = response.data || response || []
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const fetchSubcategories = async () => {
  try {
    const response = await getSubCategories({ limit: 1000 })
    subcategories.value = response.data || response || []
  } catch (err) {
    console.error('Error fetching subcategories:', err)
  }
}

const loadSubcategories = () => {
  if (!selectedCategoryId.value) {
    filteredSubcategories.value = []
    formData.value.subcategoryId = ''
    return
  }

  filteredSubcategories.value = subcategories.value.filter(sub => {
    return (
      sub.categoryId === selectedCategoryId.value ||
      sub.category === selectedCategoryId.value ||
      sub.category?._id === selectedCategoryId.value ||
      sub.category?.id === selectedCategoryId.value ||
      String(sub.categoryId) === String(selectedCategoryId.value) ||
      String(sub.category) === String(selectedCategoryId.value)
    )
  })

  formData.value.subcategoryId = ''
}

const generateSKU = () => {
  const prefix = 'SKU'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  formData.value.productCode = `${prefix}${timestamp}${random}`
}

// Main Image handling
const triggerMainFileInput = () => {
  mainFileInput.value?.click()
}

const handleMainFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetMainFile(file)
  }
}

const handleMainDrop = (event) => {
  isDraggingMain.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetMainFile(file)
  }
}

const validateAndSetMainFile = (file) => {
  if (!file.type.startsWith('image/')) {
    showError('Vui lòng chọn file ảnh!')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    showError('File ảnh không được vượt quá 10MB!')
    return
  }

  mainFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    previewMainImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeMainImage = () => {
  mainFile.value = null
  previewMainImage.value = null
  if (mainFileInput.value) {
    mainFileInput.value.value = ''
  }
}

// Additional Images handling
const triggerAdditionalFileInput = () => {
  if (additionalFiles.value.length >= 9) {
    showError('Đã đạt giới hạn 9 ảnh!')
    return
  }
  additionalFileInput.value?.click()
}

const handleAdditionalFileSelect = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    addMultipleFiles(files)
  }
}

const handleAdditionalDrop = (event) => {
  isDraggingAdditional.value = false
  const files = Array.from(event.dataTransfer.files)
  if (files.length > 0) {
    addMultipleFiles(files)
  }
}

const addMultipleFiles = (files) => {
  const maxFiles = 9
  const remainingSlots = maxFiles - additionalFiles.value.length

  if (remainingSlots <= 0) {
    showError('Đã đạt giới hạn 9 ảnh!')
    return
  }

  const filesToAdd = files.slice(0, remainingSlots)
  
  for (const file of filesToAdd) {
    if (!file.type.startsWith('image/')) {
      showError(`File ${file.name} không phải là ảnh!`)
      continue
    }

    if (file.size > 10 * 1024 * 1024) {
      showError(`File ${file.name} vượt quá 10MB!`)
      continue
    }

    additionalFiles.value.push(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAdditionalImages.value.push({
        url: e.target.result,
        name: file.name,
        size: file.size
      })
    }
    reader.readAsDataURL(file)
  }

  if (filesToAdd.length < files.length) {
    showError(`Chỉ thêm được ${filesToAdd.length} ảnh do giới hạn 9 ảnh!`)
  }
}

const removeAdditionalImage = (index) => {
  additionalFiles.value.splice(index, 1)
  previewAdditionalImages.value.splice(index, 1)
  if (additionalFileInput.value) {
    additionalFileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Size & Color management
const addSize = () => {
  const size = sizeInput.value.trim()
  if (size && !formData.value.sizes.includes(size)) {
    formData.value.sizes.push(size)
    sizeInput.value = ''
  }
}

const removeSize = (index) => {
  formData.value.sizes.splice(index, 1)
}

const addColor = () => {
  const color = colorInput.value.trim()
  if (color && !formData.value.colors.includes(color)) {
    formData.value.colors.push(color)
    colorInput.value = ''
  }
}

const removeColor = (index) => {
  formData.value.colors.splice(index, 1)
}

// Submit
const saveProduct = async () => {
  // Validation
  if (!formData.value.name || formData.value.name.length < 2) {
    showError('Tên sản phẩm phải lớn hơn 2 ký tự!')
    return
  }

  if (formData.value.description && formData.value.description.length < 10) {
    showError('Mô tả phải lớn hơn 10 ký tự!')
    return
  }

  if (!formData.value.price || isNaN(formData.value.price) || formData.value.price <= 0) {
    showError('Giá sản phẩm phải là số và lớn hơn 0!')
    return
  }

  if (formData.value.stockQuantity === null || isNaN(formData.value.stockQuantity) || formData.value.stockQuantity < 0) {
    showError('Số lượng tồn kho phải là số nguyên >= 0!')
    return
  }

  if (!formData.value.subcategoryId) {
    showError('Vui lòng chọn danh mục con!')
    return
  }

  if (!mainFile.value) {
    showError('Vui lòng chọn hình ảnh chính cho sản phẩm!')
    return
  }

  if (!formData.value.sizes || !formData.value.sizes[0] || !formData.value.sizes[0].trim()) {
    showError('Vui lòng nhập ít nhất 1 kích thước!')
    return
  }

  if (!formData.value.colors || !formData.value.colors[0] || !formData.value.colors[0].trim()) {
    showError('Vui lòng nhập ít nhất 1 màu sắc!')
    return
  }

  // Auto generate SKU if enabled
  if (autoGenerateSKU.value && !formData.value.productCode) {
    generateSKU()
  }

  if (!formData.value.productCode || formData.value.productCode.length < 2) {
    showError('Mã sản phẩm phải lớn hơn 2 ký tự!')
    return
  }

  if (!/^[A-Za-z0-9_-]+$/.test(formData.value.productCode)) {
    showError('Mã sản phẩm chỉ được chứa chữ, số, gạch ngang hoặc gạch dưới!')
    return
  }

  // Optional: check file type
  const validImageTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (mainFile.value && !validImageTypes.includes(mainFile.value.type)) {
    showError('Ảnh chính phải là file JPG, PNG hoặc WEBP!')
    return
  }

  // Prepare data
  formData.value.name = formData.value.name.trim()
  formData.value.description = formData.value.description?.trim() || ''
  formData.value.productCode = formData.value.productCode.trim()

  const payload = {
    name: formData.value.name,
    description: formData.value.description,
    price: formData.value.price,
    stockQuantity: formData.value.stockQuantity,
    productCode: formData.value.productCode,
    isActive: formData.value.isActive,
    sizes: formData.value.sizes[0]?.split(',').map(s => s.trim()).filter(Boolean) || [],
    colors: formData.value.colors[0]?.split(',').map(c => c.trim()).filter(Boolean) || [],
    file: mainFile.value
  }

  saving.value = true
  try {
    const createdProduct = await createProduct(formData.value.subcategoryId, payload)
    const productId = createdProduct._id || createdProduct.id || createdProduct.data?._id || createdProduct.data?.id

    if (!productId) throw new Error('Không lấy được ID sản phẩm sau khi tạo!')

    if (additionalFiles.value.length > 0) {
      await uploadProductImages(productId, additionalFiles.value)
    }

    showSuccess('Tạo sản phẩm thành công!')
    navigateTo('/product')
  } catch (err) {
    console.error('❌ Error creating product:', err)
    showError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!')
  } finally {
    saving.value = false
  }
}

// Init
onMounted(() => {
  fetchCategories()
  fetchSubcategories()
})
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
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
</style>