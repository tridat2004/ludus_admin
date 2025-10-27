<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý biến thể sản phẩm</h1>
        <p class="text-gray-600">Quản lý màu sắc và kích cỡ của sản phẩm</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm biến thể
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input v-model="searchQuery" type="text" placeholder="Tìm sản phẩm..." class="form-input">
          <select v-model="filterColor" class="form-select">
            <option value="">Tất cả màu</option>
            <option value="black">Đen</option>
            <option value="white">Trắng</option>
            <option value="red">Đỏ</option>
          </select>
          <select v-model="filterSize" class="form-select">
            <option value="">Tất cả kích cỡ</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SKU</th>
              <th>Màu sắc</th>
              <th>Kích cỡ</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variant in filteredVariants" :key="variant.id">
              <td>
                <div class="flex items-center">
                  <img :src="variant.image" :alt="variant.productName" class="h-10 w-10 rounded object-cover">
                  <span class="ml-3 font-medium">{{ variant.productName }}</span>
                </div>
              </td>
              <td class="font-mono text-sm">{{ variant.sku }}</td>
              <td>
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded border mr-2" :style="`background: ${variant.colorHex}`"></div>
                  {{ variant.colorName }}
                </div>
              </td>
              <td><span class="badge badge-info">{{ variant.sizeName }}</span></td>
              <td class="font-medium">{{ formatCurrency(variant.price) }}</td>
              <td :class="variant.stock <= 5 ? 'text-red-600 font-medium' : ''">{{ variant.stock }}</td>
              <td>
                <span class="badge" :class="variant.status === 'active' ? 'badge-success' : 'badge-secondary'">
                  {{ variant.status === 'active' ? 'Hoạt động' : 'Ẩn' }}
                </span>
              </td>
              <td>
                <div class="flex items-center space-x-2">
                  <button @click="editVariant(variant)" class="text-primary-600 hover:text-primary-900">
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button @click="deleteVariant(variant.id)" class="text-red-600 hover:text-red-900">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">{{ editingVariant ? 'Sửa biến thể' : 'Thêm biến thể' }}</h3>
          <button @click="closeModal"><XMarkIcon class="h-6 w-6" /></button>
        </div>
        <form @submit.prevent="saveVariant" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label required">Sản phẩm</label>
              <select v-model="formData.productId" class="form-select" required>
                <option value="">Chọn sản phẩm</option>
                <option value="1">iPhone 15 Pro Max</option>
                <option value="2">MacBook Pro M3</option>
              </select>
            </div>
            <div>
              <label class="form-label required">SKU</label>
              <input v-model="formData.sku" type="text" class="form-input font-mono" required>
            </div>
            <div>
              <label class="form-label required">Màu sắc</label>
              <select v-model="formData.colorId" class="form-select" required>
                <option value="">Chọn màu</option>
                <option value="1">Đen</option>
                <option value="2">Trắng</option>
              </select>
            </div>
            <div>
              <label class="form-label required">Kích cỡ</label>
              <select v-model="formData.sizeId" class="form-select" required>
                <option value="">Chọn size</option>
                <option value="1">S</option>
                <option value="2">M</option>
              </select>
            </div>
            <div>
              <label class="form-label required">Giá</label>
              <input v-model.number="formData.price" type="number" class="form-input" required>
            </div>
            <div>
              <label class="form-label required">Tồn kho</label>
              <input v-model.number="formData.stock" type="number" class="form-input" required>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn btn-secondary">Hủy</button>
            <button type="submit" class="btn btn-primary">{{ editingVariant ? 'Cập nhật' : 'Thêm' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })

const showAddModal = ref(false)
const editingVariant = ref(null)
const searchQuery = ref('')
const filterColor = ref('')
const filterSize = ref('')

const formData = ref({
  productId: '',
  sku: '',
  colorId: '',
  sizeId: '',
  price: 0,
  stock: 0,
  status: 'active'
})

const variants = ref([
  {
    id: 1,
    productName: 'iPhone 15 Pro Max',
    sku: 'IP15PM-BLK-256',
    colorName: 'Đen',
    colorHex: '#000000',
    sizeName: '256GB',
    price: 30000000,
    stock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=50&h=50&fit=crop'
  },
  {
    id: 2,
    productName: 'MacBook Pro M3',
    sku: 'MBP-M3-SLV-16',
    colorName: 'Bạc',
    colorHex: '#C0C0C0',
    sizeName: '16GB',
    price: 50000000,
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=50&h=50&fit=crop'
  }
])

const filteredVariants = computed(() => {
  return variants.value.filter(v => {
    const matchSearch = !searchQuery.value || v.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchColor = !filterColor.value || v.colorName.toLowerCase().includes(filterColor.value)
    const matchSize = !filterSize.value || v.sizeName.includes(filterSize.value)
    return matchSearch && matchColor && matchSize
  })
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const editVariant = (variant) => {
  editingVariant.value = variant
  formData.value = { ...variant }
  showAddModal.value = true
}

const deleteVariant = (id) => {
  if (confirm('Bạn có chắc muốn xóa?')) variants.value = variants.value.filter(v => v.id !== id)
}

const saveVariant = () => {
  if (editingVariant.value) {
    const index = variants.value.findIndex(v => v.id === editingVariant.value.id)
    variants.value[index] = { ...formData.value }
  } else {
    variants.value.push({ id: Date.now(), ...formData.value })
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingVariant.value = null
  formData.value = { productId: '', sku: '', colorId: '', sizeId: '', price: 0, stock: 0, status: 'active' }
}
</script>

<style scoped>
.required::after { content: " *"; color: #ef4444; }
</style>