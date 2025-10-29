<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Hình ảnh sản phẩm</h1>
        <p class="text-gray-600">Quản lý hình ảnh cho các sản phẩm</p>
      </div>
      
      <button class="btn btn-primary">
        <PlusIcon class="h-4 w-4 mr-2" />
        Thêm hình ảnh
      </button>
    </div>

    <!-- Search -->
    <div class="card">
      <div class="card-body">
        <div class="relative">
          <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>

    <!-- Image Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 12" :key="i" class="card group hover-lift">
        <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <PhotoIcon class="h-16 w-16" />
          </div>
        </div>
        <div class="card-body">
          <h4 class="font-semibold text-gray-900 mb-1">Sản phẩm {{ i }}</h4>
          <p class="text-sm text-gray-600 mb-3">{{ i * 3 }} ảnh</p>
          <div class="flex items-center space-x-2">
            <button class="flex-1 btn btn-outline btn-sm">
              <EyeIcon class="h-4 w-4 mr-1" />
              Xem
            </button>
            <button class="btn-icon text-primary-600 hover:bg-primary-50">
              <PencilIcon class="h-4 w-4" />
            </button>
            <button class="btn-icon text-red-600 hover:bg-red-50">
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, MagnifyingGlassIcon, PhotoIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})
</script>