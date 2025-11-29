<template>
  <div class="product-management-container">
    <div class="header-actions">
      <!-- Tiêu đề với style nổi bật -->
      <h4 class="fw-bold text-primary mb-0">Quản Lý Cửa Hàng</h4>
      <!-- Nút Cập Nhật chính vẫn giữ lại -->
      <button class="btn btn-update">
        <i class="bi bi-pencil-square"></i> Thêm mới
      </button>
    </div>

    <div class="table-responsive shadow-sm">
      <table>
        <thead>
          <tr>
            <th>Tên Cửa Hàng</th>
            <th>Địa Chỉ</th>
            <th>Email Liên Hệ</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="product-name">Poly-Smartshop</td>
            <td>Tòa nhà FPT Polytechnic, Cần Thơ</td>
            <td>contact@polysmart.com</td>
            <td><span class="status-active">Đang Mở</span></td>
            <td>
              <!-- Nút Sửa (Icon) -->
              <button class="btn btn-edit-icon">
                <i class="bi bi-pencil-square"></i>
              </button>
              <!-- Nút Xóa (Icon) -->
              <button class="btn btn-delete-icon">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
/* --- THIẾT KẾ ĐẸP HƠN (Đồng bộ với các component khác) --- */
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
  margin-bottom: 25px;
  padding: 0 5px;
}

.header-actions h4 {
  margin: 0;
  text-align: left;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e2a78; /* Màu tối đậm cho tiêu đề */
  border-bottom: 3px solid #6c63ff; /* Đường viền nhấn */
  display: inline-block;
  padding-bottom: 5px;
}

/* 2. TABLE STYLING */
.table-responsive {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08); /* Shadow mạnh hơn */
  border-radius: 12px; /* Góc bo tròn */
  overflow: hidden; 
  background-color: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: #f0f3f5; /* Nền header nhẹ */
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
}

th,
td {
  padding: 14px 15px; /* Tăng padding cho cell */
  text-align: left;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background-color: #f5f5ff;
}

/* --- Style Dữ liệu và Trạng thái --- */
.status-active { 
  font-weight: bold; 
  color: #4caf50; /* Xanh lá: Đang mở */
}

/* --- Nút --- */
/* Nút Cập nhật chính */
.btn-update { 
  background-color: #6c63ff; 
  color: white; 
  padding: 10px 18px; 
  font-weight: 600; 
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(108, 99, 255, 0.3);
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.btn-update:hover {
  background-color: #5a54e5;
  box-shadow: 0 6px 10px rgba(108, 99, 255, 0.4);
}

/* Base cho nút icon */
.btn {

  padding: 8px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Nút Sửa/Xóa (Icon) */
.btn-edit-icon {
  color: #4caf50;
}

.btn-delete-icon {
  color: #f44336;
}

/* Các lớp Bootstrap tiêu chuẩn */
.fw-bold { font-weight: bold; }
.text-primary { color: #007bff; } 
.mb-0 { margin-bottom: 0 !important; }
</style>