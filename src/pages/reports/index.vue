<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Báo cáo</h1>
        <p class="subtitle">Thống kê và phân tích dữ liệu</p>
      </div>
      <div class="header-actions">
        <select class="filter-select">
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>90 ngày qua</option>
          <option>12 tháng qua</option>
        </select>
        <button class="btn-primary">
          📊 Xuất báo cáo
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-icon revenue">💰</div>
        <div class="summary-content">
          <p class="summary-label">Tổng doanh thu</p>
          <h3>₫125.8M</h3>
          <span class="trend positive">+15.3% so với kỳ trước</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon orders">📦</div>
        <div class="summary-content">
          <p class="summary-label">Tổng đơn hàng</p>
          <h3>3,847</h3>
          <span class="trend positive">+22.5% so với kỳ trước</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon customers">👥</div>
        <div class="summary-content">
          <p class="summary-label">Khách hàng mới</p>
          <h3>1,245</h3>
          <span class="trend positive">+8.7% so với kỳ trước</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon conversion">📈</div>
        <div class="summary-content">
          <p class="summary-label">Tỷ lệ chuyển đổi</p>
          <h3>3.2%</h3>
          <span class="trend negative">-0.5% so với kỳ trước</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="reports-grid">
      <div class="report-card large">
        <div class="card-header">
          <h3>Doanh thu theo thời gian</h3>
          <select class="chart-filter">
            <option>Theo ngày</option>
            <option>Theo tuần</option>
            <option>Theo tháng</option>
          </select>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder large">
            📊
            <p>Biểu đồ đường doanh thu theo thời gian</p>
          </div>
        </div>
      </div>

      <div class="report-card">
        <div class="card-header">
          <h3>Top sản phẩm</h3>
        </div>
        <div class="top-items-list">
          <div v-for="i in 5" :key="i" class="top-item">
            <span class="rank">#{{ i }}</span>
            <div class="item-info">
              <p class="item-name">Sản phẩm {{ i }}</p>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (100 - i * 15) + '%' }"></div>
              </div>
            </div>
            <span class="item-value">{{ (1000 - i * 100) }}</span>
          </div>
        </div>
      </div>

      <div class="report-card">
        <div class="card-header">
          <h3>Phân loại đơn hàng</h3>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            🥧
            <p>Biểu đồ tròn phân loại đơn hàng</p>
          </div>
        </div>
        <div class="legend">
          <div class="legend-item">
            <span class="legend-color success"></span>
            <span>Hoàn thành: 65%</span>
          </div>
          <div class="legend-item">
            <span class="legend-color warning"></span>
            <span>Đang xử lý: 25%</span>
          </div>
          <div class="legend-item">
            <span class="legend-color danger"></span>
            <span>Hủy: 10%</span>
          </div>
        </div>
      </div>

      <div class="report-card">
        <div class="card-header">
          <h3>Nguồn traffic</h3>
        </div>
        <div class="traffic-list">
          <div v-for="(source, i) in ['Direct', 'Google', 'Facebook', 'Instagram', 'Other']" :key="i" class="traffic-item">
            <div class="traffic-info">
              <span class="traffic-icon">🌐</span>
              <span>{{ source }}</span>
            </div>
            <div class="traffic-stats">
              <span class="traffic-percent">{{ (30 - i * 5) }}%</span>
              <span class="traffic-count">{{ (5000 - i * 800) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Table -->
    <div class="report-card">
      <div class="card-header">
        <h3>Chi tiết giao dịch gần đây</h3>
        <button class="btn-export">Xuất Excel</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Ngày</th>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 8" :key="i">
            <td>#TRX{{ 10000 + i }}</td>
            <td>{{ new Date().toLocaleDateString('vi-VN') }}</td>
            <td>Khách hàng {{ i }}</td>
            <td>Sản phẩm {{ i }}</td>
            <td>{{ i }}</td>
            <td>{{ (Math.random() * 10000000).toFixed(0) }}đ</td>
            <td>
              <span :class="['status', ['success', 'warning', 'danger'][i % 3]]">
                {{ ['Hoàn thành', 'Đang xử lý', 'Hủy'][i % 3] }}
              </span>
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

.header-actions {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
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
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  gap: 16px;
}

.summary-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.summary-icon.revenue {
  background: #dcfce7;
}

.summary-icon.orders {
  background: #dbeafe;
}

.summary-icon.customers {
  background: #fef3c7;
}

.summary-icon.conversion {
  background: #fce7f3;
}

.summary-content {
  flex: 1;
}

.summary-label {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.summary-content h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.trend {
  font-size: 13px;
  font-weight: 500;
}

.trend.positive {
  color: #16a34a;
}

.trend.negative {
  color: #ef4444;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.report-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.report-card.large {
  grid-column: span 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.chart-filter {
  padding: 6px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.chart-container {
  margin-top: 20px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
  font-size: 48px;
}

.chart-placeholder.large {
  height: 300px;
}

.chart-placeholder p {
  font-size: 14px;
  margin: 12px 0 0 0;
}

.top-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank {
  width: 32px;
  height: 32px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f97316);
  border-radius: 3px;
}

.item-value {
  font-weight: 600;
  color: #1a1a1a;
}

.legend {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.success {
  background: #16a34a;
}

.legend-color.warning {
  background: #f59e0b;
}

.legend-color.danger {
  background: #ef4444;
}

.traffic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.traffic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.traffic-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.traffic-icon {
  font-size: 20px;
}

.traffic-stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.traffic-percent {
  font-weight: 600;
  color: #1a1a1a;
}

.traffic-count {
  font-size: 13px;
  color: #666;
}

.btn-export {
  padding: 8px 16px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
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

@media (max-width: 1024px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .report-card.large {
    grid-column: span 1;
  }
}
</style>