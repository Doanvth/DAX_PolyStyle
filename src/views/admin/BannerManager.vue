<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-card-image"></i></div>
          <div class="info">
            <h3>{{ stats.total }}</h3>
            <p>Tổng Banner</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-display"></i></div>
          <div class="info">
            <h3>{{ stats.active }}</h3>
            <p>Đang hiển thị</p>
          </div>
        </div>
        <div class="stat-card gray">
          <div class="icon"><i class="bi bi-eye-slash"></i></div>
          <div class="info">
            <h3>{{ stats.inactive }}</h3>
            <p>Đang ẩn</p>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbar-custom">
      <div class="tabs-row">
        <button v-for="tab in tabs" :key="tab.value" class="tab-btn-new" :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value">
          {{ tab.label }} <span class="tab-count">{{ getCount(tab.value) }}</span>
        </button>
      </div>

      <div class="actions-row">
        <div class="search-filter-group">
          <div class="search-box-new">
            <i class="bi bi-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Tìm tên banner, mô tả..." />
          </div>

          <select v-model="filterPosition" class="select-filter">
            <option value="all">Tất cả vị trí</option>
            <option value="Home Slider">Trang chủ (Slider)</option>
            <option value="Sidebar Right">Cột phải (Sidebar)</option>
            <option value="Popup">Popup quảng cáo</option>
          </select>
        </div>

        <router-link to="/admin/addbanners" class="btn-primary-custom">
          <i class="bi bi-plus-lg"></i> Thêm Banner
        </router-link>
      </div>
    </div>

    <div class="table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Thông tin chi tiết</th>
            <th>Vị trí</th>
            <th>Trạng thái (Bấm để đổi)</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="banner in filteredBanners" :key="banner.id">
            <td>
              <div class="banner-thumb-wrapper shadow-sm">
                <img :src="displayImage(banner.image)" class="banner-thumb" />
              </div>
            </td>
            <td>
              <div class="info-text">
                <span class="banner-title text-truncate">{{ banner.title }}</span>
                <span class="link-text text-truncate">
                  <i class="bi bi-link-45deg"></i> {{ banner.link || 'Không có liên kết' }}
                </span>
              </div>
            </td>
            <td>
              <span class="badge-purple">{{ banner.position }}</span>
              <div class="order-small">Thứ tự: {{ banner.order }}</div>
            </td>
            <td>
              <div class="status-toggle-box" @click="toggleStatus(banner)"
                :title="banner.status === 'active' ? 'Nhấn để Ẩn' : 'Nhấn để Hiện'">
                <div class="status-pill" :class="banner.status">
                  <span class="dot"></span>
                  {{ banner.status === 'active' ? 'Đang chạy' : 'Đang ẩn' }}
                </div>
              </div>
            </td>
            <td>
              <div class="actions-cell">
                <button class="btn-icon text-blue" @click="$router.push(`/admin/banner/edit/${banner.id}`)" title="Sửa">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn-icon text-red" @click="deleteBanner(banner.id)" title="Xóa">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredBanners.length === 0">
            <td colspan="5" class="empty-state">
              <i class="bi bi-inbox"></i>
              <p>Không tìm thấy banner nào phù hợp</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const banners = ref([]);
const searchQuery = ref("");
const currentTab = ref("all");
const filterPosition = ref("all"); // Biến lọc vị trí mới

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hiện', value: 'active' },
  { label: 'Đang ẩn', value: 'inactive' }
];

const fetchBanners = async () => {
  try {
    const res = await axios.get('http://localhost:3000/carousel');
    banners.value = res.data.filter(b => b.id);
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
};

const getCount = (tabValue) => {
  if (tabValue === 'all') return banners.value.length;
  return banners.value.filter(b => b.status === tabValue).length;
};

const toggleStatus = async (banner) => {
  const newStatus = banner.status === 'active' ? 'inactive' : 'active';
  try {
    await axios.patch(`http://localhost:3000/carousel/${banner.id}`, {
      status: newStatus
    });
    banner.status = newStatus;
  } catch (err) {
    alert("Lỗi khi cập nhật trạng thái!");
  }
};

const deleteBanner = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
    try {
      await axios.delete(`http://localhost:3000/carousel/${id}`);
      banners.value = banners.value.filter(b => b.id !== id);
    } catch (err) {
      alert("Xóa thất bại!");
    }
  }
};

const displayImage = (img) => {
  if (!img) return 'https://via.placeholder.com/150x70?text=No+Image';
  return Array.isArray(img) ? (img[0]?.image_url || img[0]) : img;
};

const filteredBanners = computed(() => {
  return banners.value.filter(b => {
    const matchTab = currentTab.value === 'all' || b.status === currentTab.value;
    const matchSearch = b.title?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchPosition = filterPosition.value === 'all' || b.position === filterPosition.value;
    return matchTab && matchSearch && matchPosition;
  });
});

const stats = computed(() => ({
  total: banners.value.length,
  active: banners.value.filter(b => b.status === 'active').length,
  inactive: banners.value.filter(b => b.status === 'inactive').length
}));

onMounted(fetchBanners);
</script>

<style scoped>
.admin-container {
  padding: 25px;
  background: #f4f7fe;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.stat-card .icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.blue .icon {
  background: #eef2ff;
  color: #4338ca;
}

.green .icon {
  background: #ecfdf5;
  color: #059669;
}

.gray .icon {
  background: #f9fafb;
  color: #6b7280;
}

.stat-card h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.stat-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

/* Toolbar Custom (2 Hàng) */
.toolbar-custom {
  background: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.tabs-row {
  display: flex;
  gap: 10px;
}

.tab-btn-new {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: 0.3s;
  font-size: 14px;
}

.tab-btn-new.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.tab-count {
  font-size: 11px;
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 6px;
}

.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}

.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.search-filter-group {
  display: flex;
  gap: 12px;
  flex: 1;
}

.search-box-new {
  position: relative;
  width: 300px;
}

.search-box-new i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box-new input {
  width: 100%;
  padding: 9px 12px 9px 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  background: #f8fafc;
}

.select-filter {
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  min-width: 180px;
  background: white;
  color: #475569;
}

.btn-primary-custom {
  background: #2563eb;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
}

/* Table */
.table-container {
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  padding: 15px;
  text-align: left;
  color: #475569;
  font-weight: 700;
  font-size: 13px;
  border-bottom: 1px solid #f1f5f9;
}

td {
  padding: 15px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}

.banner-thumb-wrapper {
  width: 120px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #f1f5f9;
}

.banner-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-title {
  font-weight: 700;
  color: #1e293b;
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
}

.link-text {
  font-size: 12px;
  color: #2563eb;
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge-purple {
  background: #f5f3ff;
  color: #7c3aed;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.order-small {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

/* Status Pill */
.status-toggle-box {
  cursor: pointer;
  display: inline-block;
  transition: 0.2s;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-pill.active {
  background: #ecfdf5;
  color: #059669;
}

.status-pill.inactive {
  background: #f1f5f9;
  color: #64748b;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.active .dot {
  background: #10b981;
}

.inactive .dot {
  background: #94a3b8;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #94a3b8;
  transition: 0.2s;
}

.text-blue:hover {
  color: #2563eb;
}

.text-red:hover {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
}
</style>