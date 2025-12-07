<template>
  <div class="flex h-[80vh] bg-gray-50 max-w-[1300px] mx-auto mt-6 mb-6">


    
    <!-- ========== LEFT SIDEBAR ========== -->
    <div class="w-72 bg-white border-r border-gray-200 flex flex-col">

      
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-100">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Tin nhắn</h1>
        
                  <!-- Search Bar -->
        <div class="relative">
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            class="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>
      </div>

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="chat in filteredChats"
          :key="chat.otherUser.id"
          @click="$emit('select', chat.otherUser)"
          class="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-50"
          :class="activeUser?.id === chat.otherUser.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''"
        >
          <div class="flex items-center space-x-3">
            
            <!-- Avatar with Online Status -->
            <div class="relative">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 
  flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {{ initials(chat.otherUser.firstName, chat.otherUser.lastName) }}
              </div>
              <span v-if="chat.online" class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <!-- Chat Info -->
            <div class="flex-1 px-4 py-4 overflow-y-auto bg-gray-50">
              <div class="flex items-center justify-between mb-1">
                <p class="font-semibold text-gray-800 truncate">
                  {{ chat.otherUser.firstName }} {{ chat.otherUser.lastName }}
                </p>
                <span class="text-xs text-gray-400">15:30</span>
              </div>
              
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 truncate flex-1">
                  {{ chat.lastMessage?.content || 'Chưa có tin nhắn' }}
                </p>
                <span v-if="chat.unreadCount > 0" class="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-full">
                  {{ chat.unreadCount }}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- ========== RIGHT CHAT AREA ========== -->
    <div class="flex-1 flex flex-col bg-white">

      <!-- Empty State -->
      <div v-if="!activeUser" class="flex-1 flex flex-col items-center justify-center text-gray-400">
        <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-xl font-medium text-gray-500">Chọn cuộc trò chuyện để bắt đầu</p>
        <p class="text-sm text-gray-400 mt-2">Nhắn tin với bạn bè và đồng nghiệp của bạn</p>
      </div>

      <!-- Chat Window -->
      <template v-else>
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">

          <div class="flex items-center space-x-4">
            
            <!-- Avatar -->
            <div class="relative">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                {{ initials(activeUser.firstName, activeUser.lastName) }}
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <!-- User Info -->
            <div>
              <p class="font-semibold text-gray-800 text-lg">
                {{ activeUser.firstName }} {{ activeUser.lastName }}
              </p>
              <p v-if="typingUserId === activeUser.id" class="text-sm text-orange-500 flex items-center">
                <span class="flex space-x-1 mr-2">
                  <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                  <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                  <span class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                </span>
                Đang nhập...
              </p>
              <p v-else class="text-sm text-green-500 flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Đang hoạt động
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <button class="p-2.5 hover:bg-gray-100 rounded-full transition">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button class="p-2.5 hover:bg-gray-100 rounded-full transition">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button class="p-2.5 hover:bg-gray-100 rounded-full transition">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div  ref="msgBox"
  class="flex-1 px-6 py-6 overflow-y-auto bg-gray-50"
  :style="`background-image: url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60');`"
  @scroll="$emit('scroll', $event)"
>

          
          <!-- Date Divider -->
          <div class="flex items-center justify-center my-6">
            <div class="px-4 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
              <span class="text-xs font-medium text-gray-500">Hôm nay</span>
            </div>
          </div>

          <!-- Messages -->
          <div class="space-y-2">
  <div
    v-for="msg in messages"
    :key="msg.id"
    class="flex items-end space-x-2"
    :class="msg.senderId === userId ? 'flex-row-reverse space-x-reverse' : ''"

  >
    <!-- Avatar bên trái khi nhận -->
    <div
      v-if="msg.senderId !== userId"
      class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 
      flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
    >
      {{ initials(activeUser.firstName, activeUser.lastName) }}
    </div>

    <!-- Bubble -->
    <div class="max-w-md">
      <div
        class="rounded-2xl px-3 py-2 shadow-sm max-w-sm"
        :class="msg.senderId === userId 
        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-br-sm'
        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'"

      >
        <!-- File -->
        <!-- Image Preview -->
<div v-if="msg.filePath && isImage(msg.filePath)" class="mb-2">
  <img
    :src="msg.filePath"
    class="rounded-xl max-w-[220px] shadow cursor-pointer"
    @click="window.open(msg.filePath, '_blank')"
  />
</div>

<!-- File Attachment (non-image) -->
<div v-else-if="msg.filePath" class="mb-2">
  <a
    :href="msg.filePath"
    target="_blank"
    class="flex items-center space-x-2 p-2 rounded-lg transition"
    :class="msg.senderId === userId ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-50 hover:bg-gray-100'"
  >
    <div class="p-2 rounded-lg" :class="msg.senderId === userId ? 'bg-white/30' : 'bg-orange-100'">
      <svg class="w-4 h-4" :class="msg.senderId === userId ? 'text-white' : 'text-orange-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">File đính kèm</p>
      <p class="text-xs opacity-75">Nhấn để tải xuống</p>
    </div>
  </a>
</div>


        <!-- Message Text -->
        <p v-if="msg.content" class="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {{ msg.content }}
        </p>
      </div>

      <!-- Timestamp -->
      <p class="text-xs mt-1.5 px-1" :class="msg.senderId === userId ? 'text-right text-gray-400' : 'text-gray-400'">
        {{ formatTime(msg.createdAt) }}

        <span v-if="msg.senderId === userId" class="ml-1">
          <span v-if="msg.isRead" class="text-blue-500">✓✓</span>
          <span v-else class="text-gray-400">✓</span>
        </span>
      </p>
    </div>
  </div>
</div>


          <!-- Uploading Indicator -->
          <div v-if="uploadingFile" class="flex justify-end mt-4">
            <div class="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
              <div class="flex items-center space-x-3">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm font-medium">Đang gửi file...</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Input Area -->
        <div class="px-6 py-4 bg-white border-t border-gray-200">
          <div class="flex items-end space-x-3">
            
            <!-- File Upload Button -->
            <label class="cursor-pointer p-3 hover:bg-gray-100 rounded-xl transition flex-shrink-0">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <input type="file" class="hidden" @change="onFileUpload">
            </label>

            <!-- Message Input -->
            <div class="flex-1 bg-gray-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 transition">
              <textarea
                v-model="input"
                rows="1"
                placeholder="Nhập tin nhắn..."
                @input="handleInput"
                @keydown.enter.exact.prevent="$emit('send')"

                class="w-full bg-transparent text-sm resize-none focus:outline-none max-h-32"
                style="min-height: 24px"
              ></textarea>
            </div>

            <!-- Emoji Button -->
            <button class="p-3 hover:bg-gray-100 rounded-xl transition flex-shrink-0">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <!-- Send Button -->
            <button
              @click="$emit('send')"
              :disabled="!input.trim() && !uploadingFile"
              class="p-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>

          </div>
        </div>

      </template>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { watch, nextTick } from "vue";
const props = defineProps({
  chatList: Array,
  messages: Array,
  activeUser: Object,
  typingUserId: Number,
  userId: String,
  inputModel: String,
  uploadingFile: Boolean,
});

watch(
  () => props.messages,
  async () => {
    await nextTick();
    if (msgBox.value) {
      msgBox.value.scrollTop = msgBox.value.scrollHeight;
    }
  },
  { deep: true }
);

const emit = defineEmits(["send", "typing", "scroll", "file", "select", "update:inputModel"]);

const input = computed({
  get: () => props.inputModel,
  set: (val) => emit("update:inputModel", val)
});

const msgBox = ref(null);
defineExpose({ msgBox });

const search = ref("");

const initials = (f, l) => `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

const filteredChats = computed(() => {
  if (!search.value) return props.chatList;
  const q = search.value.toLowerCase();
  return props.chatList.filter((c) => {
    const name = `${c.otherUser.firstName} ${c.otherUser.lastName}`.toLowerCase();
    return name.includes(q);
  });
});
const isImage = (filePath) => {
  if (!filePath) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
};

const onFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) emit("file", file);
  e.target.value = "";
};

const handleInput = (e) => {
  emit("typing");
  // Auto-resize textarea
  e.target.style.height = "auto";
  e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
};

const formatTime = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("vi-VN", { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
};
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth animations */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>