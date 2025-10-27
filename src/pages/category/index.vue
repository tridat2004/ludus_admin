<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
        <p class="text-gray-600">Quản lý danh mục sản phẩm của cửa hàng</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm danh mục
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="category in categories" :key="category.id" class="card hover-lift">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <component :is="TagIcon" class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
                <p class="text-sm text-gray-500">{{ category.productCount }} sản phẩm</p>
              </div>
            </div>
            <span 
              class="badge" 
              :class="category.status === 'active' ? 'badge-success' : 'badge-secondary'"
            >
              {{ category.status === 'active' ? 'Hoạt động' : 'Ẩn' }}
            </span>
          </div>
          
          <p class="text-sm text-gray-600 mb-4">{{ category.description }}</p>
          
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <button 
              @click="viewSubcategories(category.id)"
              class="text-sm text-primary-600 hover:text-primary-900 flex items-center"
            >
              <FolderOpenIcon class="h-4 w-4 mr-1" />
              {{ category.subcategoryCount }} danh mục con
            </button>
            <div class="flex items-center space-x-2">
              <button @click="editCategory(category)" class="text-primary-600 hover:text-primary-900">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-900">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới' }}
          </h3>
          <button @click="closeModal">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div class="form-group">
            <label class="form-label required">Tên danh mục</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <select v-model="formData.status" class="form-select">
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingCategory ? 'Cập nhật' : 'Thêm' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  TagIcon,
  FolderOpenIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const showAddModal = ref(false)
const editingCategory = ref(null)

const formData = ref({
  name: '',
  description: '',
  status: 'active'
})

const categories = ref([
  {
    id: 1,
    name: 'Điện tử',
    description: 'Các sản phẩm điện tử, công nghệ',
    productCount: 245,
    subcategoryCount: 12,
    status: 'active'
  },
  {
    id: 2,
    name: 'Thời trang',
    description: 'Quần áo, phụ kiện thời trang',
    productCount: 156,
    subcategoryCount: 8,
    status: 'active'
  },
  {
    id: 3,
    name: 'Gia dụng',
    description: 'Đồ dùng gia đình, nhà cửa',
    productCount: 89,
    subcategoryCount: 5,
    status: 'active'
  },
  {
    id: 4,
    name: 'Sách',
    description: 'Sách, văn phòng phẩm',
    productCount: 67,
    subcategoryCount: 4,
    status: 'inactive'
  }
])

const viewSubcategories = (categoryId) => {
  router.push(`/subcategories?categoryId=${categoryId}`)
}

const editCategory = (category) => {
  editingCategory.value = category
  formData.value = { ...category }
  showAddModal.value = true
}

const deleteCategory = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index > -1) {
      categories.value.splice(index, 1)
    }
  }
}

const saveCategory = () => {
  if (editingCategory.value) {
    const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
    categories.value[index] = { ...formData.value }
  } else {
    categories.value.push({
      id: Date.now(),
      ...formData.value,
      productCount: 0,
      subcategoryCount: 0
    })
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingCategory.value = null
  formData.value = {
    name: '',
    description: '',
    status: 'active'
  }
}
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>