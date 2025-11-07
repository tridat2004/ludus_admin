<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Phương thức thanh toán</h1>
        <p class="text-gray-600">Quản lý các phương thức thanh toán</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Payment Methods Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="method in paymentMethods" 
        :key="method.id || method._id" 
        class="card hover-lift"
      >
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <component :is="getIcon(method.type)" class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ method.name }}</h3>
                <p class="text-sm text-gray-500">{{ formatType(method.type) }}</p>
              </div>
            </div>
            
            <!-- Toggle Switch -->
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                :checked="method.isActive"
                @change="toggleStatus(method)"
                class="sr-only peer"
                :disabled="toggling === (method.id || method._id)"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
            </label>
          </div>
          
          <p class="text-sm text-gray-600 mb-4">
            {{ method.description || 'Không có mô tả' }}
          </p>
          
          <div class="flex items-center justify-between">
            <span 
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                method.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ method.isActive ? 'Đang hoạt động' : 'Tạm dừng' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && paymentMethods.length === 0" class="text-center py-12">
      <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Chưa có phương thức thanh toán</h3>
      <p class="mt-1 text-sm text-gray-500">Hệ thống chưa có phương thức thanh toán nào</p>
    </div>
  </div>
</template>

<script setup>
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  PhoneIcon,
  BuildingLibraryIcon,
  WalletIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ 
  layout: 'default' 
})

const { notify } = useNotification()
const success = (msg) => notify(msg, 'success', 3000)
const error = (msg) => notify(msg, 'error', 4000)

const { 
  getAllPaymentMethods, 
  togglePaymentMethodStatus 
} = usePaymentMethod()

// State
const paymentMethods = ref([])
const loading = ref(false)
const toggling = ref(null)

// Get icon based on payment type
const getIcon = (type) => {
  const icons = {
    'COD': BanknotesIcon,
    'VNPAY': WalletIcon,
    'MOMO': PhoneIcon,
    'ZALOPAY': PhoneIcon,
    'BANK_TRANSFER': BuildingLibraryIcon
  }
  return icons[type] || CreditCardIcon
}

// Format payment type
const formatType = (type) => {
  const types = {
    'COD': 'Thanh toán khi nhận hàng',
    'VNPAY': 'VNPay',
    'MOMO': 'Ví MoMo',
    'ZALOPAY': 'ZaloPay',
    'BANK_TRANSFER': 'Chuyển khoản ngân hàng'
  }
  return types[type] || type
}

// Fetch all payment methods
const fetchPaymentMethods = async () => {
  loading.value = true
  try {
    const response = await getAllPaymentMethods()
    console.log('📦 Payment methods response:', response)
    
    // Handle different response structures
    paymentMethods.value = response.data || response || []
    
    console.log('✅ Loaded payment methods:', paymentMethods.value)
  } catch (err) {
    console.error('❌ Error fetching payment methods:', err)
    error('Không thể tải danh sách phương thức thanh toán!')
    paymentMethods.value = []
  } finally {
    loading.value = false
  }
}

// Toggle payment method status
const toggleStatus = async (method) => {
  const methodId = method.id || method._id
  
  if (!methodId) {
    error('Không tìm thấy ID phương thức thanh toán!')
    return
  }

  toggling.value = methodId
  
  try {
    console.log('🔄 Toggling status for:', methodId)
    await togglePaymentMethodStatus(methodId)
    
    // Update local state
    const index = paymentMethods.value.findIndex(
      m => (m.id || m._id) === methodId
    )
    
    if (index !== -1) {
      paymentMethods.value[index].isActive = !paymentMethods.value[index].isActive
      
      const newStatus = paymentMethods.value[index].isActive ? 'kích hoạt' : 'tạm dừng'
      success(`Đã ${newStatus} phương thức thanh toán!`)
    }
  } catch (err) {
    console.error('❌ Error toggling status:', err)
    error('Không thể thay đổi trạng thái!')
  } finally {
    toggling.value = null
  }
}

// Load data on mount
onMounted(() => {
  fetchPaymentMethods()
})
</script>

<style scoped>
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-body {
  @apply p-6;
}
</style>
