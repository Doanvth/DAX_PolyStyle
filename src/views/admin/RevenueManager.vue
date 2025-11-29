<template>
  <div class="product-management-container">
    <div class="header-actions">
      <!-- Tiêu đề với phong cách mạnh mẽ hơn -->
      <h4 class="fw-bold text-primary mb-0">Báo Cáo Doanh Thu</h4>
      <button class="btn btn-add">
        <i class="bi bi-download"></i> Tải Báo Cáo
      </button>
    </div>

    <!-- KHỐI TAB NAVIGATION (Giả lập Bootstrap Nav-tabs) -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a
          :class="['nav-link', { active: activeTab === 'monthly' }]"
          @click="activeTab = 'monthly'"
          >Tháng</a
        >
      </li>
      <li class="nav-item">
        <a
          :class="['nav-link', { active: activeTab === 'quarterly' }]"
          @click="activeTab = 'quarterly'"
          >Quý</a
        >
      </li>
      <li class="nav-item">
        <a
          :class="['nav-link', { active: activeTab === 'yearly' }]"
          @click="activeTab = 'yearly'"
          >Năm</a
        >
      </li>
      <li class="nav-item">
        <a
          :class="['nav-link', { active: activeTab === 'best-selling' }]"
          @click="activeTab = 'best-selling'"
          >Sản Phẩm Bán Chạy</a
        >
      </li>
    </ul>

    <div class="tab-content">
      <!-- 1. DOANH THU THÁNG -->
      <div v-if="activeTab === 'monthly'" class="tab-pane active">
        <div class="table-responsive shadow-sm">
          <table class="table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Doanh Thu Thuần</th>
                <th>Tổng Đơn Hàng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="product-name">Tháng 11/2025</td>
                <td class="status-active">560.000.000 ₫</td>
                <td>1.250</td>
              </tr>
              <tr>
                <td class="product-name">Tháng 10/2025</td>
                <td class="status-active">490.000.000 ₫</td>
                <td>1.100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. DOANH THU QUÝ -->
      <div v-if="activeTab === 'quarterly'" class="tab-pane active">
        <div class="table-responsive shadow-sm">
          <table class="table">
            <thead>
              <tr>
                <th>Quý</th>
                <th>Doanh Thu Thuần</th>
                <th>Chi Phí Marketing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="product-name">Quý 4/2025</td>
                <td class="status-active">1.500.000.000 ₫</td>
                <td class="low-stock">50.000.000 ₫</td>
              </tr>
              <tr>
                <td class="product-name">Quý 3/2025</td>
                <td class="status-active">1.350.000.000 ₫</td>
                <td>45.000.000 ₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. DOANH THU NĂM -->
      <div v-if="activeTab === 'yearly'" class="tab-pane active">
        <div class="table-responsive shadow-sm">
          <table class="table">
            <thead>
              <tr>
                <th>Năm</th>
                <th>Doanh Thu Thuần</th>
                <th>Tăng Trưởng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="product-name">Năm 2025 (YTD)</td>
                <td class="status-active">5.200.000.000 ₫</td>
                <td class="text-success fw-bold">+15%</td>
              </tr>
              <tr>
                <td class="product-name">Năm 2024</td>
                <td class="status-active">4.500.000.000 ₫</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. SẢN PHẨM BÁN CHẠY -->
      <div v-if="activeTab === 'best-selling'" class="tab-pane active">
        <div class="table-responsive shadow-sm">
          <table class="table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Tên Sản Phẩm</th>
                <th>ID Sản Phẩm</th>
                <th>Số Lượng Bán</th>
                <th>Doanh Thu Đóng Góp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fw-bold low-stock">#1</td>
                <td class="product-name">Laptop Gaming XYZ</td>
                <td>P007</td>
                <td>500</td>
                <td class="status-active">800.000.000 ₫</td>
              </tr>
              <tr>
                <td class="fw-bold low-stock">#2</td>
                <td class="product-name">Áo Thun Poly Cao Cấp</td>
                <td>P015</td>
                <td>1,200</td>
                <td class="status-active">360.000.000 ₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const activeTab = ref("monthly"); // Mặc định hiển thị tab Doanh thu Tháng
</script>
<style scoped>
/* --- THIẾT KẾ ĐẸP HƠN --- */
.product-management-container {
  padding: 30px; /* Tăng padding */
  width: 100%;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

/* 1. HEADER */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px; /* Tăng khoảng cách */
  padding: 0 5px;
}

.header-actions h4 {
  margin: 0;
  text-align: left;
  font-size: 1.8rem; /* Lớn hơn */
  font-weight: 700; /* Đảm bảo đậm */
  color: #1e2a78; /* Màu tối đậm cho tiêu đề */
  border-bottom: 3px solid #6c63ff; /* Đường viền nhấn */
  display: inline-block;
  padding-bottom: 5px;
}

/* Nút Tải Báo Cáo */
.btn-add {
  background-color: #6c63ff;
  color: white;
  padding: 10px 18px; /* Padding lớn hơn */
  border-radius: 8px;
  font-weight: 600;
  gap: 8px; /* Khoảng cách icon */
  box-shadow: 0 4px 6px rgba(108, 99, 255, 0.3); /* Shadow nổi bật */
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-add:hover {
  background-color: #5a54e5;
  box-shadow: 0 6px 10px rgba(108, 99, 255, 0.4);
}

/* 2. TAB NAVIGATION ENHANCEMENT */
.nav {
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 20px;
}

.nav-link {
  padding: 0.75rem 1.2rem; /* Tăng padding */
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
}

.nav-link:hover {
  color: #6c63ff;
}

.nav-link.active {
  color: #6c63ff;
  border-bottom-color: #6c63ff;
  font-weight: 700;
  background-color: #fff;
}

/* 3. TABLE STYLING */
.tab-content {
  padding-top: 5px;
}

.table-responsive {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08); /* Shadow mạnh hơn */
  border-radius: 12px; /* Góc bo tròn */
  overflow: hidden;
  background-color: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead th {
  background-color: #f0f3f5; /* Nền header nhẹ */
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.table th,
.table td {
  padding: 14px 15px; /* Tăng padding cho cell */
  text-align: left;
  border-bottom: 1px solid #eee;
}

.table tbody tr:hover {
  background-color: #f5f5ff;
}

.status-active {
  font-weight: 700;
  color: #198754;
}

.low-stock {
  color: orange;
  font-weight: 700;
}

.text-success {
  color: #198754;
}

.fw-bold {
  font-weight: bold;
}
.text-primary {
  color: #007bff;
}
.mb-0 {
  margin-bottom: 0 !important;
}
</style>
