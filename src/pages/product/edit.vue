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
                  <input v-model="form.name" type="text" class="form-input" placeholder="Nhập tên sản phẩm" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Mô tả sản phẩm</label>
                  <textarea v-model="form.description" rows="6" class="form-textarea" placeholder="Mô tả chi tiết về sản phẩm (tối thiểu 10 ký tự)"></textarea>
                  <p class="text-xs text-gray-500 mt-1">Tối thiểu 10 ký tự</p>
                </div>
              </div>
            </div>

            <!-- Image Upload -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-semibold text-gray-900">Hình ảnh sản phẩm</h3>
              </div>
              <div class="card-body">
                <!-- Current Image -->
                <div v-if="product.imageUrl && !newImageSelected" class="mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Ảnh hiện tại:</p>
                  <div class="relative inline-block">
                    <img :src="product.imageUrl" alt="Current" class="w-full max-w-md h-64 object-cover rounded-lg" @error="currentImageError = true">
                    <div v-if="currentImageError" class="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div class="text-center">
                        <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-gray-500">Ảnh không tải được</p>
                      </div>
                    </div>
                  </div>
                  <button type="button" @click="triggerFileInput" class="mt-3 text-sm text-primary-600 hover:text-primary-700">Thay đổi ảnh</button>
                </div>

                <!-- Upload New Image -->
                <div v-if="!product.imageUrl || newImageSelected" @click="triggerFileInput"
                     @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
                     :class="['border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer', isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400']">
                  <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p class="text-gray-600 mb-2">Kéo thả hoặc click để upload ảnh mới</p>
                  <p class="text-sm text-gray-500">PNG, JPG, WebP tối đa 10MB</p>
                  <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden">
                </div>

                <!-- Preview -->
                <div v-if="previewImage" class="mt-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Ảnh mới:</p>
                  <div class="relative inline-block">
                    <img :src="previewImage" alt="Preview" class="w-full max-w-md h-64 object-cover rounded-lg">
                    <button type="button" @click="removeNewImage" class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg">
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                  <p class="text-sm text-gray-600 mt-2">{{ selectedFile?.name }}</p>
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
                    <option v-for="cat in categories" :key="cat.id || cat._id" :value="cat.id || cat._id">{{ cat.name }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Danh mục con</label>
                  <select v-model="form.subcategoryId" class="form-select" :disabled="!selectedCategoryId">
                    <option value="">Chọn danh mục con</option>
                    <option v-for="sub in filteredSubcategories" :key="sub.id || sub._id" :value="sub.id || sub._id">{{ sub.name }}</option>
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
                  <input v-model.number="form.price" type="number" class="form-input" placeholder="0" min="0" step="1000" required>
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
                  <input v-model="form.productCode" type="text" class="form-input" placeholder="VD: SP001" required>
                  <p class="text-xs text-gray-500 mt-1">Mã duy nhất cho sản phẩm</p>
                </div>
                <div class="form-group">
                  <label class="form-label required">Số lượng tồn kho</label>
                  <input v-model.number="form.stockQuantity" type="number" class="form-input" placeholder="0" min="0" required>
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
                  <label for="isActive" class="ml-2 text-sm text-gray-700">Kích hoạt sản phẩm (hiển thị trên website)</label>
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
import { useNotification } from '../../composables/useNotfication' // ✅ chắc chắn đúng tên
import useProduct from '~/composables/useProduct'
import { useCategory } from '~/composables/useCategory'
import { useSubCategory } from '~/composables/useSubCategory'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { notify} = useNotification() //
const success = (msg, timeout = 3000) => notify(msg, 'success', timeout)
  const error = (msg, timeout = 3000) => notify(msg, 'error', timeout)
const { getProducts, updateProduct: updateProductApi } = useProduct()
const { getCategories } = useCategory()
const { getSubCategories } = useSubCategory()

const loading = ref(true)
const saving = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)
const selectedFile = ref(null)
const previewImage = ref(null)
const selectedCategoryId = ref('')

const product = ref(null)
const categories = ref([])
const subcategories = ref([])
const filteredSubcategories = ref([])

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

// Filter subcategories by selected category
const loadSubcategories = () => {
  if (!selectedCategoryId.value) {
    filteredSubcategories.value = []
    return
  }
  filteredSubcategories.value = subcategories.value.filter(
    sub => String(sub.categoryId || sub.category) === String(selectedCategoryId.value)
  )
}

// File handling
const triggerFileInput = () => fileInput.value?.click()

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) validateAndSetFile(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) validateAndSetFile(file)
}

const validateAndSetFile = (file) => {
  if (!file.type.startsWith('image/')) {
    error('Vui lòng chọn file ảnh!')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error('File ảnh không được vượt quá 10MB!')
    return
  }

  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = e => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeNewImage = () => {
  selectedFile.value = null
  previewImage.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Fetch product
const fetchProduct = async () => {
  const id = route.query.id
  if (!id) {
    console.error('Không tìm thấy ID sản phẩm!')
    loading.value = false
    return
  }

  try {
    const allProductsRes = await getProducts({ limit: 1000, page: 1 })
    const allProducts = allProductsRes.data?.data || allProductsRes.data || []

    console.log('All products:', allProducts)
    console.log('Looking for ID:', id)

    const found = allProducts.find(p => String(p._id || p.id) === String(id))
    if (!found) {
      console.warn(`Sản phẩm với ID ${id} không tồn tại!`)
      product.value = null
      loading.value = false
      return
    }

    product.value = found

    // Populate form
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

    // Load selected category
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
  if (form.value.stockQuantity === null || form.value.stockQuantity < 0) return error('Vui lòng nhập số lượng tồn kho hợp lệ!')

  saving.value = true
  try {
    const payload = { ...form.value }
    if (selectedFile.value) payload.file = selectedFile.value

    const id = product.value._id || product.value.id
    await updateProductApi(id, payload)

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
</style>