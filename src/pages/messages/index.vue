<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Tin nhắn</h1>
        <p class="subtitle">Hỗ trợ khách hàng</p>
      </div>
    </div>

    <div class="page-content">
      <div class="messages-layout">
        <div class="conversations-list">
          <div class="search-box">
            <input type="text" placeholder="Tìm kiếm cuộc trò chuyện..." />
          </div>
          <div v-for="i in 10" :key="i" class="conversation-item" :class="{ active: i === 1 }">
            <div class="user-avatar"></div>
            <div class="conversation-info">
              <div class="conversation-header">
                <h4>Khách hàng {{ i }}</h4>
                <span class="time">{{ i }}h</span>
              </div>
              <p class="last-message">Tin nhắn cuối cùng từ khách hàng...</p>
            </div>
            <span v-if="i % 3 === 0" class="unread-badge">{{ i }}</span>
          </div>
        </div>

        <div class="chat-area">
          <div class="chat-header">
            <div class="user-info">
              <div class="user-avatar large"></div>
              <div>
                <h4>Khách hàng 1</h4>
                <span class="status online">Đang hoạt động</span>
              </div>
            </div>
          </div>

          <div class="messages-container">
            <div class="message received">
              <div class="message-avatar"></div>
              <div class="message-content">
                <p>Xin chào, tôi muốn hỏi về sản phẩm</p>
                <span class="message-time">10:30</span>
              </div>
            </div>

            <div class="message sent">
              <div class="message-content">
                <p>Dạ, shop có thể tư vấn giúp bạn</p>
                <span class="message-time">10:32</span>
              </div>
            </div>

            <div class="message received">
              <div class="message-avatar"></div>
              <div class="message-content">
                <p>Sản phẩm này còn hàng không ạ?</p>
                <span class="message-time">10:35</span>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <input type="text" placeholder="Nhập tin nhắn..." />
            <button class="btn-send">Gửi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.page-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  height: calc(100vh - 200px);
}

.messages-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 100%;
}

.conversations-list {
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
}

.search-box {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.search-box input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
}

.conversation-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.conversation-item:hover {
  background: #f9f9f9;
}

.conversation-item.active {
  background: #fef2f2;
  border-left: 3px solid #ef4444;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-avatar.large {
  width: 56px;
  height: 56px;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conversation-info h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 12px;
  color: #999;
}

.last-message {
  margin: 0;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  font-size: 13px;
  color: #666;
}

.status.online::before {
  content: '●';
  color: #16a34a;
  margin-right: 4px;
}

.messages-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 70%;
}

.message.received {
  align-self: flex-start;
}

.message.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  background: #f0f0f0;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-content {
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 12px;
}

.message.sent .message-content {
  background: #ef4444;
  color: white;
}

.message-content p {
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.5;
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message.sent .message-time {
  color: rgba(255,255,255,0.7);
}

.chat-input {
  padding: 16px 24px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  gap: 12px;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  font-size: 14px;
}

.btn-send {
  padding: 12px 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
}
</style>