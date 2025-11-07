<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
        <p class="text-gray-600">Quản lý danh mục sản phẩm của cửa hàng</p>
      </div>
      <button @click="openAddModal" class="btn btn-primary  px-5 py-2 text-base rounded-xl">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm danh mục
      </button>
    </div>

    <!-- Search -->
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm danh mục..."
          class="form-input"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="category in paginatedCategories" :key="category.id" class="card hover-lift">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <TagIcon class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
                <p class="text-sm text-gray-500">{{ category.productCount || 0 }} sản phẩm</p>
              </div>
            </div>
            <span 
              class="badge" 
              :class="category.isActive ? 'badge-success' : 'badge-secondary'"
            >
              {{ category.isActive ? 'Hoạt động' : 'Ẩn' }}
            </span>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ category.description || 'Chưa có mô tả' }}</p>
          
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <button 
              @click="viewSubcategories(category.id)"
              class="text-sm text-primary-600 hover:text-primary-900 flex items-center"
            >
              <FolderOpenIcon class="h-4 w-4 mr-1" />
              {{ category.subcategoryCount || 0 }} danh mục con
            </button>
            <div class="flex items-center space-x-2">
              <button @click="editCategory(category)" class="text-primary-600 hover:text-primary-900">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && paginatedCategories.length === 0" class="text-center py-12">
      <TagIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        {{ searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có danh mục' }}
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu bằng cách thêm danh mục mới' }}
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-600">
        Hiển thị {{ startItem }} - {{ endItem }} trong tổng số {{ filteredCategories.length }} danh mục
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-50"
        >
          Trước
        </button>

        <div class="flex items-center space-x-1">
          <button
            v-for="page in displayPages"
            :key="page"
            @click="page !== '...' && (currentPage = page)"
            :class="[
              'px-3 py-2 border rounded transition-colors',
              page === currentPage 
                ? 'bg-primary-600 text-white border-primary-600' 
                : page === '...'
                ? 'cursor-default'
                : 'hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-50"
        >
          Sau
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal
      v-model="showAddModal"
      :title="editMode ? 'Sửa danh mục' : 'Thêm danh mục mới'"
      :loading="saving"
    >
      <form @submit.prevent="saveCategory" class="space-y-4">
        <div>
          <label class="form-label required">Tên danh mục</label>
          <input v-model="formData.name" type="text" class="form-input" required placeholder="Nhập tên danh mục" />
        </div>
        <div>
          <label class="form-label">Mô tả</label>
          <textarea v-model="formData.description" rows="3" class="form-textarea" placeholder="Mô tả về danh mục"></textarea>
        </div>
        <div class="flex items-center">
          <input id="isActive" v-model="formData.isActive" type="checkbox" class="h-4 w-4 text-primary-600 rounded" />
          <label for="isActive" class="ml-2 text-sm text-gray-700">Kích hoạt danh mục</label>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" class="btn btn-secondary">Hủy</button>
        <button @click="saveCategory" :disabled="saving" class="btn btn-primary">
          <span v-if="saving" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
          <span v-else>{{ editMode ? 'Cập nhật' : 'Thêm' }}</span>
        </button>
      </template>
    </Modal>

    <!-- Delete Confirmation -->
    <Modal
      v-model="showDeleteDialog"
      title="Xóa danh mục"
      :loading="deleting"
    >
      <p class="text-sm text-gray-600">
        Bạn có chắc chắn muốn xóa danh mục <strong>{{ categoryToDelete?.name }}</strong>?
        Hành động này không thể hoàn tác.
      </p>

      <template #footer>
        <button @click="showDeleteDialog = false" class="btn btn-secondary">Hủy</button>
        <button @click="handleDelete" :disabled="deleting" class="btn btn-danger">
          <span v-if="deleting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xóa...
          </span>
          <span v-else>Xóa</span>
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
  FolderOpenIcon,
  TagIcon
} from '@heroicons/vue/24/outline'
import Modal from '~/components/ui/Modal.vue'

definePageMeta({ layout: 'default' })

const { success, error } = useNotification()
const router = useRouter()

// Dùng composable
const { getCategories, createCategory, updateCategory, deleteCategory } = useCategory()

// State
const categories = ref([])
const searchQuery = ref('')
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showDeleteDialog = ref(false)
const editMode = ref(false)
const categoryToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = 6

const formData = ref({
  id: null,
  name: '',
  description: '',
  isActive: true
})

// Fetch categories
const fetchCategories = async () => {
  loading.value = true
  try {
    // 1. Lấy tất cả categories
    const categoriesRes = await getCategories({ limit: 1000, page: 1 })
    let categoriesData = categoriesRes.data || categoriesRes
    categoriesData = Array.isArray(categoriesData) ? categoriesData : []
    
    // 2. Lấy tất cả subcategories
    const { getSubCategories } = useSubCategory()
    const subCategoriesRes = await getSubCategories({ limit: 1000, page: 1 })
    let subCategoriesData = subCategoriesRes.data || subCategoriesRes
    subCategoriesData = Array.isArray(subCategoriesData) ? subCategoriesData : []
    
    // 3. Đếm số subcategory cho mỗi category
    categories.value = categoriesData.map(cat => {
      const subcategoryCount = subCategoriesData.filter(
        sub => sub.categoryId === cat.id || sub.category === cat.id || sub.category?._id === cat.id
      ).length
      
      return {
        ...cat,
        subcategoryCount
      }
    })
    
    console.log('✅ Loaded:', categories.value.length, 'categories')
    
  } catch (err) {
    console.error('❌ Error:', error)
    error('Không thể tải danh mục!')
    categories.value = []
  } finally {
    loading.value = false
  }
}

// Computed filters & pagination (giữ nguyên như cũ)
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  const q = searchQuery.value.toLowerCase()
  return categories.value.filter(c =>
    c.name?.toLowerCase().includes(q) ||
    c.description?.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage))

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCategories.value.slice(start, start + itemsPerPage)
})

const startItem = computed(() => {
  if (filteredCategories.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredCategories.value.length)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

watch(searchQuery, () => { currentPage.value = 1 })

// CRUD Operations
const openAddModal = () => {
  editMode.value = false
  formData.value = { id: null, name: '', description: '', isActive: true }
  showAddModal.value = true
}

const editCategory = (category) => {
  editMode.value = true
  formData.value = {
    id: category.id,
    name: category.name || '',
    description: category.description || '',
    isActive: category.isActive ?? true
  }
  showAddModal.value = true
}

const confirmDelete = (category) => {
  categoryToDelete.value = category
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  const id = categoryToDelete.value?.id
  if (!id) return

  deleting.value = true
  try {
    await deleteCategory(id)
    
    showDeleteDialog.value = false
    categoryToDelete.value = null
    await nextTick()
    await fetchCategories()

    if (paginatedCategories.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
    
    success('Xóa thành công!')
  } catch (err) {
    error(error.response?.data?.message || 'Lỗi xóa!')
  } finally {
    deleting.value = false
  }
}

const saveCategory = async () => {
  if (!formData.value.name.trim()) {
    error('Vui lòng nhập tên danh mục!')
    return
  }

  saving.value = true
  try {
    const payload = {
      name: formData.value.name.trim(),
      description: formData.value.description?.trim() || '',
      isActive: formData.value.isActive
    }

    if (editMode.value && formData.value.id) {
      await updateCategory(formData.value.id, payload)
    } else {
      await createCategory(payload)
    }

    closeModal()
    await nextTick()
    await fetchCategories()
    currentPage.value = 1
    
    success(editMode.value ? 'Cập nhật thành công!' : 'Thêm thành công!')
  } catch (err ) {
    error(error.response?.data?.message || 'Có lỗi xảy ra!')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  editMode.value = false
  formData.value = { id: null, name: '', description: '', isActive: true }
}

const viewSubcategories = (categoryId) => {
  router.push(`/subcategory?categoryId=${categoryId}`)
}

// Init
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.required::after {
  content: " *";
  color: #ef4444;
}
</style>