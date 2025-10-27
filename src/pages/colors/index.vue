<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý màu sắc</h1>
        <p class="text-gray-600">Quản lý màu sắc cho sản phẩm</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm màu
      </button>
    </div>

    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Màu</th>
              <th>Tên màu</th>
              <th>Mã màu</th>
              <th>Số sản phẩm</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="color in colors" :key="color.id">
              <td>
                <div class="w-10 h-10 rounded-lg border-2 border-gray-200" :style="`background-color: ${color.hexCode}`"></div>
              </td>
              <td class="font-medium">{{ color.name }}</td>
              <td class="font-mono text-sm">{{ color.hexCode }}</td>
              <td>{{ color.productCount }}</td>
              <td>
                <span class="badge" :class="color.status === 'active' ? 'badge-success' : 'badge-secondary'">
                  {{ color.status === 'active' ? 'Hoạt động' : 'Ẩn' }}
                </span>
              </td>
              <td>
                <div class="flex items-center space-x-2">
                  <button @click="editColor(color)" class="text-primary-600 hover:text-primary-900">
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button @click="deleteColor(color.id)" class="text-red-600 hover:text-red-900">
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
          <h3 class="text-lg font-semibold">{{ editingColor ? 'Sửa màu' : 'Thêm màu' }}</h3>
          <button @click="closeModal"><XMarkIcon class="h-6 w-6" /></button>
        </div>
        <form @submit.prevent="saveColor" class="p-6 space-y-4">
          <div>
            <label class="form-label required">Tên màu</label>
            <input v-model="formData.name" type="text" class="form-input" required>
          </div>
          <div>
            <label class="form-label required">Mã màu</label>
            <div class="flex space-x-2">
              <input v-model="formData.hexCode" type="text" class="form-input font-mono" placeholder="#000000" required>
              <input v-model="formData.hexCode" type="color" class="w-12 h-10 rounded border">
            </div>
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
            <button type="submit" class="btn btn-primary">{{ editingColor ? 'Cập nhật' : 'Thêm' }}</button>
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
const editingColor = ref(null)
const formData = ref({ name: '', hexCode: '#000000', status: 'active' })

const colors = ref([
  { id: 1, name: 'Đen', hexCode: '#000000', productCount: 45, status: 'active' },
  { id: 2, name: 'Trắng', hexCode: '#FFFFFF', productCount: 52, status: 'active' },
  { id: 3, name: 'Đỏ', hexCode: '#FF0000', productCount: 23, status: 'active' },
  { id: 4, name: 'Xanh dương', hexCode: '#0000FF', productCount: 34, status: 'active' }
])

const editColor = (color) => {
  editingColor.value = color
  formData.value = { ...color }
  showAddModal.value = true
}

const deleteColor = (id) => {
  if (confirm('Bạn có chắc muốn xóa?')) colors.value = colors.value.filter(c => c.id !== id)
}

const saveColor = () => {
  if (editingColor.value) {
    const index = colors.value.findIndex(c => c.id === editingColor.value.id)
    colors.value[index] = { ...formData.value }
  } else {
    colors.value.push({ id: Date.now(), ...formData.value, productCount: 0 })
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingColor.value = null
  formData.value = { name: '', hexCode: '#000000', status: 'active' }
}
</script>

<style scoped>
.required::after { content: " *"; color: #ef4444; }
</style>