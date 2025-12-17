<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="header-left">
        <h2 class="dashboard-title">Tổng Quan Kinh Doanh</h2>
        <p class="text-muted">Cập nhật lúc: {{ new Date().toLocaleString('vi-VN') }}</p>
      </div>
      <div class="header-right">
        <select class="period-select">
          <option>Tháng Này</option>
          <option>Quý Này</option>
          <option>Năm nay</option>

        </select>
        <button class="btn-primary-custom" @click="exportToExcel">
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
          <p class="stat-label">Tổng doanh thu</p>
          <h3 class="stat-value">{{ formatCurrency(totalRevenue) }}</h3>
          <span class="stat-trend up">
            <i class="bi bi-arrow-up-short"></i> Ổn định
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="bi bi-bag-check-fill"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">Tổng đơn hàng</p>
          <h3 class="stat-value">{{ totalOrders.toLocaleString() }}</h3>
          <span class="stat-trend up">
            Mới cập nhật
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="bi bi-box-seam-fill"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">Cần nhập hàng</p>
          <h3 class="stat-value">{{ lowStockProducts }} SP</h3>
          <span class="stat-trend neutral">Kho thấp</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <i class="bi bi-people-fill"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">Khách hàng</p>
          <h3 class="stat-value">{{ newUsersCount }}</h3>
          <span class="stat-trend up">
            <i class="bi bi-arrow-up-short"></i> Đang tăng
          </span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid-main">
      <div class="card-box chart-container">
        <div class="card-header-flex">
          <h5 class="card-title">Biểu đồ doanh thu 12 tháng</h5>
          <div class="chart-legend">
            <span class="dot-revenue"></span> Doanh thu (VND)
          </div>
        </div>

        <div class="bar-chart-wrapper">
          <div class="y-axis">
            <span>Cao nhất</span>
            <span>Trung bình</span>
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
        <h5 class="card-title">Phân bổ sản phẩm</h5>
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
          <h5 class="card-title">Top Sản Phẩm Theo Doanh Số</h5>
        </div>
        <div class="table-responsive">
          <table class="simple-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th class="text-right">Đã bán</th>
                <th class="text-right">Doanh thu tạm tính</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prod, idx) in bestSellingProducts" :key="prod.id">
                <td>
                  <div class="prod-cell">
                    <span class="rank-badge" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
                    <img :src="prod.image" class="prod-img" onerror="this.src='https:/placehold.co/40'">
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
import { ref, computed } from 'vue';
import rawData from '../../../db.json';
import * as XLSX from 'xlsx';


const exportToExcel = () => {
  try {
    const overviewData = [
      { "Hạng mục": "Tổng doanh thu", "Giá trị": formatCurrency(totalRevenue.value) },
      { "Hạng mục": "Tổng đơn hàng", "Giá trị": totalOrders.value },
      { "Hạng mục": "Sản phẩm sắp hết hàng", "Giá trị": lowStockProducts.value },
      { "Hạng mục": "Tổng khách hàng", "Giá trị": newUsersCount.value },
      { "Hạng mục": "", "Giá trị": "" }, // Dòng trống ngăn cách
      { "Hạng mục": "DANH SÁCH SẢN PHẨM BÁN CHẠY", "Giá trị": "" }
    ];

    const productData = bestSellingProducts.value.map((prod, index) => ({
      "Hạng mục": `Top ${index + 1}: ${prod.name}`,
      "Giá trị": `Đã bán: ${prod.sales} | Doanh thu: ${prod.revenue}`
    }));

    const finalData = [...overviewData, ...productData];

    const worksheet = XLSX.utils.json_to_sheet(finalData);
    
    worksheet['!cols'] = [{ wch: 40 }, { wch: 50 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BaoCaoKinhDoanh");
    
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Bao_Cao_Tong_Quan_${dateStr}.xlsx`);
    
    alert("Xuất báo cáo thành công!");
  } catch (error) {
    console.error("Lỗi khi xuất file:", error);
    alert("Có lỗi xảy ra khi xuất báo cáo.");
  }
};

const db = ref(rawData);

const totalRevenue = computed(() => {
  let total = 0;
  db.value?.users?.forEach(user => {
    user.order?.forEach(ord => {
      ord.order_detail?.forEach(detail => {
        total += Number(detail.total) || 0;
      });
    });
  });
  return total;
});

const totalOrders = computed(() => {
  return db.value?.users?.reduce((sum, user) => sum + (user.order?.length || 0), 0) || 0;
});

const lowStockProducts = computed(() => {
  return db.value?.products?.filter(p => p.stock < 10).length || 0;
});

const newUsersCount = computed(() => db.value?.users?.length || 0);

// --- 2. BIỂU ĐỒ DOANH THU (12 THÁNG) ---
const revenueData = computed(() => {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const monthlyRevenue = new Array(12).fill(0);

  db.value?.users?.forEach(user => {
    user.order?.forEach(ord => {
      const dateParts = ord.create_At?.split('-');
      if (dateParts && dateParts.length >= 2) {
        const monthIndex = parseInt(dateParts[1]) - 1;
        ord.order_detail?.forEach(detail => {
          monthlyRevenue[monthIndex] += Number(detail.total) || 0;
        });
      }
    });
  });

  const maxVal = Math.max(...monthlyRevenue) || 1;

  return months.map((m, index) => {
    const val = monthlyRevenue[index];
    return {
      month: m,
      value: val >= 1000000 ? (val / 1000000).toFixed(0) + 'Tr' : val,
      percent: (val / maxVal) * 100
    };
  });
});

// --- 3. SẢN PHẨM BÁN CHẠY ---
const bestSellingProducts = computed(() => {
  if (!db.value?.products) return [];
  return db.value.products.slice(0, 5).map(p => {
    let salesCount = 0;
    db.value.users?.forEach(u => {
      u.order?.forEach(o => {
        o.order_detail?.forEach(d => {
          if (d.product_id == p.id) salesCount += Number(d.quantity);
        });
      });
    });

    return {
      id: p.id,
      name: p.name,
      category: db.value.categories?.find(c => c.id == p.categoryId)?.name || 'Khác',
      sales: salesCount,
      revenue: new Intl.NumberFormat('vi-VN').format(p.price * salesCount) + ' ₫',
      image: p.image?.[0]?.url || 'https://placehold.co/40'
    };
  }).sort((a, b) => b.sales - a.sales);
});

// --- 4. DANH MỤC ---
const categoryTrends = computed(() => {
  if (!db.value?.categories) return [];
  const totalProducts = db.value.products?.length || 1;
  return db.value.categories.slice(0, 4).map(c => {
    const count = db.value.products?.filter(p => p.categoryId == c.id).length || 0;
    return {
      name: c.name,
      value: Math.round((count / totalProducts) * 100),
      trend: 'up',
      icon: 'bi-tag-fill'
    };
  });
});

// --- 5. HOẠT ĐỘNG ---
const recentActivities = computed(() => {
  const activities = [];
  db.value?.users?.forEach(user => {
    user.order?.slice(-1).forEach(ord => {
      activities.push({
        text: `Đơn hàng <b>#${ord.id}</b> vừa được khởi tạo bởi hệ thống.`,
        type: 'success',
        time: ord.create_At
      });
    });
  });
  return activities.reverse().slice(0, 4);
});

// Hàm hỗ trợ format tiền
const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};
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