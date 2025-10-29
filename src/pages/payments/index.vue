<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Thanh toán</h1>
        <p class="text-gray-600">Quản lý các giao dịch thanh toán</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tổng thanh toán</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(125800000) }}</h3>
              <p class="text-xs text-green-600 mt-1">+15.3% so với kỳ trước</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCardIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Giao dịch thành công</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">3,847</h3>
              <p class="text-xs text-green-600 mt-1">+22.5% so với kỳ trước</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Đang xử lý</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">45</h3>
              <p class="text-xs text-yellow-600 mt-1">Cần xử lý</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="date" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Tất cả trạng thái</option>
            <option>Thành công</option>
            <option>Đang xử lý</option>
            <option>Thất bại</option>
          </select>
          <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Tất cả phương thức</option>
            <option>Momo</option>
            <option>VNPay</option>
            <option>COD</option>
          </select>
          <button class="btn btn-outline">
            <FunnelIcon class="h-4 w-4 mr-2" />
            Lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Mã GD</th>
              <th>Khách hàng</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Ngày GD</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 15" :key="i">
              <td>
                <span class="font-medium text-primary-600">#PAY{{ 1000 + i }}</span>
              </td>
              <td>
                <div>
                  <p class="font-medium text-gray-900">Khách hàng {{ i }}</p>
                  <p class="text-sm text-gray-500">customer{{ i }}@email.com</p>
                </div>
              </td>
              <td class="font-semibold text-gray-900">{{ formatCurrency((Math.random() * 10000000) + 500000) }}</td>
              <td>
                <span class="badge badge-secondary">
                  {{ getPaymentMethod(i % 3) }}
                </span>
              </td>
              <td>
                <span :class="getStatusBadge(i % 3)">
                  {{ getStatusText(i % 3) }}
                </span>
              </td>
              <td class="text-gray-600">{{ new Date().toLocaleDateString('vi-VN') }}</td>
              <td>
                <button class="btn btn-outline btn-sm">
                  Chi tiết
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
import { CreditCardIcon, CheckCircleIcon, ClockIcon, FunnelIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getPaymentMethod = (index) => {
  const methods = ['Momo', 'VNPay', 'COD']
  return methods[index]
}

const getStatusBadge = (index) => {
  const badges = ['badge badge-success', 'badge badge-warning', 'badge badge-danger']
  return badges[index]
}

const getStatusText = (index) => {
  const texts = ['Thành công', 'Đang xử lý', 'Thất bại']
  return texts[index]
}
</script>