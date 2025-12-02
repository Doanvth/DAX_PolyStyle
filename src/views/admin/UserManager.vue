<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Khách Hàng</h4>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Khách Hàng</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Ngày Đăng Ký</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>USER001</td>
            <td class="product-name">Nguyễn Văn A</td>
            <td>nguyenvana@example.com</td>
            <td>0901 234 567</td>
            <td>12/10/2023</td>
            <td>
              <span class="status-active">Hoạt Động</span>
            </td>
            <td>
              <button class="btn btn-see">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
              </button>
            </td>
          </tr>

          <tr>
            <td>USER002</td>
            <td class="product-name">Trần Thị B</td>
            <td>tranb@example.com</td>
            <td>0912 345 678</td>
            <td>01/05/2024</td>
            <td>
              <span class="status-suspended out-of-stock">Bị Khóa</span>
            </td>
            <td>
              <button class="btn btn-see">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
              </button>
            </td>
          </tr>

          <tr>
            <td>USER003</td>
            <td class="product-name">Lê Văn C</td>
            <td>levanc@example.com</td>
            <td>0890 123 456</td>
            <td>24/11/2025</td>
            <td>
              <span class="status-new low-stock">Mới</span>
            </td>
            <td>
              <button class="btn btn-see">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
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

/* Bảng */
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
  background: transparent;
}

.btn-edit {
  color: #4caf50;
}

.btn-see {
  color: #3656f4;
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
</style>
