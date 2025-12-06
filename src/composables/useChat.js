import { ref, nextTick } from "vue";
import { io } from "socket.io-client";
import axios from "axios";

export const useChat = () => {
  const config = useRuntimeConfig();

  const API = config.public.apiBase + "/chat";
  const SOCKET_URL = config.public.apiBase;

  // ======= GLOBAL STATE =======
  const chatList = useState("chatList", () => []);
  const messages = useState("messages", () => []);
  const activeUser = useState("activeUser", () => null);
  const messageText = useState("messageText", () => "");
  const typingUserId = useState("typingUserId", () => null);

  const pagination = useState("pagination", () => ({
    cursor: null,
    hasMore: true
  }));

  const loadingMore = useState("loadingMore", () => false);
  const uploadingFile = useState("uploadingFile", () => false);

  const msgBox = ref(null);

  // ======= LOGIN USER (Admin/User) =======
  const userId = useState("userId", () => null);

  const loadCurrentUser = async () => {
    try {
      const res = await axios.get(`${config.public.apiBase}/me`, {
        withCredentials: true
      });

      userId.value = res.data.data?.id;
      console.log("⭐ Current userId:", userId.value);

    } catch (err) {
      console.error("❌ Failed to load /me:", err);
    }
  };

  // Load user info on client
  if (process.client && !userId.value) {
    loadCurrentUser();
  }

  // ===== SOCKET SINGLETON =====
  const socket = useState("socket", () => null);

  if (process.client && !socket.value) {
    socket.value = io(SOCKET_URL, { withCredentials: true });

    // Receive real-time messages
    socket.value.on("chat:new_message", (data) => {
      if (
        activeUser.value &&
        (data.message.senderId === activeUser.value.id ||
          data.message.receiverId === activeUser.value.id)
      ) {
        messages.value.push(data.message);
        scrollBottom();
      }

      loadChatList();
    });

    // Typing indicator
    socket.value.on("chat:user_typing", (data) => {
      typingUserId.value = data.isTyping ? data.senderId : null;
    });
  }

  // ===== LOAD CHAT LIST =====
  const loadChatList = async () => {
    try {
      const res = await axios.get(`${API}/list`, { withCredentials: true });
      chatList.value = res.data.data;
    } catch (err) {
      console.error("❌ Failed to load chat list:", err);
    }
  };

  // ===== LOAD MESSAGES =====
  const loadMessages = async () => {
    if (!activeUser.value) return;

    try {
      loadingMore.value = true;

      const res = await axios.get(`${API}/messages/${activeUser.value.id}`, {
        params: { cursor: pagination.value.cursor, limit: 30 },
        withCredentials: true
      });

      const data = res.data.data;

      messages.value = [...data.messages, ...messages.value];
      pagination.value.cursor = data.pagination.nextCursor;
      pagination.value.hasMore = data.pagination.hasMore;

    } catch (err) {
      console.error("❌ Failed to load messages:", err);
    } finally {
      loadingMore.value = false;
    }
  };

  // ===== SELECT USER =====
  const selectUser = async (user) => {
    activeUser.value = user;

    messages.value = [];
    pagination.value = { cursor: null, hasMore: true };

    await loadMessages();
    scrollBottom();

    socket.value.emit("chat:read_messages", { senderId: user.id });
  };

  // ===== SEND TEXT MESSAGE =====
  const sendTextMessage = () => {
    if (!messageText.value.trim()) return;

    const content = messageText.value;
    messageText.value = "";

    socket.value.emit(
      "chat:send_message",
      {
        receiverId: activeUser.value.id,
        content,
        filePath: null
      },
      (res) => {
        if (res.success) {
          messages.value.push(res.message);
          scrollBottom();
        }
      }
    );
  };

  // ===== SEND FILE MESSAGE =====
  const sendFileMessage = async (file) => {
    if (!file || !activeUser.value) return;

    try {
      uploadingFile.value = true;

      // 1. Upload file
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post(`${API}/upload-file`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (!uploadRes.data.success) {
        throw new Error("Upload failed");
      }

      const fileUrl = uploadRes.data.data.fileUrl;

      // 2. Send message
      socket.value.emit(
        "chat:send_message",
        {
          receiverId: activeUser.value.id,
          content: "",
          filePath: fileUrl
        },
        (res) => {
          if (res.success) {
            messages.value.push(res.message);
            scrollBottom();
          }
        }
      );

    } catch (err) {
      console.error("❌ File send error:", err);
    } finally {
      uploadingFile.value = false;
    }
  };

  // ===== TYPING =====
  const emitTyping = () => {
    if (!activeUser.value) return;

    socket.value.emit("chat:typing", {
      receiverId: activeUser.value.id,
      isTyping: true
    });
  };

  // ===== SCROLL EVENT =====
  const handleScroll = (e) => {
    if (pagination.value.hasMore && !loadingMore.value && e.target.scrollTop === 0) {
      loadMessages();
    }
  };

  // ===== SCROLL TO BOTTOM =====
  const scrollBottom = () => {
    nextTick(() => {
      if (msgBox.value) {
        msgBox.value.scrollTop = msgBox.value.scrollHeight;
      }
    });
  };

  // ===== CLEANUP =====
  const cleanup = () => {
    if (!socket.value) return;

    socket.value.off("chat:new_message");
    socket.value.off("chat:user_typing");
  };

  return {
    chatList,
    messages,
    activeUser,
    messageText,
    typingUserId,
    msgBox,
    loadingMore,
    uploadingFile,
    userId,

    loadChatList,
    selectUser,
    sendTextMessage,
    sendFileMessage,
    emitTyping,
    handleScroll,
    cleanup
  };
};
