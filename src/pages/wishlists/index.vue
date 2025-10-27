<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Danh sách yêu thích</h1>
        <p class="subtitle">Sản phẩm yêu thích của khách hàng</p>
      </div>
    </div>

    <div class="page-content">
      <div class="wishlist-grid">
        <div v-for="i in 12" :key="i" class="wishlist-card">
          <div class="product-image"></div>
          <div class="wishlist-info">
            <h4>Sản phẩm {{ i }}</h4>
            <p class="price">{{ (Math.random() * 10000000).toFixed(0) }}đ</p>
            <div class="user-info">
              <div class="user-avatar"></div>
              <span>Khách hàng {{ i }}</span>
            </div>
            <p class="date">Thêm: {{ new Date().toLocaleDateString('vi-VN') }}</p>
          </div>
          <button class="btn-remove">❤️ Xóa</button>
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
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.wishlist-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.wishlist-info {
  padding: 16px;
}

.wishlist-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.price {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #ef4444;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  background: #f0f0f0;
  border-radius: 50%;
}

.user-info span {
  font-size: 13px;
  color: #666;
}

.date {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.btn-remove {
  width: 100%;
  padding: 12px;
  border: none;
  border-top: 1px solid #f0f0f0;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;
}

.btn-remove:hover {
  background: #fef2f2;
}
</style>