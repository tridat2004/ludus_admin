<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý kích cỡ</h1>
        <p class="text-gray-600">Quản lý kích cỡ cho sản phẩm</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm kích cỡ
      </button>
    </div>

    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Tên kích cỡ</th>
              <th>Mã</th>
              <th>Mô tả</th>
              <th>Số sản phẩm</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="size in sizes" :key="size.id">
              <td class="font-medium">{{ size.name }}</td>
              <td class="font-mono text-sm">{{ size.code }}</td>
              <td class="text-sm text-gray-600">{{ size.description }}</td>
              <td>{{ size.productCount }}</td>
              <td>
                <span class="badge" :class="size.status === 'active' ? 'badge-success' : 'badge-secondary'">
                  {{ size.status === 'active' ? 'Hoạt động' : 'Ẩn' }}
                </span>
              </td>
              <td>
                <div class="flex items-center space-x-2">
                  <button @click="editSize(size)" class="text-primary-600 hover:text-primary-900">
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button @click="deleteSize(size.id)" class="text-red-600 hover:text-red-900">
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
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">{{ editingSize ? 'Sửa kích cỡ' : 'Thêm kích cỡ' }}</h3>
          <button @click="closeModal"><XMarkIcon class="h-6 w-6" /></button>
        </div>
        <form @submit.prevent="saveSize" class="p-6 space-y-4">
          <div>
            <label class="form-label required">Tên kích cỡ</label>
            <input v-model="formData.name" type="text" class="form-input" required>
          </div>
          <div>
            <label class="form-label required">Mã</label>
            <input v-model="formData.code" type="text" class="form-input font-mono uppercase" required>
          </div>
          <div>
            <label class="form-label">Mô tả</label>
            <textarea v-model="formData.description" rows="2" class="form-textarea"></textarea>
          </div>
          <div>
            <label class="form-label">Trạng thái</label>
            <select v-model="formData.status" class="form-select">
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn btn-secondary">Hủy</button>
            <button type="submit" class="btn btn-primary">{{ editingSize ? 'Cập nhật' : 'Thêm' }}</button>
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
const editingSize = ref(null)
const formData = ref({ name: '', code: '', description: '', status: 'active' })

const sizes = ref([
  { id: 1, name: 'Small', code: 'S', description: 'Kích cỡ nhỏ', productCount: 34, status: 'active' },
  { id: 2, name: 'Medium', code: 'M', description: 'Kích cỡ vừa', productCount: 56, status: 'active' },
  { id: 3, name: 'Large', code: 'L', description: 'Kích cỡ lớn', productCount: 45, status: 'active' },
  { id: 4, name: 'Extra Large', code: 'XL', description: 'Kích cỡ rất lớn', productCount: 23, status: 'active' }
])

const editSize = (size) => {
  editingSize.value = size
  formData.value = { ...size }
  showAddModal.value = true
}

const deleteSize = (id) => {
  if (confirm('Bạn có chắc muốn xóa?')) sizes.value = sizes.value.filter(s => s.id !== id)
}

const saveSize = () => {
  if (editingSize.value) {
    const index = sizes.value.findIndex(s => s.id === editingSize.value.id)
    sizes.value[index] = { ...formData.value }
  } else {
    sizes.value.push({ id: Date.now(), ...formData.value, productCount: 0 })
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingSize.value = null
  formData.value = { name: '', code: '', description: '', status: 'active' }
}
</script>

<style scoped>
.required::after { content: " *"; color: #ef4444; }
</style>