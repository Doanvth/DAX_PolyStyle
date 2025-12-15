<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-people-fill"></i></div>
          <div class="info">
            <h3>{{ stats.total }}</h3>
            <p>Tổng khách hàng</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-person-plus-fill"></i></div>
          <div class="info">
            <h3>{{ stats.new }}</h3>
            <p>Khách mới tháng này</p>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="icon"><i class="bi bi-person-check-fill"></i></div>
          <div class="info">
            <h3>{{ stats.active }}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <div class="stat-card gray">
          <div class="icon"><i class="bi bi-person-x-fill"></i></div>
          <div class="info">
            <h3>{{ stats.suspended }}</h3>
            <p>Tài khoản bị khóa</p>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbar-top">
      <div class="left-actions">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" type="text" placeholder="Tìm tên, email..." />
        </div>
      </div>

      <div class="right-actions">
        <router-link :to="{ name: 'user-add' }" class="btn-primary-custom">
          <i class="bi bi-person-plus-fill"></i> Thêm người dùng
        </router-link>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Thông tin</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td class="text-muted text-xs">#{{ user.id }}</td>
            <td>
              <div class="customer-info-row">
                <img :src="user.avatar" class="avatar-thumb"
                  @error="e => e.target.src = 'https://placehold.co/40x40?text=' + user.name.charAt(0)">
                <div class="info-text">
                  <span class="customer-name fw-bold">{{ user.name }}</span>
                  <span class="customer-phone text-xs">{{ user.phone }}</span>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="getRoleClass(user.role)">{{ getRoleLabel(user.role) }}</span>
            </td>
            <td>
              <div class="status-toggle" @click="toggleStatus(user)">
                <span class="dot" :class="user.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                {{ user.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
              </div>
            </td>
            <td class="text-center">
              <!-- Nút Sửa -->
              <button class="btn-icon" title="Sửa" @click="editUser(user.id)">
                <i class="bi bi-pencil-square text-blue"></i>
              </button>
              <button class="btn-icon delete" title="Xóa" @click="deleteUser(user.id)"><i
                  class="bi bi-trash text-red"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="empty-state">
        <i class="bi bi-people"></i>
        <p>Không tìm thấy khách hàng nào.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredUsers.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> -
        <b>{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</b>
        trong tổng <b>{{ filteredUsers.length }}</b> khách hàng
      </div>
      <div class="page-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="current-page">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock Data
const users = ref([
  { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@gmail.com', phone: '0123456789', role: '1', status: 'active', avatar: '' },
  { id: 2, name: 'Trần Thị User', email: 'user@gmail.com', phone: '0987654321', role: '0', status: 'active', avatar: '' },
  { id: 3, name: 'Lê Văn Staff', email: 'staff@gmail.com', phone: '0912345678', role: '2', status: 'suspended', avatar: '' },
]);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 8;

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const key = searchQuery.value.toLowerCase();
  return users.value.filter(u => u.name.toLowerCase().includes(key) || u.email.toLowerCase().includes(key));
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1);

const stats = computed(() => ({
  total: users.value.length,
  new: 5,
  active: users.value.filter(u => u.status === 'active').length,
  suspended: users.value.filter(u => u.status === 'suspended').length
}));

const getRoleLabel = (role) => {
  if (role === '1') return 'Admin';
  if (role === '2') return 'Nhân viên';
  return 'Khách hàng';
};

const getRoleClass = (role) => {
  if (role === '1') return 'badge-purple';
  if (role === '2') return 'badge-blue';
  return 'badge-gray';
};

const editUser = (id) => {
  router.push({ name: 'user-add' });
};

const toggleStatus = (user) => {
  user.status = user.status === 'active' ? 'suspended' : 'active';
};

const deleteUser = (id) => {
  if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
    users.value = users.value.filter(u => u.id !== id);
  }
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
  background: #f3f4f6;
  min-height: 100vh;
  font-family: sans-serif;
  color: #374151;
}

.dashboard-header {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-card .icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.blue .icon {
  background: #eff6ff;
  color: #3b82f6;
}

.green .icon {
  background: #ecfdf5;
  color: #10b981;
}

.purple .icon {
  background: #f3e8ff;
  color: #a855f7;
}

.gray .icon {
  background: #f3f4f6;
  color: #6b7280;
}

.stat-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111;
}

.stat-card p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
}

.toolbar-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  width: 100%;
  padding: 7px 10px 7px 30px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.btn-primary-custom {
  background: #2563eb;
  color: white;
  padding: 7px 14px;
  border-radius: 6px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
}

.btn-outline-custom {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 7px 14px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px 15px;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #4b5563;
  font-size: 12px;
  text-transform: uppercase;
}

.customer-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-thumb {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.fw-bold {
  font-weight: 600;
}

.text-xs {
  font-size: 11px;
}

.role-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.badge-purple {
  background: #f3e8ff;
  color: #a855f7;
}

.badge-blue {
  background: #dbeafe;
  color: #1e40af;
}

.badge-gray {
  background: #f3f4f6;
  color: #4b5563;
}

.status-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  width: fit-content;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.bg-success {
  background: #10b981;
}

.bg-gray {
  background: #9ca3af;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  margin: 0 5px;
  color: #6b7280;
}

.text-blue {
  color: #2563eb;
}

.text-red {
  color: #ef4444;
}

.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-top: 1px solid #f3f4f6;
}

.page-info {
  color: #6b7280;
  font-size: 13px;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  font-weight: 600;
  color: #374151;
  font-size: 13px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}
</style>