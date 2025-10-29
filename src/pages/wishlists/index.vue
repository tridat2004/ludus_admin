<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Danh sách yêu thích</h1>
        <p class="text-gray-600">Sản phẩm yêu thích của khách hàng</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-body text-center">
          <p class="text-sm text-gray-600 mb-2">Tổng sản phẩm yêu thích</p>
          <h3 class="text-3xl font-bold text-gray-900">1,234</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <p class="text-sm text-gray-600 mb-2">Tỷ lệ chuyển đổi</p>
          <h3 class="text-3xl font-bold text-green-600">12.5%</h3>
        </div>
      </div>
    </div>

    <!-- Wishlist Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 16" :key="i" class="card group hover-lift">
        <div class="aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 rounded-t-lg"></div>
        <div class="card-body">
          <h4 class="font-semibold text-gray-900 mb-1">Sản phẩm {{ i }}</h4>
          <p class="text-lg font-bold text-primary-600 mb-3">{{ formatCurrency((Math.random() * 10000000) + 1000000) }}</p>
          
          <div class="flex items-center space-x-2 mb-3 text-sm text-gray-600">
            <div class="w-6 h-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full"></div>
            <span>Khách hàng {{ i }}</span>
          </div>
          
          <p class="text-xs text-gray-500 mb-3">Thêm: {{ new Date().toLocaleDateString('vi-VN') }}</p>
          
          <button class="w-full btn btn-outline btn-sm text-red-600 hover:bg-red-50">
            <HeartIcon class="h-4 w-4 mr-1 fill-current" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
</script>