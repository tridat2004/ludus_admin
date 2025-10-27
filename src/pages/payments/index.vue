<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Thanh toán</h1>
        <p class="subtitle">Quản lý các giao dịch thanh toán</p>
      </div>
      <button class="btn-primary">
        <span class="icon">+</span>
        Thêm thanh toán
      </button>
    </div>

    <div class="page-content">
      <div class="filters">
        <select class="filter-select">
          <option>Tất cả trạng thái</option>
          <option>Đã thanh toán</option>
          <option>Chờ xử lý</option>
          <option>Thất bại</option>
        </select>
        <input type="date" class="filter-date" />
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Khách hàng</th>
            <th>Số tiền</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 10" :key="i">
            <td>#PAY{{ 1000 + i }}</td>
            <td>Khách hàng {{ i }}</td>
            <td>{{ (Math.random() * 10000000).toFixed(0) }}đ</td>
            <td>
              <span class="badge">
                {{ ['Momo', 'VNPay', 'COD'][i % 3] }}
              </span>
            </td>
            <td>
              <span :class="['status', ['success', 'warning', 'danger'][i % 3]]">
                {{ ['Thành công', 'Đang xử lý', 'Thất bại'][i % 3] }}
              </span>
            </td>
            <td>{{ new Date().toLocaleDateString('vi-VN') }}</td>
            <td>
              <button class="btn-action">Chi tiết</button>
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

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-select, .filter-date {
  padding: 10px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
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

.badge {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.status {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.status.success {
  background: #dcfce7;
  color: #16a34a;
}

.status.warning {
  background: #fef3c7;
  color: #f59e0b;
}

.status.danger {
  background: #fee2e2;
  color: #ef4444;
}

.btn-action {
  padding: 6px 16px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
</style>