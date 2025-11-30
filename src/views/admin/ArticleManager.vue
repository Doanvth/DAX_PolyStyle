<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Bài Viết</h4>
      <router-link to="posts" class="btn btn-add">
        + Thêm Bài Viết Mới
      </router-link>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu Đề</th>
            <th>Danh Mục</th>
            <th>Ngày Tạo</th>
            <th>Tác Giả</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <img src="https://picsum.photos/50/50?random=10" class="post-thumb" />
            </td>
            <td class="product-name">Xu hướng thời trang 2025</td>
            <td>Đời Sống</td>
            <td>2024-01-15</td>
            <td>Admin</td>
            <td>
              <span class="status-active">
                Hiển thị
              </span>
            </td>
            <td>
              <button class="btn btn-edit"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              <span class="no-img">No Img</span>
            </td>
            <td class="product-name">Bí quyết chọn đồ công sở</td>
            <td>Công Nghệ</td>
            <td>2024-02-10</td>
            <td>Editor</td>
            <td>
              <span class="low-stock">
                Ẩn
              </span>
            </td>
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
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.text-primary {
  color: #007bff;
}

.fw-bold {
  font-weight: bold;
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

.post-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.no-img {
  display: inline-block;
  width: 50px;
  height: 50px;
  background: #eee;
  line-height: 50px;
  text-align: center;
  border-radius: 4px;
  font-size: 10px;
  color: #999;
}

.status-active {
  color: #4caf50;
  font-weight: bold;
}

.low-stock {
  color: orange;
  font-weight: bold;
}

.btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 5px;
  font-size: 16px;
  margin-right: 5px;
}

.btn-add {
  background-color: #6c63ff;
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