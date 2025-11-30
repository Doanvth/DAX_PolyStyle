<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Sản Phẩm</h4>
      <router-link to="addproducts" class="btn btn-add">
        + Thêm Sản Phẩm Mới
      </router-link>
    </div>

    <div class="table-responsive shadow-sm">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Mã SKU</th>
            <th>Tên Sản Phẩm</th>
            <th>Giá Bán</th>
            <th>Tồn Kho</th>
            <th>Danh Mục</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1</td>
            <td>
              <img src="https://picsum.photos/50/50?random=1" alt="Product Img" class="product-image" />
            </td>
            <td>OT001</td>
            <td class="product-name">
              Áo thun Orchid Basic
            </td>
            <td class="product-price">199.000 ₫</td>

            <td>
              <span class="low-stock">
                20
              </span>
            </td>

            <td>Áo thun</td>
            <td>
              <button class="btn btn-edit"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr>
            <td>#2</td>
            <td>
              <img src="https://via.placeholder.com/50x50?text=NoImg" alt="Product Img" class="product-image" />
            </td>
            <td>QJ002</td>
            <td class="product-name">
              Quần Jeans Slim Fit
            </td>
            <td class="product-price">450.000 ₫</td>

            <td>
              <span class="out-of-stock">
                0
              </span>
            </td>

            <td>Quần jeans (Nam)</td>
            <td>
              <button class="btn btn-edit"><i class="bi bi-pencil-square"></i></button>
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