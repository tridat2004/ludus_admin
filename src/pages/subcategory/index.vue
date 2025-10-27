<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center text-sm text-gray-600">
      <NuxtLink to="/category" class="hover:text-primary-600">Danh mục</NuxtLink>
      <ChevronRightIcon class="h-4 w-4 mx-2" />
      <span class="text-gray-900">Danh mục con</span>
    </nav>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý danh mục con</h1>
        <p class="text-gray-600">Quản lý danh mục con của sản phẩm</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm danh mục con
      </button>
    </div>

    <!-- Filter by Parent Category -->
    <div class="card">
      <div class="card-body">
        <label class="form-label">Lọc theo danh mục cha</label>
        <select v-model="selectedParentId" class="form-select max-w-xs">
          <option value="">Tất cả danh mục</option>
          <option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Subcategories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="subcategory in filteredSubcategories" :key="subcategory.id" class="card hover-lift">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="font-semibold text-gray-900">{{ subcategory.name }}</h3>
              <p class="text-sm text-gray-500">{{ subcategory.parentCategory }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ subcategory.productCount }} sản phẩm</p>
            </div>
            <span class="badge" :class="subcategory.status === 'active' ? 'badge-success' : 'badge-secondary'">
              {{ subcategory.status === 'active' ? 'Hoạt động' : 'Ẩn' }}
            </span>
          </div>
          
          <p class="text-sm text-gray-600 mb-4">{{ subcategory.description }}</p>
          
          <div class="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
            <button @click="editSubcategory(subcategory)" class="text-primary-600 hover:text-primary-900">
              <PencilIcon class="h-4 w-4" />
            </button>
            <button @click="deleteSubcategory(subcategory.id)" class="text-red-600 hover:text-red-900">
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingSubcategory ? 'Sửa danh mục con' : 'Thêm danh mục con' }}
          </h3>
          <button @click="closeModal">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveSubcategory" class="p-6 space-y-4">
          <div class="form-group">
            <label class="form-label required">Danh mục cha</label>
            <select v-model="formData.parentCategoryId" class="form-select" required>
              <option value="">Chọn danh mục</option>
              <option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label required">Tên danh mục con</label>
            <input v-model="formData.name" type="text" class="form-input" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea v-model="formData.description" rows="3" class="form-textarea"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <select v-model="formData.status" class="form-select">
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn btn-secondary">Hủy</button>
            <button type="submit" class="btn btn-primary">
              {{ editingSubcategory ? 'Cập nhật' : 'Thêm' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })

const route = useRoute()
const showAddModal = ref(false)
const editingSubcategory = ref(null)
const selectedParentId = ref(route.query.categoryId || '')

const formData = ref({
  parentCategoryId: '',
  name: '',
  description: '',
  status: 'active'
})

const parentCategories = ref([
  { id: '1', name: 'Điện tử' },
  { id: '2', name: 'Thời trang' },
  { id: '3', name: 'Gia dụng' },
  { id: '4', name: 'Sách' }
])

const subcategories = ref([
  { id: 1, name: 'Điện thoại', parentCategoryId: '1', parentCategory: 'Điện tử', description: 'Smartphone, máy tính bảng', productCount: 45, status: 'active' },
  { id: 2, name: 'Laptop', parentCategoryId: '1', parentCategory: 'Điện tử', description: 'Laptop, Macbook', productCount: 23, status: 'active' },
  { id: 3, name: 'Tai nghe', parentCategoryId: '1', parentCategory: 'Điện tử', description: 'Tai nghe bluetooth, có dây', productCount: 34, status: 'active' },
  { id: 4, name: 'Áo nam', parentCategoryId: '2', parentCategory: 'Thời trang', description: 'Áo thun, áo sơ mi', productCount: 67, status: 'active' },
  { id: 5, name: 'Quần nam', parentCategoryId: '2', parentCategory: 'Thời trang', description: 'Quần jean, kaki', productCount: 45, status: 'active' },
  { id: 6, name: 'Nồi cơm điện', parentCategoryId: '3', parentCategory: 'Gia dụng', description: 'Nồi cơm điện tử', productCount: 12, status: 'active' }
])

const filteredSubcategories = computed(() => {
  if (!selectedParentId.value) return subcategories.value
  return subcategories.value.filter(s => s.parentCategoryId === selectedParentId.value)
})

const editSubcategory = (subcategory) => {
  editingSubcategory.value = subcategory
  formData.value = { ...subcategory }
  showAddModal.value = true
}

const deleteSubcategory = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa?')) {
    subcategories.value = subcategories.value.filter(s => s.id !== id)
  }
}

const saveSubcategory = () => {
  const parentCat = parentCategories.value.find(c => c.id === formData.value.parentCategoryId)
  
  if (editingSubcategory.value) {
    const index = subcategories.value.findIndex(s => s.id === editingSubcategory.value.id)
    subcategories.value[index] = { 
      ...formData.value,
      parentCategory: parentCat?.name || ''
    }
  } else {
    subcategories.value.push({ 
      id: Date.now(), 
      ...formData.value, 
      parentCategory: parentCat?.name || '',
      productCount: 0 
    })
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingSubcategory.value = null
  formData.value = { parentCategoryId: '', name: '', description: '', status: 'active' }
}
</script>

<style scoped>
.required::after { content: " *"; color: #ef4444; }
</style>