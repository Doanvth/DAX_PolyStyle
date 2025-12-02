<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Bộ Sưu Tập</h4>
      <router-link :to="{ name: 'collection-add' }" class="btn btn-add">
        <i class="bi bi-plus-lg"></i> Thêm Bộ Sưu Tập Mới
      </router-link>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th style="width: 80px;">ID</th>
            <th style="width: 100px;">Ảnh Bìa</th>
            <th>Tên Bộ Sưu Tập (Title)</th>
            <th>Tiêu Đề Phụ</th>
            <th>Hotline</th>
            <th style="width: 100px;">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" class="text-center">Đang tải dữ liệu...</td>
          </tr>

          <tr v-else v-for="(item, index) in collections" :key="item.id">
            <td>{{ item.id }}</td>

            <td>
              <img :src="item.image" alt="Cover" class="img-thumbnail"
                @error="e => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60?text=NoImg' }" />
            </td>

            <td class="product-name">
              {{ item.collection_detail?.[0]?.title || 'Chưa đặt tên' }}
            </td>

            <td>
              {{ item.collection_detail?.[0]?.small_title || '-' }}
            </td>

            <td>
              <span class="fw-bold text-secondary">{{ item.collection_detail?.[0]?.hotline || '-' }}</span>
            </td>

            <td>
              <button class="btn btn-edit" @click="handleEdit(item.id)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-delete" @click="handleDelete(item.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>

          <tr v-if="!isLoading && collections.length === 0">
            <td colspan="6" class="text-center">Không có dữ liệu bộ sưu tập.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; 

const API_URL = 'http://localhost:3000/collection';

const collections = ref([]);
const isLoading = ref(false);

const fetchCollections = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL);
    collections.value = response.data.collection || response.data;

    console.log("Dữ liệu đã tải:", collections.value);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    alert("Không thể tải dữ liệu bộ sưu tập!");
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async (id) => {
  if (confirm(`Bạn có chắc muốn xóa bộ sưu tập ID: ${id}?`)) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      collections.value = collections.value.filter(item => item.id !== id);
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Xóa thất bại!");
    }
  }
};


const handleEdit = (id) => {
  console.log("Edit ID:", id);
};

onMounted(() => {
  fetchCollections();
});
</script>

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

.fw-bold {
  font-weight: bold;
}

.text-primary {
  color: #007bff;
}

.mb-0 {
  margin-bottom: 0 !important;
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
  vertical-align: middle;
}

thead th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
  white-space: nowrap;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

.img-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
}

.product-name {
  font-weight: 600;
  color: #2c3e50;
}

.text-center {
  text-align: center;
  font-style: italic;
  color: #888;
}

.text-secondary {
  color: #6c757d;
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
  text-decoration: none;
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

.btn-add:hover {
  background-color: #5a52d5;
}

.btn-edit {
  color: #4caf50;
}

.btn-delete {
  color: #f44336;
}
</style>