<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
      <p class="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card">
      <div class="card-body text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Đang tải thông tin...</p>
      </div>
    </div>

    <template v-else>
      <!-- Profile Info Card -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Thông tin tài khoản</h2>
            <button 
              v-if="!editMode" 
              @click="editMode = true" 
              class="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <PencilIcon class="h-5 w-5" />
              Chỉnh sửa
            </button>
          </div>

          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- First Name -->
              <div>
                <label class="form-label required">Họ</label>
                <input 
                  v-model="profileForm.firstName" 
                  type="text" 
                  class="form-input"
                  :disabled="!editMode"
                  placeholder="Nhập họ"
                  minlength="2"
                >
              </div>

              <!-- Last Name -->
              <div>
                <label class="form-label required">Tên</label>
                <input 
                  v-model="profileForm.lastName" 
                  type="text" 
                  class="form-input"
                  :disabled="!editMode"
                  placeholder="Nhập tên"
                  minlength="2"
                >
              </div>

              <!-- Email -->
              <div>
                <label class="form-label required">Email</label>
                <input 
                  v-model="profileForm.email" 
                  type="email" 
                  class="form-input"
                  :disabled="!editMode"
                  placeholder="email@example.com"
                >
              </div>

              <!-- Phone -->
              <div>
                <label class="form-label required">Số điện thoại</label>
                <input 
                  v-model="profileForm.phoneNumber" 
                  type="tel" 
                  class="form-input"
                  :disabled="!editMode"
                  placeholder="0123456789"
                  pattern="^(0|\+84)(\d{9})$"
                >
              </div>

              <!-- Birthday -->
              <div>
                <label class="form-label required">Ngày sinh</label>
                <input 
                  v-model="profileForm.birthday" 
                  type="date" 
                  class="form-input"
                  :disabled="!editMode"
                  :max="maxBirthday"
                >
              </div>

              <!-- Gender -->
              <div>
                <label class="form-label required">Giới tính</label>
                <select 
                  v-model="profileForm.gender" 
                  class="form-select"
                  :disabled="!editMode"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <!-- User ID (Read only) -->
              <div class="md:col-span-2">
                <label class="form-label">ID tài khoản</label>
                <input 
                  :value="profile?.id || 'N/A'" 
                  type="text" 
                  class="form-input bg-gray-100 font-mono text-sm"
                  disabled
                >
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="editMode" class="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button" 
                @click="cancelEdit" 
                class="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-all duration-200"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg border-2 border-red-600 hover:bg-red-700 hover:border-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="updating"
              >
                {{ updating ? 'Đang lưu...' : 'Lưu thay đổi' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Reset Password Card -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-12 w-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-medium text-gray-900">Đặt lại mật khẩu</h3>
              <p class="mt-2 text-sm text-gray-600">
                Bạn muốn thay đổi mật khẩu? Chúng tôi sẽ gửi email với hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn.
              </p>
              <div class="mt-4">
                <button 
                  @click="handleSendResetEmail"
                  class="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="sendingEmail"
                >
                  <svg v-if="!sendingEmail" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ sendingEmail ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Info Card -->
      <div class="card bg-blue-50 border-blue-200">
        <div class="card-body">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Lưu ý khi cập nhật thông tin</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>Họ và tên phải có ít nhất 2 ký tự</li>
                  <li>Email phải đúng định dạng và chưa được sử dụng</li>
                  <li>Số điện thoại phải đúng định dạng Việt Nam (0xxxxxxxxx)</li>
                  <li>Người dùng phải đủ 18 tuổi</li>
                  <li>Thông tin chính xác giúp chúng tôi hỗ trợ bạn tốt hơn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/outline'
import useProfile from '~/composables/useProfile'
import { useNotification } from '~/composables/useNotfication'

definePageMeta({ layout: 'default' })

// Composables
const { getProfile, updateProfile, sendMailResetPassword } = useProfile()
const { notify } = useNotification()

const success = (msg) => notify(msg, 'success', 3000)
const error = (msg) => notify(msg, 'error', 4000)

// State
const loading = ref(true)
const updating = ref(false)
const sendingEmail = ref(false)
const editMode = ref(false)
const profile = ref(null)

// Profile Form
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  birthday: '',
  gender: ''
})

// Max birthday (18 years ago)
const maxBirthday = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return date.toISOString().split('T')[0]
})

// Format date to YYYY-MM-DD for input
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

// Fetch profile
const fetchProfile = async () => {
  loading.value = true
  try {
    const data = await getProfile()
    console.log('👤 Profile data:', data)
    
    if (data) {
      profile.value = data
      profileForm.value = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        birthday: formatDateForInput(data.birthday),
        gender: data.gender || ''
      }
    } else {
      error('Không thể tải thông tin cá nhân!')
    }
  } catch (err) {
    console.error('Error:', err)
    error(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông tin!')
  } finally {
    loading.value = false
  }
}

// Update profile
const handleUpdateProfile = async () => {
  // Validate
  if (!profileForm.value.firstName || profileForm.value.firstName.length < 2) {
    error('❌ Họ phải có ít nhất 2 ký tự!')
    return
  }
  if (!profileForm.value.lastName || profileForm.value.lastName.length < 2) {
    error('❌ Tên phải có ít nhất 2 ký tự!')
    return
  }
  if (!profileForm.value.email) {
    error('❌ Vui lòng nhập email!')
    return
  }
  if (!profileForm.value.phoneNumber) {
    error('❌ Vui lòng nhập số điện thoại!')
    return
  }
  if (!profileForm.value.birthday) {
    error('❌ Vui lòng chọn ngày sinh!')
    return
  }
  if (!profileForm.value.gender) {
    error('❌ Vui lòng chọn giới tính!')
    return
  }

  updating.value = true
  try {
    const result = await updateProfile(profileForm.value)
    console.log('✅ Update result:', result)
    
    if (result) {
      success('✅ Cập nhật thông tin thành công!')
      profile.value = { ...profile.value, ...result }
      editMode.value = false
    } else {
      error('❌ Cập nhật thất bại!')
    }
  } catch (err) {
    console.error('Update error:', err)
    error('❌ ' + (err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật!'))
  } finally {
    updating.value = false
  }
}

// Cancel edit
const cancelEdit = () => {
  editMode.value = false
  // Reset form to original values
  if (profile.value) {
    profileForm.value = {
      firstName: profile.value.firstName || '',
      lastName: profile.value.lastName || '',
      email: profile.value.email || '',
      phoneNumber: profile.value.phoneNumber || '',
      birthday: formatDateForInput(profile.value.birthday),
      gender: profile.value.gender || ''
    }
  }
}

// Send reset password email
const handleSendResetEmail = async () => {
  if (!confirm('📧 Bạn có chắc muốn gửi email đặt lại mật khẩu?\n\nEmail sẽ được gửi đến: ' + profile.value?.email)) {
    return
  }

  sendingEmail.value = true
  try {
    const result = await sendMailResetPassword()
    console.log('📧 Send email result:', result)
    
    if (result && result.success !== false) {
      success('✅ Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.')
    } else {
      error(result?.message || '❌ Gửi email thất bại!')
    }
  } catch (err) {
    console.error('Send email error:', err)
    error('❌ ' + (err.response?.data?.message || 'Đã xảy ra lỗi khi gửi email!'))
  } finally {
    sendingEmail.value = false
  }
}

// Initialize
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.required::after { 
  content: " *"; 
  color: #ef4444; 
}
</style>