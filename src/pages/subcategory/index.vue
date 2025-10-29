<!-- pages/category/subcategory.vue - FIXED PAGINATION -->
<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm text-gray-600">
      <NuxtLink to="/category" class="hover:text-primary-600">Danh mục</NuxtLink>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span class="font-medium text-gray-900">{{ currentCategory?.name || 'Danh mục con' }}</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Danh mục con: {{ currentCategory?.name }}
        </h1>
        <p class="text-gray-600">Quản lý danh mục con của {{ currentCategory?.name }}</p>
      </div>
      <button @click="openAddModal" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm danh mục con
      </button>
    </div>

    <!-- Search -->
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm danh mục con..."
          class="form-input"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- SubCategories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="subcategory in paginatedSubCategories" :key="subcategory.id" class="card hover-lift">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <TagIcon class="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ subcategory.name }}</h3>
                <p class="text-sm text-gray-500">{{ subcategory.productCount || 0 }} sản phẩm</p>
              </div>
            </div>
            <span 
              class="badge" 
              :class="subcategory.isActive ? 'badge-success' : 'badge-secondary'"
            >
              {{ subcategory.isActive ? 'Hoạt động' : 'Ẩn' }}
            </span>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            {{ subcategory.description || 'Chưa có mô tả' }}
          </p>
          
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <span class="text-sm text-gray-500">
              Danh mục cha: <strong>{{ currentCategory?.name || 'Chưa xác định'}}</strong>
            </span>
            <div class="flex items-center space-x-2">
              <button @click="editSubCategory(subcategory)" class="text-primary-600 hover:text-primary-900">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="confirmDelete(subcategory)" class="text-red-600 hover:text-red-900">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && paginatedSubCategories.length === 0" class="text-center py-12">
      <TagIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        {{ searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có danh mục con' }}
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu bằng cách thêm danh mục con mới' }}
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && filteredSubCategories.length > 0" class="flex justify-between items-center mt-6 pt-6 border-t">
      <div class="text-sm text-gray-600">
        Hiển thị {{ startItem }} - {{ endItem }} trong tổng số {{ filteredSubCategories.length }} danh mục
      </div>

      <div v-if="totalPages > 1" class="flex items-center space-x-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-50"
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
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-50"
        >
          Sau
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal
      v-model="showAddModal"
      :title="editMode ? 'Sửa danh mục con' : 'Thêm danh mục con mới'"
      :loading="saving"
    >
      <form @submit.prevent="saveSubCategory" class="space-y-4">
        <div>
          <label class="form-label required">Tên danh mục con</label>
          <input v-model="formData.name" type="text" class="form-input" required />
        </div>
        <div>
          <label class="form-label">Mô tả</label>
          <textarea v-model="formData.description" rows="3" class="form-textarea"></textarea>
        </div>
        <div>
          <label class="form-label required">Danh mục cha</label>
          <input 
            type="text" 
            :value="currentCategory?.name" 
            class="form-input bg-gray-100" 
            disabled 
          />
        </div>
        <div class="flex items-center">
          <input id="isActive" v-model="formData.isActive" type="checkbox" class="h-4 w-4 text-primary-600 rounded" />
          <label for="isActive" class="ml-2 text-sm text-gray-700">Kích hoạt danh mục con</label>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" class="btn btn-secondary">Hủy</button>
        <button @click="saveSubCategory" :disabled="saving" class="btn btn-primary">
          {{ saving ? 'Đang xử lý...' : (editMode ? 'Cập nhật' : 'Thêm') }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { PlusIcon, PencilIcon, TrashIcon, TagIcon } from '@heroicons/vue/24/outline'
import Modal from '~/components/ui/Modal.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { success, error } = useNotification()

// Composables
const { getCategories } = useCategory()
const { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory } = useSubCategory()

// State
const categoryId = ref(route.query.categoryId)
const currentCategory = ref(null)
const subcategories = ref([])
const searchQuery = ref('')
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showDeleteDialog = ref(false)
const editMode = ref(false)
const subcategoryToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = 6

const formData = ref({
  id: null,
  name: '',
  description: '',
  isActive: true,
  categoryId: categoryId.value
})

// Fetch current category info
const fetchCategory = async () => {
  try {
    const res = await getCategories({ limit: 1000 })
    const categories = res.data || res
    
    currentCategory.value = categories.find(c => 
      c.id === categoryId.value || 
      c._id === categoryId.value ||
      String(c.id) === String(categoryId.value) ||
      String(c._id) === String(categoryId.value)
    )
  } catch (err) {
    console.error('Error fetching category:', err)
  }
}

// Fetch subcategories
const fetchSubCategories = async () => {
  loading.value = true
  try {
    const res = await getSubCategories({ limit: 1000 })
    
    let data = res.data || res
    data = Array.isArray(data) ? data : []
    
    // Filter by categoryId
    subcategories.value = data.filter(sub => {
      return (
        sub.categoryId === categoryId.value ||
        sub.category === categoryId.value ||
        sub.category?._id === categoryId.value ||
        sub.category?.id === categoryId.value ||
        sub.parentId === categoryId.value ||
        sub.parent === categoryId.value ||
        String(sub.categoryId) === String(categoryId.value) ||
        String(sub.category) === String(categoryId.value)
      )
    })
    
  } catch (err) {
    console.error('Error:', err)
    error('Không thể tải danh mục con!')
    subcategories.value = []
  } finally {
    loading.value = false
  }
}

// Computed - FIXED: Thêm các computed còn thiếu
const filteredSubCategories = computed(() => {
  if (!searchQuery.value.trim()) return subcategories.value
  const q = searchQuery.value.toLowerCase()
  return subcategories.value.filter(s =>
    s.name?.toLowerCase().includes(q) ||
    s.description?.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filteredSubCategories.value.length / itemsPerPage))

const paginatedSubCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredSubCategories.value.slice(start, start + itemsPerPage)
})

// FIXED: Thêm computed cho pagination info
const startItem = computed(() => {
  if (filteredSubCategories.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredSubCategories.value.length)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // Hiển thị tất cả nếu <= 7 trang
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Luôn hiển thị trang đầu
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    // Hiển thị các trang xung quanh trang hiện tại
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    // Luôn hiển thị trang cuối
    pages.push(total)
  }
  
  return pages
})

// Watch searchQuery to reset page
watch(searchQuery, () => {
  currentPage.value = 1
})

// CRUD
const openAddModal = () => {
  editMode.value = false
  formData.value = { 
    id: null, 
    name: '', 
    description: '', 
    isActive: true,
    categoryId: categoryId.value
  }
  showAddModal.value = true
}

const editSubCategory = (subcategory) => {
  editMode.value = true
  formData.value = {
    id: subcategory.id,
    name: subcategory.name || '',
    description: subcategory.description || '',
    isActive: subcategory.isActive ?? true,
    categoryId: categoryId.value
  }
  showAddModal.value = true
}

const confirmDelete = (subcategory) => {
  subcategoryToDelete.value = subcategory
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  const id = subcategoryToDelete.value?.id
  if (!id) return

  deleting.value = true
  try {
    await deleteSubCategory(id)
    showDeleteDialog.value = false
    subcategoryToDelete.value = null
    await nextTick()
    await fetchSubCategories()
    success('Xóa thành công!')
  } catch (err) {
    error(err.response?.data?.message || 'Lỗi xóa!')
  } finally {
    deleting.value = false
  }
}

const saveSubCategory = async () => {
  if (!formData.value.name.trim()) {
    error('Vui lòng nhập tên danh mục con!')
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
      await updateSubCategory(formData.value.id, payload)
    } else {
      await createSubCategory(categoryId.value, payload)
    }

    closeModal()
    await nextTick()
    await fetchSubCategories()
    success(editMode.value ? 'Cập nhật thành công!' : 'Thêm thành công!')
  } catch (err) {
    error(err.response?.data?.message || 'Có lỗi xảy ra!')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  editMode.value = false
  formData.value = { 
    id: null, 
    name: '', 
    description: '', 
    isActive: true,
    categoryId: categoryId.value
  }
}

// Init
onMounted(() => {
  fetchCategory()
  fetchSubCategories()
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