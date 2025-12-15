<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">Danh Mục Bài Viết</h2>
        <p class="text-muted">Quản lý các chuyên mục tin tức & blog</p>
      </div>
      <div class="header-right">
        <router-link :to="{ name: 'article-category-add' }" class="btn-primary-custom">
          <i class="bi bi-plus-lg"></i> Thêm Danh Mục
        </router-link>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="10%">ID</th>
            <th width="50%">Tên Danh Mục</th>
            <th width="20%">Trạng thái</th>
            <th width="20%" class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td class="text-muted">#{{ cat.id }}</td>
            <td class="fw-bold">{{ cat.name }}</td>
            <td>
              <div class="status-toggle" @click="toggleStatus(cat)">
                <span class="dot" :class="cat.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                {{ cat.status === 'active' ? 'Hiển thị' : 'Ẩn' }}
              </div>
            </td>
            <td class="text-center">
              <button class="btn-icon" title="Chỉnh sửa" @click="editCategory(cat.id)">
                <i class="bi bi-pencil-square text-blue"></i>
              </button>
              <button class="btn-icon delete" title="Xóa" @click="deleteCategory(cat.id)">
                <i class="bi bi-trash text-red"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="categories.length === 0" class="empty-state">
        <i class="bi bi-list-task"></i>
        <p>Chưa có danh mục nào.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const categories = ref([
  { id: 1, name: 'CHƯƠNG TRÌNH KHUYẾN MẠI', status: 'active' },
  { id: 2, name: 'TIN TỨC KHAI TRƯƠNG', status: 'active' },
  { id: 3, name: 'BỘ SƯU TẬP', status: 'active' },
  { id: 4, name: 'XU HƯỚNG THỜI TRANG', status: 'active' },
  { id: 5, name: 'TIN VẮN TRONG NGÀY', status: 'inactive' },
  { id: 6, name: 'CHÍNH SÁCH KHÁCH HÀNG', status: 'active' }
]);

const toggleStatus = (cat) => {
  cat.status = cat.status === 'active' ? 'inactive' : 'active';
};

const editCategory = (id) => {
  router.push({ name: 'article-category-add' });
};

const deleteCategory = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
    categories.value = categories.value.filter(c => c.id !== id);
  }
};
</script>

<style scoped>
.admin-container { padding: 20px; background: #f3f4f6; min-height: 100vh; font-family: -apple-system, sans-serif; color: #374151; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center; }
.page-title { font-size: 24px; font-weight: 700; margin: 0; color: #111; }
.text-muted { color: #9ca3af; font-size: 13px; margin-top: 2px; }

.btn-primary-custom {
  background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; 
  cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
  transition: 0.2s;
}
.btn-primary-custom:hover { background: #1d4ed8; }

.table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th { background: #f9fafb; padding: 12px 15px; text-align: left; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
td { padding: 12px 15px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; font-size: 14px; }
tr:hover td { background-color: #f9fafb; }

.fw-bold { font-weight: 600; }
.text-center { text-align: center; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 16px; margin: 0 5px; color: #6b7280; }
.text-blue { color: #2563eb; }
.text-red { color: #ef4444; }

.status-toggle { cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; user-select: none; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.bg-success { background: #10b981; }
.bg-gray { background: #9ca3af; }

.empty-state { padding: 40px; text-align: center; color: #9ca3af; }
.empty-state i { font-size: 32px; margin-bottom: 10px; display: block; }
</style>