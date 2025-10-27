<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Địa chỉ</h1>
        <p class="subtitle">Quản lý địa chỉ giao hàng của khách hàng</p>
      </div>
      <button class="btn-primary">
        <span class="icon">+</span>
        Thêm địa chỉ
      </button>
    </div>

    <div class="page-content">
      <div class="search-bar">
        <input type="text" placeholder="Tìm kiếm địa chỉ hoặc khách hàng..." />
      </div>

      <div class="address-list">
        <div v-for="i in 8" :key="i" class="address-card">
          <div class="address-header">
            <div>
              <h4>Khách hàng {{ i }}</h4>
              <span v-if="i % 3 === 0" class="default-badge">Mặc định</span>
            </div>
            <div class="card-actions">
              <button class="btn-icon">✏️</button>
              <button class="btn-icon">🗑️</button>
            </div>
          </div>
          <div class="address-details">
            <p><strong>Địa chỉ:</strong> Số {{ i * 10 }}, Đường ABC, Quận {{ i }}, Hà Nội</p>
            <p><strong>SĐT:</strong> 098765432{{ i }}</p>
            <p><strong>Loại:</strong> <span class="type-badge">{{ ['Nhà riêng', 'Văn phòng'][i % 2] }}</span></p>
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

.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.address-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.address-header h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.default-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 4px 8px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.address-details p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.address-details strong {
  color: #1a1a1a;
  font-weight: 500;
}

.type-badge {
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 13px;
}
</style>