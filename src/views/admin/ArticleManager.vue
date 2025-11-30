<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Bài Viết</h4>
      <button class="btn btn-add">Thêm Bài Viết Mới</button>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu Đề</th>
            <th>Ngày Đăng</th>
            <th>Tác Giả</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>POST001</td>
            <td class="product-name">Review Laptop X 2025</td>
            <td>20/11/2025</td>
            <td>Admin</td>
            <td><span class="status-active">Đã Xuất Bản</span></td>
            <td>
              <button class="btn btn-edit"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-delete"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
          <tr>
            <td>POST002</td>
            <td class="product-name">Mẹo chọn đồ thể thao</td>
            <td>15/11/2025</td>
            <td>Khách Mời</td>
            <td><span class="low-stock">Bản Nháp</span></td>
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

.status-active { 
  font-weight: bold; 
  color: #4caf50; 
}

.low-stock { 
  color: orange; 
  font-weight: bold; 
}

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