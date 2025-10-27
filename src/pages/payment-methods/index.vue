<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Phương thức thanh toán</h1>
        <p class="text-gray-600">Quản lý các phương thức thanh toán</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Thêm phương thức
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="method in paymentMethods" :key="method.id" class="card hover-lift">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <component :is="getIcon(method.type)" class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ method.name }}</h3>
                <p class="text-sm text-gray-500">{{ method.type }}</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="method.enabled" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ method.description }}</p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Phí: {{ method.fee }}%</span>
            <div class="flex space-x-2">
              <button @click="editMethod(method)" class="text-primary-600 hover:text-primary-900">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="deleteMethod(method.id)" class="text-red-600 hover:text-red-900">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">{{ editingMethod ? 'Sửa phương thức' : 'Thêm phương thức' }}</h3>
          <button @click="closeModal"><XMarkIcon class="h-6 w-6" /></button>
        </div>
        <form @submit.prevent="saveMethod" class="p-6 space-y-4">
          <div>
            <label class="form-label required">Tên phương thức</label>
            <input v-model="formData.name" type="text" class="form-input" required>
          </div>
          <div>
            <label class="form-label required">Loại</label>
            <select v-model="formData.type" class="form-select" required>
              <option value="COD">COD</option>
              <option value="Bank Transfer">Chuyển khoản</option>
              <option value="Credit Card">Thẻ tín dụng</option>
              <option value="E-Wallet">Ví điện tử</option>
            </select>
          </div>
          <div>
            <label class="form-label">Mô tả</label>
            <textarea v-model="formData.description" rows="3" class="form-textarea"></textarea>
          </div>
          <div>
            <label class="form-label">Phí (%)</label>
            <input v-model.number="formData.fee" type="number" step="0.01" class="form-input">
          </div>
          <div class="flex items-center">
            <input id="enabled" v-model="formData.enabled" type="checkbox" class="mr-2">
            <label for="enabled" class="text-sm">Kích hoạt ngay</label>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn btn-secondary">Hủy</button>
            <button type="submit" class="btn btn-primary">{{ editingMethod ? 'Cập nhật' : 'Thêm' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CreditCardIcon, BanknotesIcon, PhoneIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })

const showAddModal = ref(false)
const editingMethod = ref(null)

const formData = ref({
  name: '',
  type: 'COD',
  description: '',
  fee: 0,
  enabled: true
})

const paymentMethods = ref([
  {
    id: 1,
    name: 'COD',
    type: 'COD',
    description: 'Thanh toán khi nhận hàng',
    fee: 0,
    enabled: true
  },
  {
    id: 2,
    name: 'Chuyển khoản ngân hàng',
    type: 'Bank Transfer',
    description: 'Chuyển khoản qua ngân hàng',
    fee: 0,
    enabled: true
  },
  {
    id: 3,
    name: 'Thẻ tín dụng',
    type: 'Credit Card',
    description: 'Thanh toán bằng thẻ tín dụng',
    fee: 2.5,
    enabled: true
  },
  {
    id: 4,
    name: 'Ví MoMo',
    type: 'E-Wallet',
    description: 'Thanh toán qua ví MoMo',
    fee: 1.5,
    enabled: false
  }
])

const getIcon = (type) => {
  return {
    'COD': BanknotesIcon,
    'Bank Transfer': BanknotesIcon,
    'Credit Card': CreditCardIcon,
    'E-Wallet': PhoneIcon
  }[type] || CreditCardIcon
}

const editMethod = (method) => {
  editingMethod.value = method
  formData.value = { ...method }
  showAddModal.value = true
}

const deleteMethod = (id) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
    paymentMethods.value = paymentMethods.value.filter(m => m.id !== id)
  }
}

const saveMethod = () => {
  if (editingMethod.value) {
    const index = paymentMethods.value.findIndex(m => m.id === editingMethod.value.id)
    paymentMethods.value[index] = { ...formData.value }
  } else {
    paymentMethods.value.push({ id: Date.now(), ...formData.value })
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingMethod.value = null
  formData.value = { name: '', type: 'COD', description: '', fee: 0, enabled: true }
}
</script>

<style scoped>
.required::after { content: " *"; color: #ef4444; }
</style>