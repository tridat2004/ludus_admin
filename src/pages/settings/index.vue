<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
      <p class="text-gray-600">Quản lý cấu hình và tùy chọn của cửa hàng</p>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === tab.id 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-2 inline" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin cửa hàng</h3>
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="form-label">Tên cửa hàng</label>
                    <input v-model="settings.storeName" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email liên hệ</label>
                    <input v-model="settings.email" type="email" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Số điện thoại</label>
                    <input v-model="settings.phone" type="tel" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Địa chỉ</label>
                    <textarea v-model="settings.address" rows="3" class="form-textarea"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Cấu hình hệ thống</h3>
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="form-label">Múi giờ</label>
                    <select v-model="settings.timezone" class="form-select">
                      <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
                      <option value="Asia/Bangkok">Thái Lan (UTC+7)</option>
                      <option value="Asia/Singapore">Singapore (UTC+8)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Ngôn ngữ</label>
                    <select v-model="settings.language" class="form-select">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Đơn vị tiền tệ</label>
                    <select v-model="settings.currency" class="form-select">
                      <option value="VND">Việt Nam Đồng (₫)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Settings -->
        <div v-if="activeTab === 'payment'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">Phương thức thanh toán</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="method in paymentMethods" :key="method.id" class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <component :is="method.icon" class="h-6 w-6 text-gray-600 mr-3" />
                  <span class="font-medium text-gray-900">{{ method.name }}</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="method.enabled" type="checkbox" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <p class="text-sm text-gray-600">{{ method.description }}</p>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">Bảo mật</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Mật khẩu hiện tại</label>
                <input type="password" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Mật khẩu mới</label>
                <input type="password" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Xác nhận mật khẩu mới</label>
                <input type="password" class="form-input">
              </div>
              <button class="btn btn-primary">Đổi mật khẩu</button>
            </div>

            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Xác thực hai bước</h4>
              <p class="text-sm text-gray-600">Tăng cường bảo mật cho tài khoản của bạn</p>
              <button class="btn btn-outline">Kích hoạt 2FA</button>
              
              <div class="mt-6">
                <h4 class="font-medium text-gray-900">Phiên đăng nhập</h4>
                <p class="text-sm text-gray-600 mb-3">Quản lý các thiết bị đã đăng nhập</p>
                <button class="btn btn-secondary">Xem phiên đăng nhập</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">Thông báo</h3>
          
          <div class="space-y-4">
            <div v-for="notification in notifications" :key="notification.id" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 class="font-medium text-gray-900">{{ notification.title }}</h4>
                <p class="text-sm text-gray-600">{{ notification.description }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="notification.enabled" type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
        <div class="flex justify-end space-x-3">
          <button class="btn btn-secondary">Hủy</button>
          <button @click="saveSettings" class="btn btn-primary">
            <CheckIcon class="h-4 w-4 mr-2" />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CogIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  CheckIcon,
  BanknotesIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

const activeTab = ref('general')

const tabs = [
  { id: 'general', name: 'Chung', icon: CogIcon },
  { id: 'payment', name: 'Thanh toán', icon: CreditCardIcon },
  { id: 'security', name: 'Bảo mật', icon: ShieldCheckIcon },
  { id: 'notifications', name: 'Thông báo', icon: BellIcon }
]

const settings = ref({
  storeName: 'Ludus Store',
  email: 'admin@ludus.com',
  phone: '0123456789',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  timezone: 'Asia/Ho_Chi_Minh',
  language: 'vi',
  currency: 'VND'
})

const paymentMethods = ref([
  {
    id: 'cod',
    name: 'COD (Thanh toán khi nhận hàng)',
    description: 'Khách hàng thanh toán khi nhận được sản phẩm',
    icon: BanknotesIcon,
    enabled: true
  },
  {
    id: 'credit_card',
    name: 'Thẻ tín dụng/ghi nợ',
    description: 'Thanh toán trực tuyến qua thẻ',
    icon: CreditCardIcon,
    enabled: true
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Thanh toán qua chuyển khoản',
    icon: BanknotesIcon,
    enabled: false
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: PhoneIcon,
    enabled: true
  }
])

const notifications = ref([
  {
    id: 'new_order',
    title: 'Đơn hàng mới',
    description: 'Thông báo khi có đơn hàng mới',
    enabled: true
  },
  {
    id: 'low_stock',
    title: 'Sắp hết hàng',
    description: 'Thông báo khi sản phẩm sắp hết',
    enabled: true
  },
  {
    id: 'payment_received',
    title: 'Thanh toán thành công',
    description: 'Thông báo khi nhận được thanh toán',
    enabled: false
  },
  {
    id: 'daily_report',
    title: 'Báo cáo hàng ngày',
    description: 'Gửi báo cáo tổng kết hàng ngày',
    enabled: true
  }
])

const saveSettings = () => {
  // Logic lưu cài đặt
  console.log('Saving settings...', settings.value)
  alert('Cài đặt đã được lưu thành công!')
}
</script>