export const useMessages = () => {
  const conversations = ref([]);
  const selectedConversation = ref(null);
  const loading = ref(false);

  const fetchConversations = async () => {
    loading.value = true;
    // Gọi API để lấy danh sách cuộc trò chuyện
    conversations.value = await $fetch('/api/messages');
    loading.value = false;
  };

  const selectConversation = (id) => {
    selectedConversation.value = id;
  };

  return { conversations, selectedConversation, fetchConversations, selectConversation, loading };
};