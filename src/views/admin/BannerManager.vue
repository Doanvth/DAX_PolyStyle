<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Biểu Ngữ</h4>
      <button class="btn btn-add">Thêm Biểu Ngữ Mới</button>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Vị Trí</th>
            <th>Liên Kết</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="https://picsum.photos/50/50?random=5" alt="Banner 1" class="product-image" />
            </td>
            <td>Trang Chủ (Slider 1)</td>
            <td class="product-name">/collections/winter</td>
            <td><span class="status-active">Hiển Thị</span></td>
            <td>
              <button class="btn btn-edit"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-delete"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
          <tr>
            <td>
              <img src="https://picsum.photos/50/50?random=6" alt="Banner 2" class="product-image" />
            </td>
            <td>Sidebar (Quảng cáo)</td>
            <td class="product-name">/products/sale</td>
            <td><span class="out-of-stock">Ẩn</span></td>
            <td>
              <button class="btn btn-edit"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-delete"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
/* CSS ĐỒNG BỘ */
.product-management-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 5px;
}

.header-actions h4 {
  margin: 0;
  text-align: left;
}

.fw-bold { font-weight: bold; }
.text-primary { color: #007bff; } 
.mb-0 { margin-bottom: 0 !important; }

.table-responsive {
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

thead th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

/* --- Style Tùy chỉnh --- */
.product-image { 
  width: 50px; 
  height: 50px; 
  object-fit: cover; 
  border-radius: 4px; 
  border: 1px solid #eee; 
}

.status-active { 
  font-weight: bold; 
  color: #4caf50; 
}

.out-of-stock { 
  color: red; 
  font-weight: bold; 
}

/* Nút */
.btn {
  background: transparent;
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

.btn-add { 
  background-color: #6c63ff; 
  color: white; 
  padding: 10px 15px; 
  font-weight: bold; 
}

.btn-edit { 
  color: #4caf50; 
}

.btn-delete { 
  color: #f44336; 
}
</style>