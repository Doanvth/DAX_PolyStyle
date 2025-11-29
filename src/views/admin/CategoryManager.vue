<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Danh Mục</h4>
      <button class="btn btn-add">Thêm Danh Mục Mới</button>
    </div>

    <div class="table-responsive shadow-sm">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Danh Mục</th>
            <th>Số Sản Phẩm</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CAT101</td>
            <td class="product-name">Thời Trang Nam</td>
            <td>180</td>
            <td>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>

          <tr>
            <td>CAT102</td>
            <td class="product-name">Thời Trang Nữ</td>
            <td>250</td>
            <td>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>

          <tr>
            <td>CAT103</td>
            <td class="product-name">Phụ Kiện & Giày Dép</td>
            <td class="low-stock">45</td>
            <td>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* --- THIẾT KẾ ĐẸP HƠN (Đã sửa) --- */
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

/* Điều chỉnh màu tiêu đề để đồng bộ hơn với màu tím chủ đạo */
.header-actions h4 {
  margin: 0;
  text-align: left;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e2a78; /* Giữ màu tối đậm */
  border-bottom: 3px solid #6c63ff;
  display: inline-block;
  padding-bottom: 5px;
}

/* --- Nút Thêm Mới (Đã sửa: Thêm background-color) --- */
.btn-add {
  background-color: #6c63ff; /* Màu nền chính */
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(108, 99, 255, 0.3);
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

.btn-edit {
  color: #4caf50;
}

.btn-delete {
  color: #f44336;
}

/* --- Table Styles --- */
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

.low-stock {
  color: orange;
  font-weight: 700;
}

/* Các lớp Bootstrap tiêu chuẩn */
.fw-bold { font-weight: bold; }
/* Đã loại bỏ .text-primary ở đây, vì màu đã được định nghĩa trong h4 */
.mb-0 { margin-bottom: 0 !important; }
</style>