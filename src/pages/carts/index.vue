<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Giỏ hàng</h1>
        <p class="text-gray-600">Quản lý giỏ hàng của khách hàng</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="card-body text-center">
          <p class="text-sm text-gray-600 mb-2">Tổng giỏ hàng</p>
          <h3 class="text-3xl font-bold text-gray-900">456</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <p class="text-sm text-gray-600 mb-2">Giá trị trung bình</p>
          <h3 class="text-3xl font-bold text-gray-900">{{ formatCurrency(2500000) }}</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <p class="text-sm text-gray-600 mb-2">Giỏ hàng bỏ quên</p>
          <h3 class="text-3xl font-bold text-yellow-600">89</h3>
        </div>
      </div>
    </div>

    <!-- Carts Table -->
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
              <th>Ngày thêm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 15" :key="i">
              <td>
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span class="font-semibold text-gray-700 text-sm">{{ String.fromCharCode(65 + i) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">Khách hàng {{ i }}</p>
                    <p class="text-sm text-gray-500">customer{{ i }}@email.com</p>
                  </div>
                </div>
              </td>
              <td class="text-gray-900">Sản phẩm {{ i }}</td>
              <td class="text-center">{{ i }}</td>
              <td class="text-gray-900">{{ formatCurrency((Math.random() * 5000000) + 1000000) }}</td>
              <td class="font-semibold text-gray-900">{{ formatCurrency((Math.random() * 10000000) + 2000000) }}</td>
              <td class="text-gray-600">{{ new Date().toLocaleDateString('vi-VN') }}</td>
              <td>
                <button class="btn btn-outline btn-sm text-red-600 hover:bg-red-50">
                  <TrashIcon class="h-4 w-4 mr-1" />
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline'

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