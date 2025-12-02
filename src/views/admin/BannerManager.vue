<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Biểu Ngữ</h4>
      <router-link to="addbanners" class="btn btn-add">
        + Thêm Biểu Ngữ Mới
      </router-link>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh (Carousel Items)</th>
            <th>Số lượng ảnh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <div class="carousel-preview">
                <img src="https://picsum.photos/100/50?random=1" class="product-image" />
                <img src="https://picsum.photos/100/50?random=2" class="product-image" />
              </div>
            </td>
            <td>2 ảnh</td>
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

<style scoped>
.product-management-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-responsive {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
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

.product-image {
  width: 80px;
  height: 40px;
  object-fit: cover;
  margin-right: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}

.btn-add {
  background: #6c63ff;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.btn-edit {
  color: #4caf50;
}

.btn-delete {
  color: #f44336;
}
</style>