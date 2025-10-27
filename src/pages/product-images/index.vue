<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Hình ảnh sản phẩm</h1>
        <p class="subtitle">Quản lý hình ảnh cho các sản phẩm</p>
      </div>
      <button class="btn-primary">
        <span class="icon">+</span>
        Thêm hình ảnh
      </button>
    </div>

    <div class="page-content">
      <div class="search-bar">
        <input type="text" placeholder="Tìm kiếm hình ảnh..." />
      </div>

      <div class="image-grid">
        <div v-for="i in 8" :key="i" class="image-card">
          <div class="image-placeholder"></div>
          <div class="image-info">
            <h4>Sản phẩm {{ i }}</h4>
            <p>{{ i * 3 }} ảnh</p>
          </div>
          <div class="card-actions">
            <button class="btn-icon">✏️</button>
            <button class="btn-icon">🗑️</button>
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.btn-primary {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 18px;
}

.page-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.search-bar {
  margin-bottom: 24px;
}

.search-bar input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.image-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 150px;
  background: #f5f5f5;
}

.image-info {
  padding: 12px;
}

.image-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.image-info p {
  margin: 0;
  color: #999;
  font-size: 13px;
}

.card-actions {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px 12px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
</style>