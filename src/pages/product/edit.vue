<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <template v-else-if="product">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
          <p class="text-gray-600">Cập nhật thông tin sản phẩm: {{ product.name }}</p>
        </div>
        <NuxtLink to="/product" class="btn btn-secondary">
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Quay lại
        </NuxtLink>
      </div>

      <form @submit.prevent="updateProduct" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Basic Info -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
              </div>
              <div class="card-body space-y-4">
                <div class="form-group">
                  <label class="form-label required">Tên sản phẩm</label>
                  <input v-model="form.name" type="text" class="form-input" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Mô tả sản phẩm</label>
                  <textarea v-model="form.description" rows="6" class="form-textarea"></textarea>
                </div>
              </div>
            </div>

            <!-- Main Image -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-semibold text-gray-900">Hình ảnh chính</h3>
              </div>
              <div class="card-body">
                <!-- Current Main Image -->
                <div v-if="product.imageUrl && !newMainImageSelected" class="mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Ảnh chính hiện tại:</p>
                  <div class="relative inline-block">
                    <img 
                      v-if="!mainImageError"
                      :src="product.imageUrl" 
                      alt="Main" 
                      class="w-full max-w-md h-64 object-cover rounded-lg border-2 border-primary-500" 
                      @error="mainImageError = true"
                    >
                    <div v-else class="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div class="text-center">
                        <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-red-500">Ảnh không tải được</p>
                      </div>
                    </div>
                    <div class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                      ẢNH CHÍNH
                    </div>
                  </div>
                  <button 
                    type="button" 
                    @click="showMainImageUpload" 
                    class="mt-3 px-4 py-2 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    Thay đổi ảnh chính
                  </button>
                </div>

                <!-- Upload New Main Image -->
                <div 
                  v-if="!product.imageUrl || newMainImageSelected" 
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
                  <p class="text-gray-600 mb-2">Kéo thả hoặc click để upload ảnh chính mới</p>
                  <p class="text-sm text-gray-500">PNG, JPG, WebP tối đa 10MB</p>
                  <input 
                    ref="mainFileInput" 
                    type="file" 
                    accept="image/*" 
                    @change="handleMainFileSelect" 
                    class="hidden"
                  >
                </div>

                <!-- Preview New Main Image -->
                <div v-if="previewMainImage" class="mt-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Ảnh chính mới:</p>
                  <div class="relative inline-block">
                    <img :src="previewMainImage" alt="New Main" class="w-full max-w-md h-64 object-cover rounded-lg border-2 border-primary-500">
                    <button 
                      type="button" 
                      @click="removeNewMainImage" 
                      class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                    <div class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                      ẢNH CHÍNH MỚI
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mt-2">{{ newMainFile?.name }}</p>
                </div>
              </div>
            </div>

            <!-- Additional Images Management -->
            <div class="card">
              <div class="card-header flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Hình ảnh bổ sung</h3>
                  <p class="text-xs text-gray-500 mt-1">
                    Hiện có: {{ existingImages.length }} ảnh | Tối đa: 10 ảnh (bao gồm ảnh chính)
                  </p>
                </div>
                <button 
                  type="button" 
                  @click="triggerAdditionalFileInput"
                  :disabled="existingImages.length + additionalFiles.length >= 9"
                  class="btn btn-sm btn-primary"
                >
                  <PhotoIcon class="h-4 w-4 mr-2" />
                  Thêm ảnh
                </button>
              </div>
              <div class="card-body">
                <!-- Existing Additional Images -->
                <div v-if="existingImages.length > 0" class="mb-6">
                  <p class="text-sm font-medium text-gray-700 mb-3">
                    Ảnh bổ sung hiện tại ({{ existingImages.length }})
                  </p>
                  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div 
                      v-for="(image, index) in existingImages" 
                      :key="'existing-' + index"
                      class="relative group"
                    >
                      <img 
                        v-if="!image.error"
                        :src="image.url" 
                        alt="Product" 
                        class="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                        @error="() => handleImageError(index)"
                      >
                      <div v-else class="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div class="text-center">
                          <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p class="text-xs text-red-500">Lỗi tải ảnh</p>
                        </div>
                      </div>
                      
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg"></div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-3">
                    💡 Lưu ý: Hiện tại chưa hỗ trợ xóa ảnh bổ sung. Vui lòng liên hệ developer để thêm tính năng này.
                  </p>
                </div>

                <!-- Upload New Additional Images -->
                <div>
                  <div 
                    v-if="additionalFiles.length === 0"
                    @click="triggerAdditionalFileInput"
                    @dragover.prevent="isDraggingAdditional = true" 
                    @dragleave.prevent="isDraggingAdditional = false" 
                    @drop.prevent="handleAdditionalDrop"
                    :class="[
                      'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                      isDraggingAdditional ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
                      existingImages.length + additionalFiles.length >= 9 ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                  >
                    <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-600 mb-2">Kéo thả hoặc click để thêm ảnh mới</p>
                    <p class="text-sm text-gray-500">PNG, JPG, WebP tối đa 10MB</p>
                    <p class="text-xs text-primary-600 mt-2">
                      Còn lại: {{ 9 - existingImages.length - additionalFiles.length }} ảnh
                    </p>
                  </div>

                  <!-- New Images Preview -->
                  <div v-if="additionalFiles.length > 0" class="space-y-3">
                    <p class="text-sm font-medium text-gray-700">
                      Ảnh mới sẽ thêm ({{ additionalFiles.length }})
                    </p>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div 
                        v-for="(preview, index) in previewAdditionalImages" 
                        :key="'new-' + index"
                        class="relative group"
                      >
                        <img 
                          :src="preview.url" 
                          alt="New" 
                          class="w-full h-40 object-cover rounded-lg border-2 border-primary-200"
                        >
                        <button 
                          type="button"
                          @click="removeAdditionalImage(index)"
                          class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon class="h-5 w-5" />
                        </button>
                        <div class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          MỚI
                        </div>
                        <div class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {{ formatFileSize(preview.size) }}
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      @click="triggerAdditionalFileInput"
                      :disabled="existingImages.length + additionalFiles.length >= 9"
                      class="btn btn-secondary w-full"
                    >
                      <PhotoIcon class="h-4 w-4 mr-2" />
                      Thêm ảnh khác
                    </button>
                  </div>

                  <input 
                    ref="additionalFileInput" 
                    type="file" 
                    accept="image/*"
                    multiple
                    @change="handleAdditionalFileSelect" 
                    class="hidden"
                  >
                </div>
              </div>
            </div>

            <!-- Variants -->
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
                      @keypress.enter.prevent="addSize"
                    >
                    <button type="button" @click="addSize" class="btn btn-secondary">
                      Thêm
                    </button>
                  </div>
                  
                  <div v-if="form.sizes.length > 0" class="flex flex-wrap gap-2 mt-3">
                    <span 
                      v-for="(size, index) in form.sizes" 
                      :key="index"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {{ size }}
                      <button type="button" @click="removeSize(index)" class="ml-2">
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
                      @keypress.enter.prevent="addColor"
                    >
                    <button type="button" @click="addColor" class="btn btn-secondary">
                      Thêm
                    </button>
                  </div>
                  
                  <div v-if="form.colors.length > 0" class="flex flex-wrap gap-2 mt-3">
                    <span 
                      v-for="(color, index) in form.colors" 
                      :key="index"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {{ color }}
                      <button type="button" @click="removeColor(index)" class="ml-2">
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
                  <label class="form-label">Danh mục</label>
                  <select v-model="selectedCategoryId" @change="loadSubcategories" class="form-select">
                    <option value="">Chọn danh mục</option>
                    <option v-for="cat in categories" :key="cat.id || cat._id" :value="cat.id || cat._id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Danh mục con</label>
                  <select v-model="form.subcategoryId" class="form-select" :disabled="!selectedCategoryId">
                    <option value="">Chọn danh mục con</option>
                    <option v-for="sub in filteredSubcategories" :key="sub.id || sub._id" :value="sub.id || sub._id">
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
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label required">Giá bán (VNĐ)</label>
                  <input v-model.number="form.price" type="number" class="form-input" required>
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
                  <label class="form-label required">Mã sản phẩm (SKU)</label>
                  <input v-model="form.productCode" type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label required">Số lượng tồn kho</label>
                  <input v-model.number="form.stockQuantity" type="number" class="form-input" required>
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
                  <input id="isActive" v-model="form.isActive" type="checkbox" class="h-4 w-4 text-primary-600 rounded">
                  <label for="isActive" class="ml-2 text-sm text-gray-700">
                    Kích hoạt sản phẩm
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <NuxtLink to="/product" class="btn btn-secondary">Hủy</NuxtLink>
          <button type="submit" :disabled="saving" class="btn btn-primary">
            <CheckIcon v-if="!saving" class="h-4 w-4 mr-2" />
            <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ saving ? 'Đang cập nhật...' : 'Cập nhật sản phẩm' }}
          </button>
        </div>
      </form>
    </template>

    <!-- Error -->
    <div v-else class="text-center py-12">
      <p class="text-red-600">Không tìm thấy sản phẩm!</p>
      <NuxtLink to="/product" class="btn btn-primary mt-4">Quay lại danh sách</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#imports'
import { ArrowLeftIcon, PhotoIcon, XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useNotification } from '../../composables/useNotfication'
import useProduct from '~/composables/useProduct'
import { useCategory } from '~/composables/useCategory'
import { useSubCategory } from '~/composables/useSubCategory'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { notify } = useNotification()
const success = (msg) => notify(msg, 'success', 3000)
const error = (msg) => notify(msg, 'error', 4000)

const { getProducts, updateProduct: updateProductApi, uploadProductImages } = useProduct()
const { getCategories } = useCategory()
const { getSubCategories } = useSubCategory()

const loading = ref(true)
const saving = ref(false)
const isDraggingMain = ref(false)
const isDraggingAdditional = ref(false)
const mainFileInput = ref(null)
const additionalFileInput = ref(null)
const newMainFile = ref(null)
const previewMainImage = ref(null)
const additionalFiles = ref([])
const previewAdditionalImages = ref([])
const selectedCategoryId = ref('')
const newMainImageSelected = ref(false)
const mainImageError = ref(false)
const sizeInput = ref('')
const colorInput = ref('')

const product = ref(null)
const categories = ref([])
const subcategories = ref([])
const filteredSubcategories = ref([])
const existingImages = ref([])

const form = ref({
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

// Load categories/subcategories
const fetchCategoriesAndSubs = async () => {
  try {
    const [cats, subs] = await Promise.all([
      getCategories({ limit: 1000 }),
      getSubCategories({ limit: 1000 })
    ])
    categories.value = cats.data || cats || []
    subcategories.value = subs.data || subs || []
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

const loadSubcategories = () => {
  if (!selectedCategoryId.value) {
    filteredSubcategories.value = []
    return
  }
  filteredSubcategories.value = subcategories.value.filter(
    sub => String(sub.categoryId || sub.category) === String(selectedCategoryId.value)
  )
}

// Main image handling
const showMainImageUpload = () => {
  newMainImageSelected.value = true
}

const triggerMainFileInput = () => mainFileInput.value?.click()

const handleMainFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) validateAndSetMainFile(file)
}

const handleMainDrop = (e) => {
  isDraggingMain.value = false
  const file = e.dataTransfer.files[0]
  if (file) validateAndSetMainFile(file)
}

const validateAndSetMainFile = (file) => {
  if (!file.type.startsWith('image/')) {
    error('Vui lòng chọn file ảnh!')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error('File ảnh không được vượt quá 10MB!')
    return
  }

  newMainFile.value = file
  newMainImageSelected.value = true
  
  const reader = new FileReader()
  reader.onload = e => {
    previewMainImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeNewMainImage = () => {
  newMainFile.value = null
  previewMainImage.value = null
  newMainImageSelected.value = false
  if (mainFileInput.value) mainFileInput.value.value = ''
}

// Additional images handling
const triggerAdditionalFileInput = () => {
  const remaining = 9 - existingImages.value.length - additionalFiles.value.length
  if (remaining <= 0) {
    error('Đã đạt giới hạn 9 ảnh bổ sung!')
    return
  }
  additionalFileInput.value?.click()
}

const handleAdditionalFileSelect = (e) => {
  const files = Array.from(e.target.files)
  if (files.length > 0) addMultipleFiles(files)
}

const handleAdditionalDrop = (e) => {
  isDraggingAdditional.value = false
  const files = Array.from(e.dataTransfer.files)
  if (files.length > 0) addMultipleFiles(files)
}

const addMultipleFiles = (files) => {
  const maxTotal = 9
  const currentTotal = existingImages.value.length + additionalFiles.value.length
  const remainingSlots = maxTotal - currentTotal

  if (remainingSlots <= 0) {
    error('Đã đạt giới hạn!')
    return
  }

  const filesToAdd = files.slice(0, remainingSlots)
  
  for (const file of filesToAdd) {
    if (!file.type.startsWith('image/')) {
      error(`File ${file.name} không phải là ảnh!`)
      continue
    }

    if (file.size > 10 * 1024 * 1024) {
      error(`File ${file.name} vượt quá 10MB!`)
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
    error(`Chỉ thêm được ${filesToAdd.length} ảnh do giới hạn!`)
  }
}

const removeAdditionalImage = (index) => {
  additionalFiles.value.splice(index, 1)
  previewAdditionalImages.value.splice(index, 1)
  if (additionalFileInput.value) additionalFileInput.value.value = ''
}

const handleImageError = (index) => {
  existingImages.value[index].error = true
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Size & Color
const addSize = () => {
  const size = sizeInput.value.trim()
  if (size && !form.value.sizes.includes(size)) {
    form.value.sizes.push(size)
    sizeInput.value = ''
  }
}

const removeSize = (index) => {
  form.value.sizes.splice(index, 1)
}

const addColor = () => {
  const color = colorInput.value.trim()
  if (color && !form.value.colors.includes(color)) {
    form.value.colors.push(color)
    colorInput.value = ''
  }
}

const removeColor = (index) => {
  form.value.colors.splice(index, 1)
}

// Fetch product
const fetchProduct = async () => {
  const id = route.query.id
  if (!id) {
    error('Không tìm thấy ID sản phẩm!')
    loading.value = false
    return
  }

  try {
    const allProductsRes = await getProducts({ limit: 1000, page: 1 })
    const allProducts = allProductsRes.data?.data || allProductsRes.data || []

    const found = allProducts.find(p => String(p._id || p.id) === String(id))
    if (!found) {
      error('Sản phẩm không tồn tại!')
      product.value = null
      loading.value = false
      return
    }

    product.value = found

    form.value = {
      name: product.value.name || '',
      description: product.value.description || '',
      price: product.value.price || null,
      stockQuantity: product.value.stockQuantity || null,
      productCode: product.value.productCode || '',
      sizes: product.value.sizes || [],
      colors: product.value.colors || [],
      subcategoryId: product.value.subcategoryId || '',
      isActive: product.value.isActive ?? true
    }

    // Load existing additional images (productImages array from backend)
    if (product.value.productImages && product.value.productImages.length > 0) {
      existingImages.value = product.value.productImages.map(img => ({
        url: img.imageUrl,
        error: false
      }))
    }

    // Load category
    const subcategory = subcategories.value.find(sub => 
      String(sub._id || sub.id) === String(form.value.subcategoryId)
    )
    if (subcategory) {
      selectedCategoryId.value = String(subcategory.categoryId || subcategory.category)
      loadSubcategories()
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error('Lấy sản phẩm thất bại!')
  } finally {
    loading.value = false
  }
}

// Update product
const updateProduct = async () => {
  if (!form.value.name?.trim()) return error('Vui lòng nhập tên sản phẩm!')
  if (!form.value.price || form.value.price <= 0) return error('Vui lòng nhập giá bán hợp lệ!')
  if (!form.value.productCode?.trim()) return error('Vui lòng nhập mã sản phẩm!')
  if (form.value.stockQuantity === null || form.value.stockQuantity < 0) return error('Số lượng tồn kho không hợp lệ!')

  saving.value = true
  try {
    const productId = product.value._id || product.value.id
    const payload = { ...form.value }
    
    // Step 1: Update product info (and main image if changed)
    if (newMainFile.value) {
      payload.file = newMainFile.value
      console.log('📷 Updating with new main image:', newMainFile.value.name)
    } else {
      console.log('📷 Keeping existing main image')
    }

    console.log('📤 Step 1: Updating product info...')
    await updateProductApi(productId, payload)
    console.log('✅ Product updated successfully')

    // Step 2: Upload additional images if any
    if (additionalFiles.value.length > 0) {
      console.log(`📤 Step 2: Uploading ${additionalFiles.value.length} additional images...`)
      try {
        await uploadProductImages(productId, additionalFiles.value)
        console.log('✅ Additional images uploaded successfully')
      } catch (imgError) {
        console.error('⚠️ Warning: Failed to upload additional images:', imgError)
        error('Cập nhật sản phẩm thành công nhưng một số ảnh bổ sung tải lên thất bại!')
        setTimeout(() => navigateTo('/product'), 1500)
        return
      }
    }

    success('Cập nhật sản phẩm thành công!')
    setTimeout(() => navigateTo('/product'), 500)
  } catch (err) {
    console.error('Update error:', err)
    error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!')
  } finally {
    saving.value = false
  }
}

// Init
onMounted(async () => {
  await fetchCategoriesAndSubs()
  await fetchProduct()
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

.btn-sm {
  @apply px-3 py-1.5 text-sm;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100;
}
</style>