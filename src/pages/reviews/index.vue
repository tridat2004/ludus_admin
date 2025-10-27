<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý đánh giá</h1>
        <p class="text-gray-600">Quản lý đánh giá và phản hồi của khách hàng</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <StarIcon class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="stat-label">Đánh giá TB</p>
            <p class="stat-value">4.5/5</p>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ChatBubbleLeftIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="stat-label">Tổng đánh giá</p>
            <p class="stat-value">234</p>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="stat-label">Đã duyệt</p>
            <p class="stat-value">198</p>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="h-6 w-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="stat-label">Chờ duyệt</p>
            <p class="stat-value">36</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input v-model="searchQuery" type="text" placeholder="Tìm kiếm..." class="form-input">
          <select v-model="filterRating" class="form-select">
            <option value="">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          <select v-model="filterStatus" class="form-select">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          <button @click="resetFilters" class="btn btn-secondary">Đặt lại</button>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div v-for="review in filteredReviews" :key="review.id" class="card">
        <div class="card-body">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <img :src="review.productImage" class="h-16 w-16 rounded-lg object-cover">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ review.productName }}</h3>
                <div class="flex items-center mt-1">
                  <div class="flex">
                    <StarIcon v-for="i in 5" :key="i" 
                      class="h-4 w-4" 
                      :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" 
                    />
                  </div>
                  <span class="ml-2 text-sm text-gray-600">{{ review.rating }}/5</span>
                </div>
                <p class="mt-2 text-gray-700">{{ review.comment }}</p>
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ review.customerName }}</span>
                  <span>•</span>
                  <span>{{ formatDate(review.createdAt) }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <span class="badge" :class="getStatusClass(review.status)">
                {{ getStatusText(review.status) }}
              </span>
              <div class="flex items-center space-x-2">
                <button v-if="review.status === 'pending'" 
                  @click="approveReview(review.id)" 
                  class="text-green-600 hover:text-green-900"
                  title="Duyệt"
                >
                  <CheckCircleIcon class="h-5 w-5" />
                </button>
                <button @click="deleteReview(review.id)" 
                  class="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon, ChatBubbleLeftIcon, CheckCircleIcon, ClockIcon, TrashIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })

const searchQuery = ref('')
const filterRating = ref('')
const filterStatus = ref('')

const reviews = ref([
  {
    id: 1,
    productName: 'iPhone 15 Pro Max',
    productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
    customerName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sản phẩm rất tốt, chất lượng cao. Giao hàng nhanh chóng.',
    status: 'approved',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    productName: 'MacBook Pro M3',
    productImage: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop',
    customerName: 'Trần Thị B',
    rating: 4,
    comment: 'Máy chạy mượt, thiết kế đẹp. Giá hơi cao.',
    status: 'pending',
    createdAt: new Date('2024-01-14')
  }
])

const filteredReviews = computed(() => {
  return reviews.value.filter(r => {
    const matchSearch = !searchQuery.value || 
      r.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRating = !filterRating.value || r.rating === parseInt(filterRating.value)
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    return matchSearch && matchRating && matchStatus
  })
})

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

const getStatusClass = (status) => {
  return {
    'pending': 'badge-warning',
    'approved': 'badge-success',
    'rejected': 'badge-danger'
  }[status] || 'badge-secondary'
}

const getStatusText = (status) => {
  return {
    'pending': 'Chờ duyệt',
    'approved': 'Đã duyệt',
    'rejected': 'Từ chối'
  }[status] || 'Không xác định'
}

const approveReview = (id) => {
  const review = reviews.value.find(r => r.id === id)
  if (review) review.status = 'approved'
}

const deleteReview = (id) => {
  if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
    reviews.value = reviews.value.filter(r => r.id !== id)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterRating.value = ''
  filterStatus.value = ''
}
</script>