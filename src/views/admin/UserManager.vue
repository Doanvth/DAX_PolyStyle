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
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-btn"
        :class="{ active: currentTab === tab.value }"
        @click="setFilter(tab.value)"
      >
        {{ tab.label }}
        <span class="count-badge">{{ getCountByTab(tab.value) }}</span>
      </button>
    </div>

    <div class="toolbar-top">
      <div class="left-actions">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm tên, email..."
          />
        </div>
      </div>

      <div class="right-actions">
        <button class="btn-outline-custom">
          <i class="bi bi-file-earmark-excel"></i> Xuất Excel
        </button>
        <button class="btn-primary-custom" @click="goToAddPage">
          <i class="bi bi-person-plus-fill"></i> Thêm người dùng
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
                <img
                  :src="user.avatar || 'https://placehold.co/40x40'"
                  class="avatar-thumb"
                  @error="
                    (e) =>
                      (e.target.src =
                        'https://placehold.co/40x40?text=' +
                        (user.fullname ? user.fullname.charAt(0) : 'U'))
                  "
                />
                <div class="info-text">
                  <span class="customer-name">{{ user.fullname }}</span>
                  <span class="customer-phone text-xs"
                    ><i class="bi bi-telephone"></i> {{ user.phone }}</span
                  >
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <div class="spending-info">
                <span class="total-spend">{{
                  formatCurrency(user.totalSpend || 0)
                }}</span>
                <span class="order-count text-xs text-muted"
                  >{{ user.orderCount || 0 }} đơn hàng</span
                >
              </div>
            </td>
            <td>
              <div class="status-toggle" @click="toggleStatus(user)">
                <span
                  class="dot"
                  :class="user.status === 'active' ? 'bg-success' : 'bg-gray'"
                ></span>
                {{ user.status === "active" ? "Hoạt động" : "Bị khóa" }}
              </div>
            </td>
            <td class="text-center">
              <button
                class="btn-icon"
                title="Xem hồ sơ"
                @click="openModal(user)"
              >
                <i class="bi bi-person-lines-fill text-blue"></i>
              </button>
              <button class="btn-icon" title="Sửa" @click="editUser(user.id)">
                <i class="bi bi-pencil-square text-blue"></i>
              </button>
              <button
                class="btn-icon delete"
                title="Xóa"
                @click="deleteUser(user.id)"
              >
                <i class="bi bi-trash text-red"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-footer" v-if="filteredUsers.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> -
        <b>{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</b>
        trong tổng <b>{{ filteredUsers.length }}</b> khách hàng
      </div>
      <div class="page-controls">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="current-page"
          >Trang {{ currentPage }} / {{ totalPages }}</span
        >
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content profile-modal">
        <div class="modal-header">
          <h3 class="mb-0">Hồ sơ khách hàng</h3>
          <button class="close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body p-0">
          <div class="profile-cover">
            <div class="profile-avatar-wrapper">
              <img
                :src="selectedUser.avatar || 'https://placehold.co/70x70'"
                class="profile-avatar-lg"
              />
            </div>
          </div>
          <div class="profile-details">
            <div class="text-center mb-3">
              <h4 class="profile-name">{{ selectedUser.fullname }}</h4>
              <span class="text-muted text-xs">ID: #{{ selectedUser.id }}</span>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label>Email</label>
                <p>{{ selectedUser.email }}</p>
              </div>
              <div class="info-item">
                <label>Điện thoại</label>
                <p>{{ selectedUser.phone }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
<<<<<<< Updated upstream
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const API_URL = "http://localhost:3000/users";

const users = ref([]);
=======
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const users = ref([]);

const initialData = [
  { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@gmail.com', phone: '0123456789', role: '1', status: 'active', avatar: '' },
  { id: 2, name: 'Trần Thị User', email: 'user@gmail.com', phone: '0987654321', role: '0', status: 'active', avatar: '' },
  { id: 3, name: 'Lê Văn Staff', email: 'staff@gmail.com', phone: '0912345678', role: '2', status: 'suspended', avatar: '' },
];

onMounted(() => {
  const storedUsers = localStorage.getItem('users');
  
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  } else {
    users.value = initialData;
    localStorage.setItem('users', JSON.stringify(initialData));
  }
});

>>>>>>> Stashed changes
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 8;
const currentTab = ref("all");
const showModal = ref(false);
const selectedUser = ref({});

<<<<<<< Updated upstream
const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Hoạt động", value: "active" },
  { label: "Bị khóa", value: "suspended" },
];

// 1. Dùng Named Route 'user-add' để khớp với file Router bạn gửi
const goToAddPage = () => {
  router.push({ name: "user-add" });
};

const editUser = (id) => {
  router.push({ name: "user-add", query: { id: id } });
};

const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL);
    // Map fullname sang name nếu Template yêu cầu
    users.value = res.data.map((u) => ({
      ...u,
      name: u.fullname || u.name,
    }));
  } catch (e) {
    console.error("Lỗi kết nối API:", e);
  }
};

onMounted(fetchUsers);

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val || 0
  );

const setFilter = (tab) => {
  currentTab.value = tab;
  currentPage.value = 1;
};

const getCountByTab = (tab) => {
  if (tab === "all") return users.value.length;
  return users.value.filter((u) => u.status === tab).length;
};

const filteredUsers = computed(() => {
  let res = users.value;
  if (currentTab.value !== "all")
    res = res.filter((u) => u.status === currentTab.value);
  if (searchQuery.value) {
    const k = searchQuery.value.toLowerCase();
    res = res.filter(
      (u) =>
        u.fullname?.toLowerCase().includes(k) ||
        u.email?.toLowerCase().includes(k)
    );
  }
  return res;
});

const paginatedUsers = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(s, s + itemsPerPage);
});

const totalPages = computed(
  () => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1
);

const stats = computed(() => ({
  total: users.value.length,
  new: users.value.filter((u) => u.id > 2).length,
  active: users.value.filter((u) => u.status === "active").length,
  suspended: users.value.filter((u) => u.status === "suspended").length,
}));

const openModal = (u) => {
  selectedUser.value = u;
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};

const toggleStatus = async (user) => {
  const newS = user.status === "active" ? "suspended" : "active";
  try {
    await axios.patch(`${API_URL}/${user.id}`, { status: newS });
    user.status = newS;
  } catch (e) {
    alert("Lỗi cập nhật!");
  }
};

const deleteUser = async (id) => {
  if (confirm("Xóa khách hàng này?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      users.value = users.value.filter((u) => u.id !== id);
    } catch (e) {
      alert("Lỗi xóa!");
=======
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const key = searchQuery.value.toLowerCase();
  return users.value.filter(u => 
    (u.name && u.name.toLowerCase().includes(key)) || 
    (u.email && u.email.toLowerCase().includes(key))
  );
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1);

const stats = computed(() => ({
  total: users.value.length,
  new: users.value.filter(u => u.id > 3).length, 
  active: users.value.filter(u => u.status === 'active').length,
  suspended: users.value.filter(u => u.status === 'suspended').length
}));

const getRoleLabel = (role) => {
  const r = String(role); 
  if (r === '1') return 'Admin';
  if (r === '2') return 'Nhân viên';
  return 'Khách hàng';
};

const getRoleClass = (role) => {
  const r = String(role);
  if (r === '1') return 'badge-purple';
  if (r === '2') return 'badge-blue';
  return 'badge-gray';
};

const editUser = (id) => {
  router.push({ name: 'user-add', query: { id: id } });
};

const toggleStatus = (user) => {
  user.status = user.status === 'active' ? 'suspended' : 'active';
  localStorage.setItem('users', JSON.stringify(users.value));
};

const deleteUser = (id) => {
  if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
    users.value = users.value.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users.value));
    
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
>>>>>>> Stashed changes
    }
  }
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
  background: #f3f4f6;
  min-height: 100vh;
  font-family: -apple-system, sans-serif;
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
