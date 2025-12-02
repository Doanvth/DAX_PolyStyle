<template>
  <div class="fashion-dashboard-container">
    <h2 class="dashboard-title">Bảng Điều Khiển Tổng Quan</h2>

    <!-- KHỐI THẺ THÔNG TIN TỔNG QUAN -->
    <div class="info-cards-grid">
      <div class="info-card shadow-sm">
        <div class="icon-wrapper bg-gradient-purple">
          <i class="bi bi-currency-dollar"></i>
        </div>
        <div class="card-content">
          <p class="card-label">Tổng Doanh Thu Tháng</p>
          <p class="card-value text-success">1.250.000.000 ₫</p>
          <span class="card-trend text-success"><i class="bi bi-arrow-up-right"></i> 12% so với tháng trước</span>
        </div>
      </div>

      <div class="info-card shadow-sm">
        <div class="icon-wrapper bg-gradient-blue">
          <i class="bi bi-cart-check"></i>
        </div>
        <div class="card-content">
          <p class="card-label">Tổng Đơn Hàng Mới</p>
          <p class="card-value">2.450</p>
          <span class="card-trend text-danger"><i class="bi bi-arrow-down-right"></i> 3% so với tháng trước</span>
        </div>
      </div>

      <div class="info-card shadow-sm">
        <div class="icon-wrapper bg-gradient-orange">
          <i class="bi bi-box-seam"></i>
        </div>
        <div class="card-content">
          <p class="card-label">Sản Phẩm Tồn Kho Thấp</p>
          <p class="card-value low-stock">35</p>
          <span class="card-trend">Cần nhập thêm hàng</span>
        </div>
      </div>

      <div class="info-card shadow-sm">
        <div class="icon-wrapper bg-gradient-green">
          <i class="bi bi-people"></i>
        </div>
        <div class="card-content">
          <p class="card-label">Khách Hàng Mới</p>
          <p class="card-value">480</p>
          <span class="card-trend text-success"><i class="bi bi-arrow-up-right"></i> 8% so với tháng trước</span>
        </div>
      </div>
    </div>

    <!-- KHỐI BIỂU ĐỒ & SẢN PHẨM BÁN CHẠY -->
    <div class="dashboard-grid">
      <!-- Biểu đồ (Placeholder - thực tế cần thư viện chart) -->
      <div class="chart-card shadow-sm">
        <h5 class="card-header-title">Doanh Thu Theo Quý</h5>
        <div class="chart-placeholder">
          <img src="https://via.placeholder.com/400x200/f0f3f5/333?text=Biểu+Đồ+Doanh+Thu" alt="Biểu đồ doanh thu" class="img-fluid">
          <p class="chart-label">Tổng doanh thu 4 quý gần nhất</p>
        </div>
      </div>

      <!-- Danh sách sản phẩm bán chạy -->
      <div class="best-selling-products-card shadow-sm">
        <h5 class="card-header-title">Sản Phẩm Bán Chạy Nhất</h5>
        <ul class="product-list">
          <li v-for="product in bestSellingProducts" :key="product.id" class="product-item">
            <img :src="product.image" :alt="product.name" class="product-item-image">
            <div class="product-details">
              <p class="product-name">{{ product.name }}</p>
              <span class="product-category">{{ product.category }}</span>
            </div>
            <span class="product-sales">{{ product.sales }} lượt bán</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- KHỐI XU HƯỚNG DANH MỤC & HOẠT ĐỘNG GẦN ĐÂY -->
    <div class="dashboard-grid">
      <!-- Xu hướng danh mục -->
      <div class="category-trend-card shadow-sm">
        <h5 class="card-header-title">Xu Hướng Danh Mục</h5>
        <div class="category-list">
          <div v-for="category in categoryTrends" :key="category.name" class="category-item">
            <span :class="['category-name', category.trend === 'up' ? 'text-success' : 'text-danger']">
              {{ category.name }} 
              <i :class="['bi', category.trend === 'up' ? 'bi-graph-up' : 'bi-graph-down']"></i>
            </span>
            <span class="category-value">{{ category.value }}%</span>
          </div>
        </div>
      </div>

      <!-- Hoạt động gần đây -->
      <div class="recent-activities-card shadow-sm">
        <h5 class="card-header-title">Hoạt Động Gần Đây</h5>
        <ul class="activity-list">
          <li v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
            <i :class="['activity-icon', activity.iconClass]"></i>
            <span class="activity-text">{{ activity.text }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const bestSellingProducts = ref([
  { id: 1, name: 'Váy Maxi Hoa Nhí', category: 'Thời Trang Nữ', sales: 1200, image: 'https://picsum.photos/50/50?random=201' },
  { id: 2, name: 'Áo Sơ Mi Linen Nam', category: 'Thời Trang Nam', sales: 980, image: 'https://picsum.photos/50/50?random=202' },
  { id: 3, name: 'Túi Xách Da Cao Cấp', category: 'Phụ Kiện', sales: 750, image: 'https://picsum.photos/50/50?random=203' },
  { id: 4, name: 'Giày Sandal Nữ Đế Bệt', category: 'Giày Dép', sales: 620, image: 'https://picsum.photos/50/50?random=204' },
]);

const categoryTrends = ref([
  { name: 'Thời Trang Nữ', value: 25, trend: 'up' },
  { name: 'Thời Trang Nam', value: 18, trend: 'up' },
  { name: 'Phụ Kiện', value: 10, trend: 'down' },
  { name: 'Giày Dép', value: 15, trend: 'up' },
]);

const recentActivities = ref([
  { text: 'Đơn hàng #34567 đã được tạo.', iconClass: 'bi-cart-plus-fill', time: '5 phút trước' },
  { text: 'Sản phẩm "Váy Maxi Hoa Nhí" hết hàng.', iconClass: 'bi-exclamation-circle-fill text-danger', time: '1 giờ trước' },
  { text: 'Khách hàng mới đăng ký tài khoản.', iconClass: 'bi-person-plus-fill', time: '3 giờ trước' },
  { text: 'Cập nhật giá "Áo Sơ Mi Linen Nam".', iconClass: 'bi-pencil-fill', time: 'Hôm qua' },
]);
</script>

<style scoped>
/* CÁC THAY ĐỔI CHÍNH: Giảm kích thước padding, font chữ và icon */
.fashion-dashboard-container {
  padding: 20px; /* Giảm padding */
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
  color: #343a40;
}

.dashboard-title {
  font-size: 1.8rem; /* Giảm font size */
  font-weight: 700;
  color: #1e2a78;
  margin-bottom: 20px; /* Giảm margin */
  text-align: center;
  position: relative;
}

.dashboard-title::after {
  width: 60px; /* Giảm kích thước gạch chân */
  height: 3px;
  margin: 8px auto 0;
  border-radius: 2px;
}

/* --- INFO CARDS GRID --- */
.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Giảm minmax */
  gap: 15px; /* Giảm gap */
  margin-bottom: 20px; /* Giảm margin */
}

.info-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px 20px; /* Giảm padding */
  display: flex;
  align-items: center;
  gap: 15px; /* Giảm gap */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e0e0e0;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  width: 50px; /* Giảm kích thước icon wrapper */
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem; /* Giảm font size icon */
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.bg-gradient-purple { background: linear-gradient(45deg, #6c63ff, #8a7aff); }
.bg-gradient-blue { background: linear-gradient(45deg, #007bff, #00c6ff); }
.bg-gradient-orange { background: linear-gradient(45deg, #fd7e14, #ffaf6b); }
.bg-gradient-green { background: linear-gradient(45deg, #28a745, #5cb85c); }


.card-content { flex-grow: 1; }

.card-label {
  font-size: 0.8rem; /* Giảm font size label */
  color: #6c757d;
  margin-bottom: 3px;
  font-weight: 500;
}

.card-value {
  font-size: 1.6rem; /* Giảm font size value */
  font-weight: 700;
  color: #343a40;
  margin-bottom: 3px;
}

.card-trend {
  font-size: 0.8rem; /* Giảm font size trend */
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 3px;
}
.card-trend i { font-size: 0.9rem; }

/* --- MAIN DASHBOARD GRID --- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Giảm minmax */
  gap: 15px; /* Giảm gap */
  margin-bottom: 20px;
}

.chart-card,
.best-selling-products-card,
.category-trend-card,
.recent-activities-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 18px; /* Giảm padding */
  border: 1px solid #e0e0e0;
}

.card-header-title {
  font-size: 1.1rem; /* Giảm font size title */
  font-weight: 600;
  color: #1e2a78;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

/* Chart Placeholder */
.chart-placeholder { padding: 15px 0; }
.chart-placeholder img { max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #f0f3f5; }
.chart-label { margin-top: 10px; font-size: 0.85rem; color: #6c757d; }

/* Best Selling Products */
.product-list { list-style: none; padding: 0; margin: 0; }

.product-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0; /* Giảm padding */
  border-bottom: 1px solid #eee;
}
.product-item:last-child { border-bottom: none; }

.product-item-image {
  width: 40px; /* Giảm kích thước ảnh */
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.product-details { flex-grow: 1; }

.product-name { font-weight: 600; color: #343a40; margin-bottom: 2px; font-size: 0.95rem; }
.product-category { font-size: 0.8rem; color: #6c757d; }
.product-sales { font-weight: 500; color: #007bff; font-size: 0.85rem; }

/* Category Trend */
.category-list { display: flex; flex-direction: column; gap: 8px; }

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed #eee;
}
.category-item:last-child { border-bottom: none; }

.category-name { font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 6px; }
.category-name i { font-size: 1rem; }

.category-value { font-weight: 700; font-size: 1rem; color: #6c63ff; }

/* Recent Activities */
.activity-list { list-style: none; padding: 0; margin: 0; }

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0; /* Giảm padding */
  border-bottom: 1px dashed #eee;
}
.activity-item:last-child { border-bottom: none; }

.activity-icon { font-size: 1rem; color: #6c63ff; }
.activity-text { flex-grow: 1; font-size: 0.9rem; color: #343a40; }
.activity-time { font-size: 0.75rem; color: #888; }

/* Utility Classes */
.shadow-sm { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06) !important; }
.text-success { color: #28a745; }
.text-danger { color: #dc3545; }
.low-stock { color: orange; font-weight: 700; }
</style>