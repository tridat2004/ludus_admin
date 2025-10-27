<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Giỏ hàng</h1>
        <p class="subtitle">Quản lý giỏ hàng của khách hàng</p>
      </div>
    </div>

    <div class="page-content">
      <table class="data-table">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng</th>
            <th>Ngày thêm</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 10" :key="i">
            <td>
              <div class="user-info">
                <div class="user-avatar"></div>
                <span>Khách hàng {{ i }}</span>
              </div>
            </td>
            <td>Sản phẩm {{ i }}</td>
            <td>{{ i }}</td>
            <td>{{ (Math.random() * 5000000).toFixed(0) }}đ</td>
            <td><strong>{{ (Math.random() * 10000000).toFixed(0) }}đ</strong></td>
            <td>{{ new Date().toLocaleDateString('vi-VN') }}</td>
            <td>
              <button class="btn-action danger">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
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
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.data-table th {
  text-align: left;
  padding: 12px;
  background: #f9f9f9;
  font-weight: 500;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid #e5e5e5;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: #f0f0f0;
  border-radius: 50%;
}

.btn-action {
  padding: 6px 16px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.btn-action.danger {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-action.danger:hover {
  background: #fef2f2;
}
</style>