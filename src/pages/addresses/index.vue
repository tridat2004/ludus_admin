<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Địa chỉ khách hàng</h1>
        <p class="text-gray-600">Quản lý địa chỉ giao hàng của khách hàng</p>
      </div>
    </div>

    <!-- Search -->
    <div class="card">
      <div class="card-body">
        <div class="relative">
          <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm địa chỉ hoặc khách hàng..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>

    <!-- Addresses Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 12" :key="i" class="card hover-lift">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span class="font-semibold text-gray-700">{{ String.fromCharCode(65 + i) }}</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Khách hàng {{ i }}</h4>
                <span v-if="i % 3 === 0" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Mặc định</span>
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <button class="btn-icon text-primary-600 hover:bg-primary-50">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button class="btn-icon text-red-600 hover:bg-red-50">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-start">
              <MapPinIcon class="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <span class="text-gray-700">Số {{ i * 10 }}, Đường ABC, Quận {{ i }}, Hà Nội</span>
            </div>
            <div class="flex items-center">
              <PhoneIcon class="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <span class="text-gray-700">098765432{{ i }}</span>
            </div>
            <div class="flex items-center">
              <span class="badge badge-secondary text-xs">{{ i % 2 === 0 ? 'Nhà riêng' : 'Văn phòng' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, MapPinIcon, PhoneIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})
</script>