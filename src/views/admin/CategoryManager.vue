<template>
  <div class="page-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom-dashed">
      <div>
        <h4 class="fw-bold text-primary mb-0">Quản Lý Danh Mục</h4>
        <p class="text-subtitle">Quản lý phân cấp và trạng thái hiển thị</p>
      </div>
      <router-link :to="{ name: 'category-add' }" class="btn btn-primary-custom"
        style="text-decoration: none; display: inline-flex; align-items: center;">
        <i class="bi bi-plus-lg me-2"></i>Thêm Mới
      </router-link>
    </div>
    <div class="card-container">


      <div v-if="errorMessage" class="alert alert-danger-soft">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
      </div>

      <div class="table-responsive">
        <table class="table custom-table">
          <thead>
            <tr>
              <th width="80">ID</th>
              <th>Tên Danh Mục</th>
              <th width="150">Trạng Thái</th>
              <th width="140" class="text-end">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2 text-muted small">Đang tải dữ liệu...</div>
              </td>
            </tr>

            <tr v-else-if="categories.length === 0">
              <td colspan="4" class="text-center py-5">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" width="60" alt="empty"
                  class="mb-3 opacity-50">
                <p class="text-muted">Chưa có danh mục nào.</p>
              </td>
            </tr>

            <template v-else v-for="category in categories" :key="category.id">

              <tr class="row-parent" :class="{ 'is-open': category.isOpen }" @click="toggleCategory(category)">
                <td class="fw-bold text-secondary">#{{ category.id }}</td>

                <td>
                  <div class="d-flex align-items-center">
                    <button class="btn-toggle me-3">
                      <i class="bi" :class="category.isOpen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    </button>
                    <div class="d-flex flex-column">
                      <span class="category-name-lg">{{ category.name }}</span>
                      <span class="category-meta" v-if="category.children && category.children.length">
                        {{ category.children.length }} danh mục con
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span class="badge-soft" :class="category.status === 'Inactive' ? 'badge-inactive' : 'badge-active'">
                    <i class="bi me-1" :class="category.status === 'Inactive' ? 'bi-x-circle' : 'bi-check-circle'"></i>
                    {{ category.status || 'Active' }}
                  </span>
                </td>

                <td class="text-end" @click.stop>
                  <button class="btn-icon btn-edit me-1" title="Sửa"><i class="bi bi-pencil"></i></button>
                  <button class="btn-icon btn-delete" title="Xóa"><i class="bi bi-trash3"></i></button>
                </td>
              </tr>

              <tr v-if="category.isOpen" v-for="(child, index) in category.children" :key="child.id" class="row-child">
                <td class="text-muted opacity-50">#{{ child.id }}</td>

                <td class="position-relative ps-5">
                  <div class="tree-connector" :class="{ 'is-last': index === category.children.length - 1 }"></div>

                  <span class="child-name">{{ child.name }}</span>
                </td>

                <td>
                  <span class="badge-dot" :class="child.status === 'Inactive' ? 'bg-secondary' : 'bg-success'"></span>
                  <span class="text-sm ms-2">{{ child.status || 'Active' }}</span>
                </td>

                <td class="text-end">
                  <button class="btn-icon-sm btn-edit-sm me-1"><i class="bi bi-pencil"></i></button>
                  <button class="btn-icon-sm btn-delete-sm"><i class="bi bi-trash3"></i></button>
                </td>
              </tr>

            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const categories = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const API_URL = 'http://localhost:3000/categories';

const fetchCategories = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Lỗi kết nối: ${response.status}`);
    const data = await response.json();

    const rawList = data.categories ? data.categories : data;
    categories.value = rawList.map(cat => ({
      ...cat,
      isOpen: true
    }));

  } catch (error) {
    console.error("Fetch Error:", error);
    errorMessage.value = 'Không thể kết nối đến Server. Đang hiển thị dữ liệu mẫu (nếu có).';
  } finally {
    loading.value = false;
  }
};

const toggleCategory = (category) => {
  category.isOpen = !category.isOpen;
};


onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.page-wrapper {
  padding: 30px;
  background-color: #f3f4f6;
  font-family: 'Inter', sans-serif;
  color: #1f2937;
}

.card-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);

  margin: 0 auto;
}

.page-title {
  font-weight: 700;
  color: #111827;
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.text-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0;
}

.border-bottom-dashed {
  border-bottom: 1px dashed #e5e7eb;
}

.btn-primary-custom {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-primary-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(79, 70, 229, 0.4);
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 4px;
}

.custom-table thead th {
  background-color: #f9fafb;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.custom-table td {
  vertical-align: middle;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.row-parent {
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;
}

.row-parent:hover {
  background-color: #f9fafb;
}

.row-parent.is-open {
  background-color: #f8fafc;
}

.row-parent.is-open td {
  border-bottom: none;
}

.category-name-lg {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

.category-meta {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
}

.btn-toggle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.row-parent:hover .btn-toggle {
  border-color: #4f46e5;
  color: #4f46e5;
}

/* --- CHILD ROW --- */
.row-child {
  background-color: #ffffff;
}

.row-child:hover {
  background-color: #f9fafb;
}

.child-name {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.tree-connector {
  position: absolute;
  top: -25px;
  left: 28px;
  width: 20px;
  height: 45px;
  border-left: 2px solid #e5e7eb;
  border-bottom: 2px solid #e5e7eb;
  border-bottom-left-radius: 12px;
  z-index: 1;
}

.tree-connector.is-last {
  height: 45px;
}

.badge-soft {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.badge-active {
  background-color: #dcfce7;
  color: #166534;
}

.badge-inactive {
  background-color: #f3f4f6;
  color: #4b5563;
}

.badge-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.text-sm {
  font-size: 0.85rem;
  color: #4b5563;
}

.btn-icon,
.btn-icon-sm {
  border: none;
  background: transparent;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-icon {
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  color: #9ca3af;
}

.btn-icon:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
}

.btn-delete:hover {
  color: #dc2626;
  background-color: #fee2e2;
}

.btn-icon-sm {
  width: 30px;
  height: 30px;
  font-size: 0.9rem;
  color: #d1d5db;
}

.btn-icon-sm:hover {
  color: #4f46e5;
}

.btn-delete-sm:hover {
  color: #dc2626;
}

.alert-danger-soft {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
}

.opacity-50 {
  opacity: 0.5;
}
</style>