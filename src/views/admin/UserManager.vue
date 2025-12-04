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

    <div class="status-tabs">
      <button v-for="tab in tabs" :key="tab.value" class="tab-btn" :class="{ active: currentTab === tab.value }"
        @click="setFilter(tab.value)">
        {{ tab.label }}
        <span class="count-badge">{{ getCountByTab(tab.value) }}</span>
      </button>
    </div>

    <div class="toolbar-top">
      <div class="left-actions">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" type="text" placeholder="Tìm tên, email, số điện thoại..." />
        </div>
      </div>

      <div class="right-actions">
        <button class="btn-outline-custom"><i class="bi bi-file-earmark-excel"></i> Xuất Excel</button>
        <button class="btn-primary-custom">
          <i class="bi bi-person-plus-fill"></i> Thêm khách hàng
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="5%">ID</th>
            <th width="35%">Thông tin khách hàng</th>
            <th width="25%">Email</th>
            <th width="20%">Lịch sử mua hàng</th>
            <th width="10%">Trạng thái</th>
            <th width="5%" class="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td class="text-muted text-xs">#{{ user.id }}</td>

            <td>
              <div class="customer-info-row">
                <img :src="user.avatar" class="avatar-thumb" alt="ava"
                  @error="e => e.target.src = 'https://placehold.co/40x40?text=' + user.name.charAt(0)" />
                <div class="info-text">
                  <span class="customer-name">{{ user.name }}</span>
                  <span class="customer-phone text-xs"><i class="bi bi-telephone"></i> {{ user.phone }}</span>
                </div>
              </div>
            </td>

            <td class="text-muted">{{ user.email }}</td>

            <td>
              <div class="spending-info">
                <span class="total-spend">{{ formatCurrency(user.totalSpend) }}</span>
                <span class="order-count text-xs text-muted">{{ user.orderCount }} đơn hàng</span>
              </div>
            </td>

            <td>
              <div class="status-toggle" @click="toggleStatus(user)">
                <span class="dot" :class="user.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                {{ user.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
              </div>
            </td>

            <td class="text-center">
              <button class="btn-icon" title="Xem hồ sơ" @click="openModal(user)">
                <i class="bi bi-person-lines-fill text-blue"></i>
              </button>
              <button class="btn-icon delete" title="Xóa" @click="deleteUser(user.id)">
                <i class="bi bi-trash text-red"></i>
              </button>
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

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content profile-modal">
        <div class="modal-header">
          <h3 class="mb-0">Hồ sơ khách hàng</h3>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body p-0">
          <div class="profile-cover">
            <div class="profile-avatar-wrapper">
              <img :src="selectedUser.avatar" class="profile-avatar-lg">
            </div>
          </div>

          <div class="profile-details">
            <div class="text-center mb-3">
              <h4 class="profile-name">{{ selectedUser.name }}</h4>
              <span class="text-muted text-xs">ID: #{{ selectedUser.id }}</span>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label><i class="bi bi-envelope"></i> Email</label>
                <p>{{ selectedUser.email }}</p>
              </div>
              <div class="info-item">
                <label><i class="bi bi-telephone"></i> Điện thoại</label>
                <p>{{ selectedUser.phone }}</p>
              </div>
              <div class="info-item">
                <label><i class="bi bi-calendar3"></i> Ngày tham gia</label>
                <p>{{ selectedUser.joinDate }}</p>
              </div>
              <div class="info-item">
                <label><i class="bi bi-geo-alt"></i> Địa chỉ</label>
                <p class="text-truncate">{{ selectedUser.address }}</p>
              </div>
            </div>

            <div class="stats-box-row">
              <div class="stat-mini">
                <span>Tổng chi tiêu</span>
                <b class="text-blue">{{ formatCurrency(selectedUser.totalSpend) }}</b>
              </div>
              <div class="stat-mini">
                <span>Đơn hàng</span>
                <b>{{ selectedUser.orderCount }}</b>
              </div>
              <div class="stat-mini">
                <span>Điểm thưởng</span>
                <b class="text-orange">{{ Math.floor(selectedUser.totalSpend / 10000) }}</b>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Đóng</button>
          <button class="btn-primary-custom">Gửi Email</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const generateUsers = () => {
  const data = [];
  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ'];
  const lastNames = ['Văn A', 'Thị B', 'Quốc C', 'Minh D', 'Ngọc E', 'Tuấn F'];

  for (let i = 1; i <= 40; i++) {
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const spend = Math.floor(Math.random() * 20000000);

    data.push({
      id: i,
      name: name,
      email: `customer${i}@gmail.com`,
      phone: `09${Math.floor(Math.random() * 100000000)}`,
      avatar: `https://placehold.co/100x100?text=${name.charAt(0)}`,
      joinDate: `${Math.floor(Math.random() * 28) + 1}/05/2025`,
      status: Math.random() > 0.1 ? 'active' : 'suspended',
      totalSpend: spend,
      orderCount: Math.floor(Math.random() * 20),
      address: `Số ${i} Đường ABC, Quận XYZ, TP.HCM`
    });
  }
  return data;
};

const users = ref(generateUsers());

const searchQuery = ref("");
const currentTab = ref("all");
const currentPage = ref(1);
const itemsPerPage = 8;
const showModal = ref(false);
const selectedUser = ref({});

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hoạt động', value: 'active' },
  { label: 'Bị khóa', value: 'suspended' }
];

const filteredUsers = computed(() => {
  let result = users.value;

  if (currentTab.value !== 'all') {
    result = result.filter(u => u.status === currentTab.value);
  }

  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(u =>
      u.name.toLowerCase().includes(key) ||
      u.email.toLowerCase().includes(key) ||
      u.phone.includes(key)
    );
  }
  return result;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  return {
    total: users.value.length,
    new: users.value.filter(u => parseInt(u.joinDate.split('/')[1]) === 5).length,
    active: users.value.filter(u => u.status === 'active').length,
    suspended: users.value.filter(u => u.status === 'suspended').length
  };
});

const setFilter = (tab) => {
  currentTab.value = tab;
  currentPage.value = 1;
};

const getCountByTab = (tab) => {
  if (tab === 'all') return users.value.length;
  return users.value.filter(u => u.status === tab).length;
};

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const toggleStatus = (user) => {
  user.status = user.status === 'active' ? 'suspended' : 'active';
};

const deleteUser = (id) => {
  if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
    users.value = users.value.filter(u => u.id !== id);
  }
};

const openModal = (user) => {
  selectedUser.value = user;
  showModal.value = true;
};
const closeModal = () => showModal.value = false;

</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
  font-size: 13px;
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.02);
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

.status-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.tab-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f9fafb;
}

.tab-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.count-badge {
  background: #f3f4f6;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
  color: #4b5563;
}

.tab-btn.active .count-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.toolbar-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.left-actions,
.right-actions {
  display: flex;
  gap: 10px;
}

.search-box {
  position: relative;
  width: 350px;
}

.search-box input {
  width: 100%;
  padding: 7px 10px 7px 30px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  font-size: 13px;
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
  border: none;
  padding: 7px 14px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f9fafb;
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  font-size: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

tr:hover td {
  background-color: #f9fafb;
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
  border: 1px solid #e5e7eb;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 600;
  color: #111;
}

.customer-phone {
  color: #6b7280;
}

.spending-info {
  display: flex;
  flex-direction: column;
}

.total-spend {
  font-weight: 600;
  color: #2563eb;
}

.status-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  width: fit-content;
}

.status-toggle .dot {
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
  color: #6b7280;
  font-size: 15px;
  margin-right: 5px;
}

.btn-icon:hover i {
  transform: scale(1.1);
}

.text-red {
  color: #ef4444;
}

.text-blue {
  color: #2563eb;
}

.text-orange {
  color: #f97316;
}

.text-muted {
  color: #9ca3af;
}

.text-xs {
  font-size: 11px;
}

.text-center {
  text-align: center;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content.profile-modal {
  background: white;
  width: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease-out;
}

.modal-header {
  padding: 12px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  position: relative;
}

.profile-cover {
  height: 100px;
  background: linear-gradient(to right, #2563eb, #60a5fa);
  position: relative;
  margin-bottom: 40px;
}

.profile-avatar-wrapper {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px;
  background: white;
  border-radius: 50%;
}

.profile-avatar-lg {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-name {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 700;
  color: #111;
}

.profile-details {
  padding: 0 20px 20px 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
  margin-bottom: 20px;
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
}

.info-item label {
  font-size: 11px;
  text-transform: uppercase;
  color: #9ca3af;
  font-weight: 600;
  display: block;
  margin-bottom: 3px;
}

.info-item p {
  margin: 0;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.stats-box-row {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f3f4f6;
  padding-top: 15px;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-mini span {
  font-size: 11px;
  color: #6b7280;
}

.stat-mini b {
  font-size: 15px;
  color: #111;
  margin-top: 2px;
}

.modal-footer {
  padding: 12px 20px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #f3f4f6;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes slideDown {
  from {
    transform: translateY(-15px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>