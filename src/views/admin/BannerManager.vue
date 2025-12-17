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
        <div class="stat-card purple">
          <div class="icon"><i class="bi bi-sliders"></i></div>
          <div class="info">
            <h3>{{ stats.homeSlider }}</h3>
            <p>Slider Trang chủ</p>
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
          <input v-model="searchQuery" type="text" placeholder="Tìm tên banner, mô tả..." @input="currentPage = 1" />
        </div>
        <select v-model="selectedPosition" class="filter-select" @change="currentPage = 1">
          <option value="">Tất cả vị trí</option>
          <option value="Home Slider">Slider Trang chủ</option>
          <option value="Sidebar Right">Sidebar Phải</option>
          <option value="Footer Banner">Footer</option>
          <option value="Popup Sale">Popup Khuyến mãi</option>
        </select>
      </div>

      <div class="right-actions">
        <router-link to="/admin/addbanners" class="btn-primary-custom">
          <i class="bi bi-plus-lg"></i> Thêm Banner
        </router-link>
      </div>
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading-overlay">Đang tải dữ liệu...</div>
      <table v-else>
        <thead>
          <tr>
            <th width="5%">ID</th>
            <th width="35%">Hình ảnh & Tiêu đề</th>
            <th width="15%">Vị trí</th>
            <th width="10%" class="text-center">Thứ tự</th>
            <th width="15%">Liên kết (Link)</th>
            <th width="10%">Trạng Thái</th>
            <th width="10%" class="text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedBanners" :key="item.id">
            <td class="text-muted text-xs">#{{ item.id }}</td>
            <td>
              <div class="banner-info-row">
                <div class="banner-thumb-wrapper">
                  <img :src="displayImage(item.image)" class="banner-thumb" alt="banner-img"
                    @error="e => e.target.src = 'https://placehold.co/120x60?text=Lỗi+Ảnh'" />
                </div>
                <div class="info-text">
                  <span class="banner-title">{{ item.title || 'Chưa đặt tiêu đề' }}</span>
                  <span class="text-xs text-muted">{{ item.createAt || '17/12/2025' }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="position-badge" :class="getPositionClass(item.position)">
                {{ item.position || 'N/A' }}
              </span>
            </td>
            <td class="text-center">
              <span class="order-badge">{{ item.order || 0 }}</span>
            </td>
            <td>
              <a :href="item.link" target="_blank" class="link-text text-truncate">
                {{ item.link || '#' }} <i class="bi bi-box-arrow-up-right text-xs"></i>
              </a>
            </td>
            <td>
              <div class="status-toggle" @click="toggleStatus(item)">
                <span class="dot" :class="item.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                {{ item.status === 'active' ? 'Hiển thị' : 'Ẩn' }}
              </div>
            </td>
            <td class="text-center">
              <button class="btn-icon" title="Chỉnh sửa" @click="openModal(item, true)">
                <i class="bi bi-pencil-square text-blue"></i>
              </button>
              <button class="btn-icon delete" title="Xóa" @click="deleteBanner(item.id)">
                <i class="bi bi-trash text-red"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && filteredBanners.length === 0" class="empty-state">
        <i class="bi bi-card-image"></i>
        <p>Không tìm thấy banner nào phù hợp.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredBanners.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> -
        <b>{{ Math.min(currentPage * itemsPerPage, filteredBanners.length) }}</b>
        trong tổng <b>{{ filteredBanners.length }}</b> banner
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
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Chỉnh sửa' : 'Chi tiết' }} Banner #{{ selectedBanner.id }}</h3>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="modal-cover-wrapper">
            <img :src="displayImage(isEditing ? editForm.image : selectedBanner.image)" alt="Preview">
          </div>

          <div class="modal-info-grid">
            <div class="info-item">
              <label>Tên Banner (Tiêu đề)</label>
              <input v-if="isEditing" type="text" v-model="editForm.title" class="modal-input" />
              <p v-else class="fw-bold">{{ selectedBanner.title }}</p>
            </div>

            <div class="info-item">
              <label>Trạng thái</label>
              <select v-if="isEditing" v-model="editForm.status" class="modal-input">
                <option value="active">Hiển thị (Active)</option>
                <option value="inactive">Ẩn (Inactive)</option>
              </select>
              <p v-else>
                <span :class="selectedBanner.status === 'active' ? 'text-green' : 'text-gray'">
                  ● {{ selectedBanner.status === 'active' ? 'Đang hiển thị' : 'Đang ẩn' }}
                </span>
              </p>
            </div>

            <div class="info-item">
              <label>Vị trí hiển thị</label>
              <select v-if="isEditing" v-model="editForm.position" class="modal-input">
                <option value="Home Slider">Slider Trang chủ</option>
                <option value="Sidebar Right">Sidebar Phải</option>
                <option value="Footer Banner">Footer</option>
                <option value="Popup Sale">Popup Khuyến mãi</option>
              </select>
              <p v-else class="fw-bold">{{ selectedBanner.position }}</p>
            </div>

            <div class="info-item">
              <label>Thứ tự ưu tiên</label>
              <input v-if="isEditing" type="number" v-model="editForm.order" class="modal-input" />
              <p v-else>{{ selectedBanner.order }}</p>
            </div>

            <div class="info-item full">
              <label>Đường dẫn ảnh (Image URL)</label>
              <input v-if="isEditing" type="text" v-model="editForm.image" class="modal-input"
                placeholder="Dán URL ảnh từ Unsplash hoặc nguồn khác..." />
              <p v-else class="text-muted text-xs break-word">{{ displayImage(selectedBanner.image) }}</p>
            </div>

            <div class="info-item full">
              <label>Liên kết mục tiêu (Target Link)</label>
              <input v-if="isEditing" type="text" v-model="editForm.link" class="modal-input" />
              <p v-else class="text-blue break-word">{{ selectedBanner.link }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Hủy bỏ</button>
          <button v-if="!isEditing" class="btn-primary-custom" @click="isEditing = true">Sửa thông tin</button>
          <button v-else class="btn-primary-custom" @click="saveEdit">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Cấu hình
const API_URL = 'http://localhost:3000/carousel';

// State
const banners = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedPosition = ref("");
const currentTab = ref("all");
const currentPage = ref(1);
const itemsPerPage = 6;

const showModal = ref(false);
const isEditing = ref(false);
const selectedBanner = ref({});
const editForm = ref({ id: null, title: '', status: 'active', position: '', order: 0, link: '', image: '' });

const displayImage = (imageData) => {
  const fallback = 'https://placehold.co/600x300?text=No+Image';

  if (!imageData) return fallback;

  if (Array.isArray(imageData)) {
    const first = imageData[0];
    if (
      first &&
      typeof first.image_url === 'string' &&
      first.image_url.trim() !== ''
    ) {
      return first.image_url;
    }
    return fallback;
  }
  if (typeof imageData === 'string' && imageData.trim() !== '') {
    return imageData;
  }

  return fallback;
};

// 2. Fetch dữ liệu từ API
const fetchBanners = async () => {
  loading.value = true;
  try {
    const response = await axios.get(API_URL);
    banners.value = response.data.filter(item => item.id && item.id !== "");
  } catch (error) {
    console.error("Lỗi API:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBanners);

// 3. Nghiệp vụ: Thay đổi trạng thái nhanh
const toggleStatus = async (item) => {
  const newStatus = item.status === 'active' ? 'inactive' : 'active';
  try {
    await axios.patch(`${API_URL}/${item.id}`, { status: newStatus });
    item.status = newStatus;
  } catch (error) {
    alert('Không thể cập nhật trạng thái!');
  }
};

// 4. Nghiệp vụ: Xóa banner
const deleteBanner = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa banner này vĩnh viễn?')) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      banners.value = banners.value.filter(b => b.id !== id);
    } catch (error) {
      alert('Lỗi khi xóa dữ liệu!');
    }
  }
};

// 5. Nghiệp vụ: Modal & Lưu chỉnh sửa
const openModal = (item, editMode = false) => {
  selectedBanner.value = item;
  isEditing.value = editMode;
  editForm.value = { ...item };
  // Chuẩn hóa ảnh mảng về chuỗi để hiển thị trong input edit
  if (Array.isArray(editForm.value.image)) {
    editForm.value.image = displayImage(editForm.value.image);
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
};

const saveEdit = async () => {
  try {
    const response = await axios.put(`${API_URL}/${editForm.value.id}`, editForm.value);
    const index = banners.value.findIndex(b => b.id === editForm.value.id);
    if (index !== -1) {
      banners.value[index] = response.data;
      alert('Cập nhật thành công!');
      closeModal();
    }
  } catch (error) {
    alert('Lỗi lưu dữ liệu!');
  }
};

// 6. Logic Lọc & Thống kê
const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hiển thị', value: 'active' },
  { label: 'Đang ẩn', value: 'inactive' }
];

const filteredBanners = computed(() => {
  let result = banners.value;
  if (currentTab.value !== 'all') result = result.filter(b => b.status === currentTab.value);
  if (selectedPosition.value) result = result.filter(b => b.position === selectedPosition.value);
  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(b => (b.title || '').toLowerCase().includes(key));
  }
  return result;
});

const paginatedBanners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBanners.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredBanners.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  return {
    total: banners.value.length,
    active: banners.value.filter(b => b.status === 'active').length,
    inactive: banners.value.filter(b => b.status === 'inactive').length,
    homeSlider: banners.value.filter(b => (b.position || '').toLowerCase().includes('slider')).length,
  };
});

const setFilter = (tab) => {
  currentTab.value = tab;
  currentPage.value = 1;
};

const getCountByTab = (tab) => {
  if (tab === 'all') return banners.value.length;
  return banners.value.filter(b => b.status === tab).length;
};

const getPositionClass = (pos) => {
  const p = (pos || '').toLowerCase();
  if (p.includes('slider')) return 'badge-purple';
  if (p.includes('popup')) return 'badge-red';
  if (p.includes('sidebar')) return 'badge-blue';
  return 'badge-gray';
};
</script>
<style scoped>
/* --- BASE STYLE --- */
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
  font-size: 13px;
}

/* --- STATS --- */
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

/* --- TABS --- */
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

/* --- TOOLBAR --- */
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
  width: 300px;
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

.filter-select {
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  background: white;
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
  text-decoration: none;
}

/* --- TABLE --- */
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

/* Banner Custom Rows */
.banner-info-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.banner-thumb-wrapper {
  width: 100px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid #eee;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.banner-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-weight: 600;
  color: #111;
  font-size: 13px;
  max-width: 250px;
}

.position-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.badge-purple {
  background: #f3e8ff;
  color: #a855f7;
}

.badge-red {
  background: #fee2e2;
  color: #ef4444;
}

.badge-blue {
  background: #dbeafe;
  color: #1e40af;
}

.badge-gray {
  background: #f3f4f6;
  color: #4b5563;
}

.order-badge {
  background: #f3f4f6;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: #374151;
}

.link-text {
  color: #2563eb;
  text-decoration: none;
  font-size: 12px;
  display: block;
  max-width: 200px;
}

.link-text:hover {
  text-decoration: underline;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.text-muted {
  color: #9ca3af;
}

.text-xs {
  font-size: 11px;
}

.text-center {
  text-align: center;
}

/* --- PAGINATION --- */
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

/* --- MODAL CHỈNH SỬA BỔ SUNG --- */
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

.modal-content {
  background: white;
  width: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease-out;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title-group h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111;
  display: inline-block;
  margin-right: 10px;
}

.status-badge-modal {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-badge-modal.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge-modal.inactive {
  background: #f3f4f6;
  color: #4b5563;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  padding: 0;
}

.modal-cover-wrapper {
  width: 100%;
  max-height: 250px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-cover-wrapper img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 20px;
}

.info-item label {
  font-size: 11px;
  text-transform: uppercase;
  color: #9ca3af;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.info-item p {
  margin: 0;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

/* CSS cho input trong modal */
.modal-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.info-item.full {
  grid-column: 1 / -1;
}

.fw-bold {
  font-weight: 700;
}

.break-word {
  word-break: break-all;
}

.modal-footer {
  padding: 15px 20px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #f3f4f6;
}

.btn-outline-custom {
  background: white;
  border: 1px solid #d1d5db;
  padding: 7px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
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