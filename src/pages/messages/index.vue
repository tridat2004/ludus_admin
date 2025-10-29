<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tin nhắn</h1>
        <p class="text-gray-600">Hỗ trợ khách hàng</p>
      </div>
    </div>

    <!-- Messages Layout -->
    <div class="card overflow-hidden" style="height: calc(100vh - 250px);">
      <div class="grid grid-cols-12 h-full">
        <!-- Conversations List -->
        <div class="col-span-4 border-r border-gray-200 overflow-y-auto">
          <!-- Search -->
          <div class="p-4 border-b border-gray-200">
            <div class="relative">
              <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <!-- Conversations -->
          <div>
            <div
              v-for="i in 15"
              :key="i"
              class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="i === 1 ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''"
            >
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span class="font-semibold text-gray-700">{{ String.fromCharCode(65 + i) }}</span>
                  </div>
                  <span v-if="i % 3 === 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs">{{ i }}</span>
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-semibold text-gray-900 text-sm">Khách hàng {{ i }}</h4>
                    <span class="text-xs text-gray-500">{{ i }}h</span>
                  </div>
                  <p class="text-sm text-gray-600 truncate">Tin nhắn cuối cùng từ khách hàng...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="col-span-8 flex flex-col">
          <!-- Chat Header -->
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span class="font-semibold text-gray-700">A</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Khách hàng 1</h4>
                <span class="text-sm text-green-600 flex items-center">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 p-4 overflow-y-auto space-y-4">
            <!-- Received Message -->
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-semibold text-gray-700">A</span>
              </div>
              <div class="max-w-sm">
                <div class="bg-gray-100 rounded-lg rounded-tl-none p-3">
                  <p class="text-sm text-gray-900">Xin chào, tôi muốn hỏi về sản phẩm</p>
                </div>
                <span class="text-xs text-gray-500 mt-1 block">10:30</span>
              </div>
            </div>

            <!-- Sent Message -->
            <div class="flex items-start space-x-3 justify-end">
              <div class="max-w-sm">
                <div class="bg-primary-600 rounded-lg rounded-tr-none p-3">
                  <p class="text-sm text-white">Dạ, shop có thể tư vấn giúp bạn</p>
                </div>
                <span class="text-xs text-gray-500 mt-1 block text-right">10:32</span>
              </div>
            </div>

            <!-- Received Message -->
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-semibold text-gray-700">A</span>
              </div>
              <div class="max-w-sm">
                <div class="bg-gray-100 rounded-lg rounded-tl-none p-3">
                  <p class="text-sm text-gray-900">Sản phẩm này còn hàng không ạ?</p>
                </div>
                <span class="text-xs text-gray-500 mt-1 block">10:35</span>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button class="btn btn-primary">
                <PaperAirplaneIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})
</script>