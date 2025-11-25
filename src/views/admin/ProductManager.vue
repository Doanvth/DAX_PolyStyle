<template>
  <div class="product-management-container">
    <div class="header-actions">
      <!-- Tiêu đề với phong cách mạnh mẽ hơn (đồng bộ với Revenue/Category) -->
      <h4 class="fw-bold text-primary mb-0">Quản Lý Sản Phẩm</h4>
      <button class="btn btn-add">Thêm Sản Phẩm Mới</button>
    </div>

    <div class="table-responsive shadow-sm">
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>ID</th>
            <th>Tên Sản Phẩm</th>
            <th>Giá</th>
            <th>Tồn Kho</th>
            <th>Danh Mục</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <!-- Hàng 1: Sản phẩm dồi dào -->
          <tr>
            <td>
              <img
                src="https://picsum.photos/50/50?random=101"
                alt="Áo khoác Blazer"
                class="product-image"
              />
            </td>
            <td>P1001</td>
            <td class="product-name">Áo Khoác Blazer Mùa Đông</td>
            <td class="product-price">1.500.000 ₫</td>
            <td>180</td>
            <td>Thời Trang Nữ</td>
            <td>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>

          <!-- Hàng 2: Sản phẩm tồn kho thấp -->
          <tr>
            <td>
              <img
                src="https://picsum.photos/50/50?random=102"
                alt="Giày sneakers"
                class="product-image"
              />
            </td>
            <td>P1002</td>
            <td class="product-name">Giày Sneakers Thể Thao Z1</td>
            <td class="product-price">950.000 ₫</td>
            <td class="low-stock">8</td>
            <td>Phụ Kiện & Giày Dép</td>
            <td>
              <button class="btn btn-edit">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>

          <!-- Hàng 3: Sản phẩm hết hàng -->
          <tr>
            <td>
              <img
                src="https://picsum.photos/50/50?random=103"
                alt="Quần Jeans Slim Fit"
                class="product-image"
              />
            </td>
            <td>P1003</td>
            <td class="product-name">Quần Jean Slim Fit Cotton</td>
            <td class="product-price">780.000 ₫</td>
            <td class="out-of-stock">0</td>
            <td>Thời Trang Nam</td>
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

<script setup></script>

<style scoped>
.product-management-container {
  padding: 10px;
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

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.low-stock {
  font-weight: bold;
  color: orange;
}

.out-of-stock {
  font-weight: bold;
  color: red;
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

.btn-edit {
  color: #4caf50;
}

.btn-delete {
  color: #f44336;
}

.btn:hover {
  opacity: 0.9;
}

.btn-add {
  background-color: #6c63ff;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
}

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

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.out-of-stock {
  font-weight: bold;
  color: red;
}
</style>
