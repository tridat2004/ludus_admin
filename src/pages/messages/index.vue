<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import ChatWindow from "@/components/ui/ChatWindow.vue"; 
import { useChat } from "@/composables/useChat";

// ⭐ Dùng useChat
const {
  chatList,
  messages,
  activeUser,
  messageText,
  typingUserId,
  uploadingFile,
  userId,

  loadChatList,
  selectUser,
  sendTextMessage,
  sendFileMessage,
  emitTyping,
  handleScroll,
  cleanup,
  msgBox,
} = useChat();

// Khi mount → load chat list
onMounted(async () => {
  await loadChatList();
});

// Khi rời trang → cleanup socket listener
onBeforeUnmount(() => {
  cleanup();
});
</script>

<template>
  <ChatWindow
    :chatList="chatList"
    :messages="messages"
    :activeUser="activeUser"
    :typingUserId="typingUserId"
    :userId="userId"
    :inputModel="messageText"
    :uploadingFile="uploadingFile"

    @select="selectUser"
    @send="sendTextMessage"
    @file="sendFileMessage"
    @typing="emitTyping"
    @scroll="handleScroll"
    @update:inputModel="val => messageText = val"
  />
</template>

<style scoped>
/* Optional - responsive */
</style>
