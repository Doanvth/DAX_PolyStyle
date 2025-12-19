<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-collection-play-fill"></i></div>
          <div class="info">
            <h3>{{ stats.total }}</h3>
            <p>Tổng bộ sưu tập</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-eye-fill"></i></div>
          <div class="info">
            <h3>{{ stats.active }}</h3>
            <p>Đang hiển thị</p>
          </div>
        </div>
        <div class="stat-card gray">
          <div class="icon"><i class="bi bi-eye-slash-fill"></i></div>
          <div class="info">
            <h3>{{ stats.inactive }}</h3>
            <p>Đang ẩn</p>
          </div>
        </div>
      </div>
    </div>

    <div class="status-tabs">
      <button v-for="tab in tabs" :key="tab.value" class="tab-btn" :class="{ active: currentStatus === tab.value }"
        @click="setFilter(tab.value)">
        {{ tab.label }}
        <span class="count-badge">{{ getCountByStatus(tab.value) }}</span>
      </button>
    </div>

    <div class="toolbar-top">
      <div class="left-actions">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" type="text" placeholder="Tìm tên BST, chủ đề..." />
        </div>
      </div>

      <div class="right-actions">
        <router-link :to="{ name: 'collection-add' }" class="btn-primary-custom">
          <i class="bi bi-plus-lg"></i> Thêm mới
        </router-link>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="5%">ID</th>
            <th width="30%">Bộ sưu tập</th>
            <th width="20%">Chủ đề (Subtitle)</th>
            <th width="15%" class="text-center">Số lượng SP</th>
            <th width="15%">Trạng Thái</th>
            <th width="10%">Ngày tạo</th>
            <th width="5%" class="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedCollections" :key="item.id">
            <td class="text-muted text-xs">#{{ item.id }}</td>

            <td>
              <div class="product-info-row">
                <img :src="item.image" class="collection-thumb" alt="img"
                  @error="e => e.target.src = 'https://placehold.co/80x50?text=No+Img'" />
                <div class="info-text">
                  <span class="product-name">{{ item.title }}</span>
                  <span class="sku-badge text-xs">{{ item.hotline }}</span>
                </div>
              </div>
            </td>

            <td class="text-sm text-gray-700">{{ item.subtitle }}</td>

            <td class="text-center">
              <span class="count-pill">{{ item.productCount }}</span>
            </td>

            <td>
              <div class="status-toggle" @click="toggleStatus(item)">
                <span class="dot" :class="item.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                {{ item.status === 'active' ? 'Hiển thị' : 'Đang ẩn' }}
              </div>
            </td>

            <td class="text-muted text-xs">{{ item.createAt }}</td>

            <td class="text-center">
              <button class="btn-icon" title="Xem chi tiết" @click="openModal(item)">
                <i class="bi bi-pencil-square text-blue"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredCollections.length === 0" class="empty-state">
        <i class="bi bi-images"></i>
        <p>Không tìm thấy bộ sưu tập nào.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredCollections.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> -
        <b>{{ Math.min(currentPage * itemsPerPage, filteredCollections.length) }}</b>
        trong tổng <b>{{ filteredCollections.length }}</b> kết quả
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
          <div class="modal-title-group">
            <h3>{{ selectedItem.title }}</h3>
            <span class="status-badge-modal" :class="selectedItem.status">
              {{ selectedItem.status === 'active' ? 'Đang hiển thị' : 'Đang ẩn' }}
            </span>
          </div>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="modal-cover-wrapper">
            <img :src="selectedItem.image" alt="Cover">
            <div class="cover-overlay">
              <span>{{ selectedItem.subtitle }}</span>
            </div>
          </div>

          <div class="modal-info-grid">
            <div class="info-item">
              <label>Ngày tạo</label>
              <p>{{ selectedItem.createAt }}</p>
            </div>
            <div class="info-item">
              <label>Số lượng sản phẩm</label>
              <p>{{ selectedItem.productCount }} sản phẩm</p>
            </div>
            <div class="info-item">
              <label>Hotline phụ trách</label>
              <p class="text-blue">{{ selectedItem.hotline }}</p>
            </div>
            <div class="info-item">
              <label>Link truy cập</label>
              <p class="text-blue cursor-pointer">/collections/{{ selectedItem.id }}</p>
            </div>
            <div class="info-item full">
              <label>Mô tả / Thông điệp</label>
              <p class="desc-text">{{ selectedItem.description }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Đóng</button>
          <button class="btn-primary-custom">Chỉnh sửa nội dung</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const generateData = () => {
  const data = [
    { id: 1, title: 'FLOW MOTION 2025', subtitle: 'Thu Đông Collection', image: 'https://placehold.co/600x300/2a2a72/FFF?text=Flow', status: 'active', productCount: 24, createAt: '20/11/2025', description: 'Lấy cảm hứng từ sự chuyển động không ngừng, BST mang đến làn gió mới cho thời trang công sở.', hotline: '0972.359.666' },
    { id: 2, title: 'SUMMER VIBES', subtitle: 'Hè Rực Rỡ', image: 'https://placehold.co/600x300/e67e22/FFF?text=Summer', status: 'inactive', productCount: 18, createAt: '15/05/2025', description: 'Sắc màu rực rỡ của mùa hè nhiệt đới.', hotline: '0972.359.666' },
    { id: 3, title: 'ELEGANT LADY', subtitle: 'Dự Tiệc Sang Trọng', image: 'https://placehold.co/600x300/8e44ad/FFF?text=Elegant', status: 'active', productCount: 12, createAt: '10/10/2025', description: 'Đẳng cấp quý cô trong các bữa tiệc đêm.', hotline: '0988.111.222' },
    { id: 4, title: 'STILLNESS OF SNOW', subtitle: 'Đông 2024', image: 'https://placehold.co/600x300/ecf0f1/333?text=Snow', status: 'active', productCount: 30, createAt: '01/12/2024', description: 'Vẻ đẹp tĩnh lặng của mùa đông qua các thiết kế len và dạ cao cấp.', hotline: '0972.359.666' },
    { id: 5, title: 'TẾT VIỆT 2025', subtitle: 'Áo Dài Truyền Thống', image: 'https://placehold.co/600x300/c0392b/FFF?text=Tet', status: 'inactive', productCount: 45, createAt: '01/01/2025', description: 'Nét đẹp truyền thống kết hợp hơi thở hiện đại.', hotline: '0972.359.666' },
  ];

  for (let i = 6; i <= 20; i++) {
    data.push({
      id: i,
      title: `Collection Season ${i}`,
      subtitle: `Trend ${2025 + i}`,
      image: `https://placehold.co/600x300?text=Coll+${i}`,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      productCount: Math.floor(Math.random() * 50) + 5,
      createAt: '25/11/2025',
      description: 'Mô tả ngắn gọn về bộ sưu tập này...',
      hotline: '1900.1000'
    })
  }
  return data;
};

const collections = ref(generateData());

const searchQuery = ref("");
const currentStatus = ref("all");
const currentPage = ref(1);
const itemsPerPage = 8;
const showModal = ref(false);
const selectedItem = ref({});

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hiển thị', value: 'active' },
  { label: 'Đang ẩn', value: 'inactive' }
];

const filteredCollections = computed(() => {
  let result = collections.value;
  if (currentStatus.value !== 'all') {
    result = result.filter(item => item.status === currentStatus.value);
  }
  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(item =>
      item.title.toLowerCase().includes(key) ||
      item.subtitle.toLowerCase().includes(key)
    );
  }
  return result;
});

const paginatedCollections = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCollections.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredCollections.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  return {
    total: collections.value.length,
    active: collections.value.filter(i => i.status === 'active').length,
    inactive: collections.value.filter(i => i.status === 'inactive').length,
  };
});

const setFilter = (status) => {
  currentStatus.value = status;
  currentPage.value = 1;
};

const getCountByStatus = (status) => {
  if (status === 'all') return collections.value.length;
  return collections.value.filter(i => i.status === status).length;
};

const toggleStatus = (item) => {
  item.status = item.status === 'active' ? 'inactive' : 'active';
};

const openModal = (item) => {
  selectedItem.value = item;
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
  grid-template-columns: repeat(3, 1fr);
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

.gray .icon {
  background: #f3f4f6;
  color: #6b7280;
}

.status-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  overflow-x: auto;
  padding-bottom: 2px;
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
  text-decoration: none;
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

.product-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collection-thumb {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #eee;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 600;
  color: #111;
  font-size: 14px;
}

.sku-badge {
  color: #666;
  font-size: 11px;
}

.count-pill {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 12px;
  color: #374151;
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
}

.btn-icon:hover {
  color: #2563eb;
}

.text-center {
  text-align: center;
}

.text-xs {
  font-size: 11px;
}

.text-sm {
  font-size: 12px;
}

.text-muted {
  color: #9ca3af;
}

.text-gray-700 {
  color: #374151;
}

.text-blue {
  color: #2563eb;
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

.modal-content {
  background: white;
  width: 550px;
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
  margin-bottom: 4px;
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
  position: relative;
  height: 180px;
  width: 100%;
}

.modal-cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  color: white;
}

.cover-overlay span {
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
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

.info-item.full {
  grid-column: 1 / -1;
}

.desc-text {
  line-height: 1.5;
  color: #4b5563;
  font-weight: 400 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.modal-footer {
  padding: 15px 20px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #f3f4f6;
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