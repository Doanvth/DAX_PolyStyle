<template>
  <div class="admin-container">

    <div class="dashboard-header">
      <div class="title-section">
        <div class="date-filter">
          <span class="filter-label">Thời gian:</span>
          <select v-model="selectedPeriod" class="period-select">
            <option value="this_month">Tháng này (12/2025)</option>
            <option value="last_month">Tháng trước (11/2025)</option>
            <option value="ytd">Cả năm 2025</option>
          </select>
        </div>
        <button class="btn-primary-custom">
          <i class="bi bi-cloud-download"></i> Tải báo cáo
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-currency-dollar"></i></div>
          <div class="info">
            <h3>{{ formatCurrency(stats.revenue) }}</h3>
            <p>Doanh thu thuần</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-receipt"></i></div>
          <div class="info">
            <h3>{{ formatNumber(stats.orders) }}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="icon"><i class="bi bi-graph-up-arrow"></i></div>
          <div class="info">
            <h3>{{ stats.growth }}%</h3>
            <p>Tăng trưởng</p>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="icon"><i class="bi bi-bag-check"></i></div>
          <div class="info">
            <h3>{{ formatCurrency(stats.avgOrderValue) }}</h3>
            <p>Giá trị TB/Đơn</p>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-section">
      <div class="chart-header">
        <h4><i class="bi bi-bar-chart-line"></i> Biểu đồ tăng trưởng - {{ getTabLabel(activeTab) }}</h4>
      </div>
      <div class="chart-body">
        <div class="chart-bar-container" v-for="(item, index) in currentChartData" :key="index">
          <div class="bar-wrapper">
            <div class="bar-fill" :style="{ height: item.percent + '%', backgroundColor: item.color }">
              <span class="bar-tooltip">{{ formatShortCurrency(item.value) }}</span>
            </div>
          </div>
          <div class="bar-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <div class="status-tabs">
      <button v-for="tab in tabs" :key="tab.value" class="tab-btn" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <div class="table-container">

      <table v-if="activeTab === 'monthly'">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Doanh thu</th>
            <th>Đơn hàng</th>
            <th>Chi phí Marketing</th>
            <th>Lợi nhuận</th>
            <th class="text-center">Biến động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in monthlyData" :key="item.id">
            <td class="fw-bold">{{ item.label }}</td>
            <td class="text-blue fw-bold">{{ formatCurrency(item.revenue) }}</td>
            <td>{{ formatNumber(item.orders) }}</td>
            <td class="text-muted">{{ formatCurrency(item.cost) }}</td>
            <td class="text-success fw-bold">{{ formatCurrency(item.profit) }}</td>
            <td class="text-center">
              <span :class="item.growth > 0 ? 'badge-green' : 'badge-red'">
                {{ item.growth > 0 ? '+' : '' }}{{ item.growth }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-if="activeTab === 'quarterly'">
        <thead>
          <tr>
            <th>Quý</th>
            <th>Tổng Doanh Thu</th>
            <th>Mục tiêu (KPI)</th>
            <th>Đạt được</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in quarterlyData" :key="item.id">
            <td class="fw-bold">{{ item.label }}</td>
            <td class="text-blue fw-bold">{{ formatCurrency(item.revenue) }}</td>
            <td class="text-muted">{{ formatCurrency(item.target) }}</td>
            <td>
              <div class="progress-bar-mini">
                <div class="fill" :style="{ width: Math.min((item.revenue / item.target) * 100, 100) + '%' }"></div>
              </div>
              <span class="text-xs">{{ Math.round((item.revenue / item.target) * 100) }}%</span>
            </td>
            <td>
              <span class="status-dot" :class="item.revenue >= item.target ? 'bg-success' : 'bg-warning'"></span>
              {{ item.revenue >= item.target ? 'Đạt KPI' : 'Chưa đạt' }}
            </td>
          </tr>
        </tbody>
      </table>

      <table v-if="activeTab === 'best-selling'">
        <thead>
          <tr>
            <th width="5%">Top</th>
            <th width="40%">Sản phẩm</th>
            <th width="15%">Đã bán</th>
            <th width="20%">Doanh thu</th>
            <th width="20%">Tồn kho</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in bestSellingData" :key="item.id">
            <td>
              <span class="rank-badge" :class="'rank-' + (idx + 1)">#{{ idx + 1 }}</span>
            </td>
            <td>
              <div class="product-mini">
                <img :src="item.image" alt="img">
                <span class="fw-bold">{{ item.name }}</span>
              </div>
            </td>
            <td class="fw-bold">{{ formatNumber(item.sold) }}</td>
            <td class="text-blue">{{ formatCurrency(item.revenue) }}</td>
            <td>
              <span :class="item.stock < 10 ? 'text-red' : 'text-muted'">
                {{ item.stock }} sản phẩm
              </span>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const activeTab = ref("monthly");
const selectedPeriod = ref("this_month");

const tabs = [
  { label: 'Doanh thu theo Tháng', value: 'monthly' },
  { label: 'Doanh thu theo Quý', value: 'quarterly' },
  { label: 'Sản phẩm bán chạy', value: 'best-selling' }
];

const stats = ref({
  revenue: 560000000,
  orders: 1250,
  growth: 15.4,
  avgOrderValue: 448000
});

const monthlyData = [
  { id: 1, label: 'Tháng 12/2025', revenue: 560000000, orders: 1250, cost: 50000000, profit: 510000000, growth: 15.4 },
  { id: 2, label: 'Tháng 11/2025', revenue: 490000000, orders: 1100, cost: 45000000, profit: 445000000, growth: 8.2 },
  { id: 3, label: 'Tháng 10/2025', revenue: 450000000, orders: 1050, cost: 42000000, profit: 408000000, growth: -2.1 },
  { id: 4, label: 'Tháng 09/2025', revenue: 460000000, orders: 1080, cost: 43000000, profit: 417000000, growth: 5.5 },
  { id: 5, label: 'Tháng 08/2025', revenue: 420000000, orders: 980, cost: 40000000, profit: 380000000, growth: 1.0 },
];

const quarterlyData = [
  { id: 1, label: 'Quý 4/2025', revenue: 1500000000, target: 1400000000 },
  { id: 2, label: 'Quý 3/2025', revenue: 1330000000, target: 1350000000 },
  { id: 3, label: 'Quý 2/2025', revenue: 1250000000, target: 1200000000 },
  { id: 4, label: 'Quý 1/2025', revenue: 1100000000, target: 1100000000 },
];

const bestSellingData = [
  { id: 'P01', name: 'Áo Thun Poly Signature', image: 'https://placehold.co/40x40', sold: 1200, revenue: 360000000, stock: 45 },
  { id: 'P02', name: 'Quần Jean Slimfit', image: 'https://placehold.co/40x40', sold: 850, revenue: 425000000, stock: 12 },
  { id: 'P03', name: 'Áo Khoác Gió 2 Lớp', image: 'https://placehold.co/40x40', sold: 600, revenue: 300000000, stock: 8 },
  { id: 'P04', name: 'Giày Sneaker Basic', image: 'https://placehold.co/40x40', sold: 450, revenue: 225000000, stock: 60 },
  { id: 'P05', name: 'Balo Laptop Chống Nước', image: 'https://placehold.co/40x40', sold: 320, revenue: 160000000, stock: 5 },
];

const currentChartData = computed(() => {
  if (activeTab.value === 'monthly') {
    const maxVal = Math.max(...monthlyData.map(d => d.revenue));
    return monthlyData.slice().reverse().map(item => ({
      label: item.label.split(' ')[1],
      value: item.revenue,
      percent: (item.revenue / maxVal) * 100,
      color: '#3b82f6'
    }));
  }

  else if (activeTab.value === 'quarterly') {
    const maxVal = Math.max(...quarterlyData.map(d => d.revenue));
    return quarterlyData.slice().reverse().map(item => ({
      label: item.label,
      value: item.revenue,
      percent: (item.revenue / maxVal) * 100,
      color: '#10b981'
    }));
  }
  else {
    const maxVal = Math.max(...bestSellingData.map(d => d.revenue));
    return bestSellingData.map(item => ({
      label: item.id,
      value: item.revenue,
      percent: (item.revenue / maxVal) * 100,
      color: '#f97316'
    }));
  }
});

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('vi-VN').format(val);
const formatShortCurrency = (val) => {
  if (val >= 1000000000) return (val / 1000000000).toFixed(1) + ' tỷ';
  if (val >= 1000000) return (val / 1000000).toFixed(0) + ' tr';
  return val;
};
const getTabLabel = (val) => {
  const map = { monthly: 'Doanh thu 5 tháng gần nhất', quarterly: 'Doanh thu 4 quý', 'best-selling': 'Top 5 sản phẩm doanh thu cao' };
  return map[val];
};

</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
  font-size: 13px;
}

.dashboard-header {
  margin-bottom: 20px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.filter-label {
  font-weight: 600;
  color: #6b7280;
}

.period-select {
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.btn-primary-custom {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.stat-card .icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111;
}

.stat-card p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
}

.blue .icon {
  background: #eff6ff;
  color: #3b82f6;
}

.green .icon {
  background: #ecfdf5;
  color: #10b981;
}

.orange .icon {
  background: #fff7ed;
  color: #f97316;
}

.purple .icon {
  background: #f3e8ff;
  color: #a855f7;
}

.chart-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-header h4 {
  margin: 0 0 20px 0;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-body {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.bar-wrapper {
  height: 160px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
}

.bar-fill {
  width: 40px;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  position: relative;
  cursor: pointer;
}

.bar-fill:hover {
  opacity: 0.8;
}

.bar-tooltip {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.bar-fill:hover .bar-tooltip {
  opacity: 1;
}

.bar-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

.status-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.tab-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 6px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f9fafb;
}

.tab-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f9fafb;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  font-size: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 12px 15px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

tr:hover td {
  background-color: #f9fafb;
}

.fw-bold {
  font-weight: 700;
}

.text-blue {
  color: #2563eb;
}

.text-success {
  color: #10b981;
}

.text-red {
  color: #ef4444;
}

.text-muted {
  color: #9ca3af;
}

.text-center {
  text-align: center;
}

.badge-green {
  background: #dcfce7;
  color: #166534;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.badge-red {
  background: #fee2e2;
  color: #991b1b;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.rank-badge {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}

.rank-1 {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fcd34d;
}

/* Gold */
.rank-2 {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

/* Silver */
.rank-3 {
  background: #ffedd5;
  color: #c2410c;
  border: 1px solid #fdba74;
}

/* Bronze */

.product-mini {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-mini img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.progress-bar-mini {
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  display: inline-block;
  margin-right: 5px;
  overflow: hidden;
}

.progress-bar-mini .fill {
  height: 100%;
  background: #10b981;
  border-radius: 3px;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
}

.bg-success {
  background: #10b981;
}

.bg-warning {
  background: #f59e0b;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bar-label {
    font-size: 10px;
  }
}
</style>