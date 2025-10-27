<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
        <p class="text-gray-600">Tạo sản phẩm mới cho cửa hàng của bạn</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <NuxtLink to="/products" class="btn btn-secondary">
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Quay lại
        </NuxtLink>
      </div>
    </div>

    <form @submit.prevent="saveProduct" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  v-model="product.name" 
                  type="text" 
                  class="form-input" 
                  placeholder="Nhập tên sản phẩm"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Mô tả ngắn</label>
                <textarea 
                  v-model="product.shortDescription" 
                  rows="3" 
                  class="form-textarea"
                  placeholder="Mô tả ngắn về sản phẩm"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">Mô tả chi tiết</label>
                <textarea 
                  v-model="product.description" 
                  rows="6" 
                  class="form-textarea"
                  placeholder="Mô tả chi tiết về sản phẩm"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Product Images -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Hình ảnh sản phẩm</h3>
            </div>
            <div class="card-body">
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">Kéo thả hoặc click để upload ảnh</p>
                <p class="text-sm text-gray-500">PNG, JPG, WebP up to 10MB</p>
                <input type="file" multiple accept="image/*" class="hidden">
              </div>
              
              <!-- Preview Images -->
              <div v-if="product.images.length > 0" class="grid grid-cols-4 gap-4 mt-4">
                <div v-for="(image, index) in product.images" :key="index" class="relative">
                  <img :src="image" :alt="`Product ${index + 1}`" class="w-full h-24 object-cover rounded-lg">
                  <button 
                    type="button"
                    @click="removeImage(index)"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- SEO -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">SEO</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="form-group">
                <label class="form-label">URL thân thiện (slug)</label>
                <input 
                  v-model="product.slug" 
                  type="text" 
                  class="form-input" 
                  placeholder="san-pham-moi"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Meta Title</label>
                <input 
                  v-model="product.metaTitle" 
                  type="text" 
                  class="form-input"
                  placeholder="Tiêu đề cho SEO"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Meta Description</label>
                <textarea 
                  v-model="product.metaDescription" 
                  rows="3" 
                  class="form-textarea"
                  placeholder="Mô tả cho SEO"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status & Visibility -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Trạng thái</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select v-model="product.status" class="form-select">
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngưng bán</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Danh mục</label>
                <select v-model="product.categoryId" class="form-select" required>
                  <option value="">Chọn danh mục</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Thương hiệu</label>
                <input 
                  v-model="product.brand" 
                  type="text" 
                  class="form-input" 
                  placeholder="Tên thương hiệu"
                >
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
                <label class="form-label required">Giá bán</label>
                <input 
                  v-model="product.price" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Giá so sánh</label>
                <input 
                  v-model="product.comparePrice" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                >
                <p class="text-xs text-gray-500 mt-1">Giá gốc để hiện giảm giá</p>
              </div>
              
              <div class="form-group">
                <label class="form-label">Giá cost</label>
                <input 
                  v-model="product.costPrice" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                >
                <p class="text-xs text-gray-500 mt-1">Giá nhập hàng</p>
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
                <label class="form-label">SKU</label>
                <input 
                  v-model="product.sku" 
                  type="text" 
                  class="form-input" 
                  placeholder="SP001"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Số lượng tồn kho</label>
                <input 
                  v-model="product.stock" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Cảnh báo hết hàng</label>
                <input 
                  v-model="product.lowStockThreshold" 
                  type="number" 
                  class="form-input" 
                  placeholder="5"
                  min="0"
                >
              </div>
              
              <div class="flex items-center">
                <input 
                  id="trackStock" 
                  v-model="product.trackStock" 
                  type="checkbox" 
                  class="mr-2"
                >
                <label for="trackStock" class="text-sm text-gray-700">Theo dõi tồn kho</label>
              </div>
            </div>
          </div>

          <!-- Shipping -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Vận chuyển</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="form-group">
                <label class="form-label">Cân nặng (gram)</label>
                <input 
                  v-model="product.weight" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                >
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="form-group">
                  <label class="form-label">Dài (cm)</label>
                  <input 
                    v-model="product.length" 
                    type="number" 
                    class="form-input" 
                    placeholder="0"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Rộng (cm)</label>
                  <input 
                    v-model="product.width" 
                    type="number" 
                    class="form-input" 
                    placeholder="0"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Cao (cm)</label>
                  <input 
                    v-model="product.height" 
                    type="number" 
                    class="form-input" 
                    placeholder="0"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" class="btn btn-secondary">
          Lưu bản nháp
        </button>
        <button type="submit" class="btn btn-primary">
          <CheckIcon class="h-4 w-4 mr-2" />
          Tạo sản phẩm
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

definePageMeta({
  layout: 'default'
})

const product = ref({
  name: '',
  shortDescription: '',
  description: '',
  slug: '',
  metaTitle: '',
  metaDescription: '',
  status: 'active',
  categoryId: '',
  brand: '',
  price: null,
  comparePrice: null,
  costPrice: null,
  sku: '',
  stock: null,
  lowStockThreshold: 5,
  trackStock: true,
  weight: null,
  length: null,
  width: null,
  height: null,
  images: []
})

const categories = ref([
  { id: 1, name: 'Điện tử' },
  { id: 2, name: 'Thời trang' },
  { id: 3, name: 'Gia dụng' },
  { id: 4, name: 'Sách' },
  { id: 5, name: 'Thể thao' }
])

const removeImage = (index) => {
  product.value.images.splice(index, 1)
}

const saveProduct = () => {
  // Validate form
  if (!product.value.name || !product.value.categoryId || !product.value.price) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc!')
    return
  }

  // Logic to save product
  console.log('Saving product:', product.value)
  alert('Sản phẩm đã được tạo thành công!')
  
  // Redirect to products list
  navigateTo('/products')
}

// Auto generate slug from name
watch(() => product.value.name, (newName) => {
  if (newName && !product.value.slug) {
    product.value.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }
})
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>