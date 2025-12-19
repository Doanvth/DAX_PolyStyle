<template>
  <div class="admin-container">

    <div class="dashboard-header">
      <div class="header-left">
        <h2 class="dashboard-title">Tổng Quan Kinh Doanh</h2>
        <p class="text-muted">Cập nhật lúc: {{ new Date().toLocaleString('vi-VN') }}</p>
      </div>
      <div class="header-right">
        <select class="period-select">
          <option>Tháng này</option>
          <option>Quý này</option>
          <option>Năm nay</option>
        </select>
        <button class="btn-primary-custom">
          <i class="bi bi-download"></i> Xuất báo cáo
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="bi bi-currency-dollar"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">Doanh thu tháng</p>
          <h3 class="stat-value">1.25 Tỷ ₫</h3>
          <span class="stat-trend up">
            <i class="bi bi-arrow-up-short"></i> 12.5%
          </span>
        </div>
        <div class="mini-chart-bg"></div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="bi bi-bag-check-fill"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">Đơn hàng mới</p>
          <h3 class="stat-value">2,450</h3>
          <span class="stat-trend down">
            <i class="bi bi-arrow-down-short"></i> 3.2%
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="bi bi-box-seam-fill"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">Cần nhập hàng</p>
          <h3 class="stat-value">35 SP</h3>
          <span class="stat-trend neutral">
            Kho thấp
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <i class="bi bi-people-fill"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">Khách hàng mới</p>
          <h3 class="stat-value">+480</h3>
          <span class="stat-trend up">
            <i class="bi bi-arrow-up-short"></i> 8.4%
          </span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid-main">
      <div class="card-box chart-container">
        <div class="card-header-flex">
          <h5 class="card-title">Biểu đồ doanh thu 12 tháng</h5>
          <div class="chart-legend">
            <span class="dot-revenue"></span> Doanh thu
          </div>
        </div>

        <div class="bar-chart-wrapper">
          <div class="y-axis">
            <span>2 Tỷ</span>
            <span>1.5 Tỷ</span>
            <span>1 Tỷ</span>
            <span>500 Tr</span>
            <span>0</span>
          </div>
          <div class="bars-area">
            <div v-for="(item, index) in revenueData" :key="index" class="bar-group">
              <div class="bar-fill" :style="{ height: item.percent + '%' }">
                <div class="tooltip">{{ item.value }}</div>
              </div>
              <span class="x-label">{{ item.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card-box category-container">
        <h5 class="card-title">Xu hướng danh mục</h5>
        <div class="category-list">
          <div v-for="cat in categoryTrends" :key="cat.name" class="cat-item">
            <div class="cat-header">
              <span class="cat-name">
                <i :class="cat.icon"></i> {{ cat.name }}
              </span>
              <span class="cat-value">{{ cat.value }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :class="cat.trend" :style="{ width: cat.value + '%' }">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid-bottom">

      <div class="card-box">
        <div class="card-header-flex">
          <h5 class="card-title">Top Sản Phẩm Bán Chạy</h5>
          <a href="#" class="view-all">Xem tất cả</a>
        </div>
        <div class="table-responsive">
          <table class="simple-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th class="text-right">Đã bán</th>
                <th class="text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prod, idx) in bestSellingProducts" :key="prod.id">
                <td>
                  <div class="prod-cell">
                    <span class="rank-badge" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
                    <img :src="prod.image" class="prod-img">
                    <span class="fw-bold">{{ prod.name }}</span>
                  </div>
                </td>
                <td><span class="badge-gray">{{ prod.category }}</span></td>
                <td class="text-right fw-bold">{{ prod.sales }}</td>
                <td class="text-right text-blue">{{ prod.revenue }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-box">
        <h5 class="card-title">Hoạt động gần đây</h5>
        <div class="timeline">
          <div v-for="(act, index) in recentActivities" :key="index" class="timeline-item">
            <div class="timeline-dot" :class="act.type"></div>
            <div class="timeline-content">
              <p class="timeline-text" v-html="act.text"></p>
              <span class="timeline-time">{{ act.time }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dữ liệu biểu đồ doanh thu
const revenueData = ref([
  { month: 'T1', value: '800Tr', percent: 40 },
  { month: 'T2', value: '950Tr', percent: 48 },
  { month: 'T3', value: '1.1Tỷ', percent: 55 },
  { month: 'T4', value: '1.0Tỷ', percent: 50 },
  { month: 'T5', value: '1.4Tỷ', percent: 70 },
  { month: 'T6', value: '1.8Tỷ', percent: 90 },
  { month: 'T7', value: '1.6Tỷ', percent: 80 },
  { month: 'T8', value: '1.2Tỷ', percent: 60 },
  { month: 'T9', value: '1.5Tỷ', percent: 75 },
  { month: 'T10', value: '1.9Tỷ', percent: 95 },
  { month: 'T11', value: '1.3Tỷ', percent: 65 },
  { month: 'T12', value: '2.0Tỷ', percent: 100 },
]);

const bestSellingProducts = ref([
  { id: 1, name: 'Váy Maxi Hoa Nhí', category: 'Nữ', sales: 1200, revenue: '360Tr', image: 'https://placehold.co/40x40/pink/white?text=V' },
  { id: 2, name: 'Áo Sơ Mi Linen', category: 'Nam', sales: 980, revenue: '290Tr', image: 'https://placehold.co/40x40/blue/white?text=A' },
  { id: 3, name: 'Túi Xách Da', category: 'Phụ Kiện', sales: 750, revenue: '500Tr', image: 'https://placehold.co/40x40/orange/white?text=T' },
  { id: 4, name: 'Giày Sandal', category: 'Giày', sales: 620, revenue: '180Tr', image: 'https://placehold.co/40x40/green/white?text=G' },
]);

const categoryTrends = ref([
  { name: 'Thời Trang Nữ', value: 75, trend: 'up', icon: 'bi-gender-female' },
  { name: 'Thời Trang Nam', value: 45, trend: 'neutral', icon: 'bi-gender-male' },
  { name: 'Phụ Kiện', value: 30, trend: 'down', icon: 'bi-handbag' },
  { name: 'Giày Dép', value: 60, trend: 'up', icon: 'bi-asterisk' },
]);

const recentActivities = ref([
  { text: 'Đơn hàng <b>#34567</b> đã được tạo bởi <b>Nguyễn Văn A</b>.', type: 'success', time: '5 phút trước' },
  { text: 'Sản phẩm <b>Váy Maxi Hoa Nhí</b> sắp hết hàng (Còn 5).', type: 'warning', time: '1 giờ trước' },
  { text: 'Khách hàng <b>Trần Thị B</b> đăng ký tài khoản mới.', type: 'info', time: '3 giờ trước' },
  { text: 'Đơn hàng <b>#34500</b> bị hủy hoàn tiền.', type: 'danger', time: 'Hôm qua' },
]);
</script>

<style scoped>
.admin-container {
  padding: 25px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 25px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 800;
  color: #111;
  margin: 0;
}

.text-muted {
  color: #9ca3af;
  font-size: 13px;
  margin: 5px 0 0 0;
}

.header-right {
  display: flex;
  gap: 10px;
}

.period-select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary-custom {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.purple {
  background: #f3e8ff;
  color: #9333ea;
}

.blue {
  background: #eff6ff;
  color: #2563eb;
}

.orange {
  background: #ffedd5;
  color: #ea580c;
}

.green {
  background: #dcfce7;
  color: #166534;
}

.stat-info {
  z-index: 2;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #111;
  margin: 0 0 5px 0;
}

.stat-trend {
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.stat-trend.up {
  color: #10b981;
}

.stat-trend.down {
  color: #ef4444;
}

.stat-trend.neutral {
  color: #f59e0b;
}

.dashboard-grid-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.card-box {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 15px;
}

.bar-chart-wrapper {
  display: flex;
  height: 250px;
  gap: 10px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 11px;
  padding-bottom: 20px;
  text-align: right;
  min-width: 40px;
}

.bars-area {
  display: flex;
  flex-grow: 1;
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 5px;
  border-bottom: 1px solid #e5e7eb;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  width: 100%;
}

.bar-fill {
  width: 24px;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-fill:hover {
  background: #2563eb;
  cursor: pointer;
}

.bar-fill:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.2s;
  pointer-events: none;
}

.x-label {
  font-size: 11px;
  color: #6b7280;
  margin-top: 8px;
}

.chart-legend {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot-revenue {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
}

.cat-item {
  margin-bottom: 18px;
}

.cat-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
  font-weight: 600;
}

.cat-header i {
  color: #6b7280;
  margin-right: 5px;
}

.progress-bar-bg {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
}

.progress-bar-fill.up {
  background: #10b981;
}

.progress-bar-fill.neutral {
  background: #3b82f6;
}

.progress-bar-fill.down {
  background: #ef4444;
}

.dashboard-grid-bottom {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.simple-table {
  width: 100%;
  border-collapse: collapse;
}

.simple-table th {
  text-align: left;
  color: #6b7280;
  font-size: 11px;
  text-transform: uppercase;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.simple-table td {
  padding: 12px 0;
  border-bottom: 1px solid #f9fafb;
  font-size: 13px;
}

.prod-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prod-img {
  width: 36px;
  height: 36px;
  border-radius: 6px;
}

.rank-badge {
  width: 20px;
  height: 20px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
}

.rank-1 {
  background: #fef3c7;
  color: #b45309;
}

.rank-2 {
  background: #e5e7eb;
  color: #374151;
}

.rank-3 {
  background: #ffedd5;
  color: #9a3412;
}

.view-all {
  font-size: 12px;
  text-decoration: none;
  color: #2563eb;
}

.timeline {
  padding-left: 10px;
  border-left: 2px solid #e5e7eb;
  margin-left: 10px;
}

.timeline-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 20px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  left: -7px;
  top: 2px;
  border: 2px solid white;
}

.timeline-dot.success {
  background: #10b981;
}

.timeline-dot.warning {
  background: #f59e0b;
}

.timeline-dot.info {
  background: #3b82f6;
}

.timeline-dot.danger {
  background: #ef4444;
}

.timeline-text {
  margin: 0 0 4px 0;
  font-size: 13px;
  line-height: 1.4;
}

.timeline-time {
  font-size: 11px;
  color: #9ca3af;
}

.text-right {
  text-align: right;
}

.fw-bold {
  font-weight: 600;
}

.text-blue {
  color: #2563eb;
}

.badge-gray {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid-main,
  .dashboard-grid-bottom {
    grid-template-columns: 1fr;
  }
}
</style>