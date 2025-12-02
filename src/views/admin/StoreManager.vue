<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Cửa Hàng</h4>
      <router-link :to="{ name: 'store-add' }" class="btn btn-update">
        <i class="bi bi-plus-lg"></i> Thêm mới
      </router-link>
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
              <button class="btn btn-edit-icon">
                <i class="bi bi-pencil-square"></i>
              </button>
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
.product-management-container {
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

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
  color: #1e2a78;
  border-bottom: 3px solid #6c63ff;
  display: inline-block;
  padding-bottom: 5px;
}

.table-responsive {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: #f0f3f5;
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
}

th,
td {
  padding: 14px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background-color: #f5f5ff;
}

.status-active {
  font-weight: bold;
  color: #4caf50;
}

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

.btn-edit-icon {
  color: #4caf50;
}

.btn-delete-icon {
  color: #f44336;
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