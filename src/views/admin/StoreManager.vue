<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-shop"></i></div>
          <div class="info">
            <h3>{{ stats.total }}</h3>
            <p>Tổng cửa hàng</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-check-circle"></i></div>
          <div class="info">
            <h3>{{ stats.active }}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="icon"><i class="bi bi-exclamation-triangle"></i></div>
          <div class="info">
            <h3>{{ stats.inactive }}</h3>
            <p>Đang đóng cửa</p>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="icon"><i class="bi bi-geo-alt-fill"></i></div>
          <div class="info">
            <h3>{{ stats.cities }}</h3>
            <p>Tỉnh / Thành phố</p>
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
          <input v-model="searchKeyword" type="text" placeholder="Tìm tên cửa hàng, địa chỉ, email..." />
        </div>
      </div>

      <div class="right-actions">
        <router-link :to="{ name: 'store-add' }" class="btn-primary-custom">
          <i class="bi bi-plus-lg"></i> Thêm cửa hàng
        </router-link>
        <button class="btn-outline-custom"><i class="bi bi-file-earmark-excel"></i> Xuất Excel</button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="5%">ID</th>
            <th width="30%">Thông tin cửa hàng</th>
            <th width="25%">Địa Chỉ</th>
            <th width="20%">Liên Hệ</th>
            <th width="15%">Trạng Thái</th>
            <th width="10%" class="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="store in paginatedStores" :key="store.id">
            <td class="text-muted text-xs">#{{ store.id }}</td>

            <td>
              <div class="product-info">
                <span class="product-name" :title="store.name">{{ store.name }}</span>
                <div class="sub-info">
                  <span v-if="store.isMain" class="campaign-tag">
                    <i class="bi bi-star-fill"></i> Trụ sở chính
                  </span>
                  <span v-else class="sku-badge">Chi nhánh</span>
                </div>
              </div>
            </td>

            <td>
              <span class="text-sm text-gray-700">{{ store.address }}</span>
            </td>

            <td>
              <div class="price-group">
                <span class="current-price" style="color: #374151; font-weight: 500;">
                  <i class="bi bi-telephone text-xs"></i> {{ store.phone }}
                </span>
                <span class="old-price" style="text-decoration: none;">
                  {{ store.email }}
                </span>
              </div>
            </td>

            <td>
              <div class="status-toggle" @click="toggleStatus(store)">
                <span class="dot" :class="store.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                {{ store.status === 'active' ? 'Đang mở' : 'Đóng cửa' }}
              </div>
            </td>

            <td class="text-center">
              <div class="action-buttons">
                <button class="btn-icon" title="Xem chi tiết" @click="openModal(store)">
                  <i class="bi bi-eye text-blue"></i>
                </button>
                <button class="btn-icon" title="Chỉnh sửa" @click="editStore(store.id)">
                  <i class="bi bi-pencil text-warning"></i>
                </button>
                <button class="btn-icon" title="Xóa cửa hàng" @click="confirmDelete(store)">
                  <i class="bi bi-trash text-danger"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredStores.length === 0" class="empty-state">
        <i class="bi bi-shop-window"></i>
        <p>Không tìm thấy cửa hàng nào khớp với điều kiện.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredStores.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> -
        <b>{{ Math.min(currentPage * itemsPerPage, filteredStores.length) }}</b>
        trong tổng <b>{{ filteredStores.length }}</b> cửa hàng
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

    <!-- Modal chi tiết -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3>{{ selectedStore.name }}</h3>
            <span class="stock-badge" :class="selectedStore.status === 'active' ? 'low' : 'out'"
              style="background: #eff6ff; color: #2563eb;">
              {{ formatStatus(selectedStore.status) }}
            </span>
          </div>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="store-image-wrapper">
            <div class="img-placeholder">
              <i class="bi bi-image"></i>
              <span>Map Preview</span>
            </div>
          </div>

          <div class="modal-info-grid">
            <div class="info-item full">
              <label>Địa chỉ</label>
              <p>{{ selectedStore.address }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ selectedStore.email }}</p>
            </div>
            <div class="info-item">
              <label>Hotline</label>
              <p>{{ selectedStore.phone }}</p>
            </div>
            <div class="info-item full">
              <label>Giờ hoạt động</label>
              <p>08:00 - 22:00 (Hàng ngày)</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Đóng</button>
          <button class="btn-primary-custom" @click="editStore(selectedStore.id)">Chỉnh sửa thông tin</button>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3><i class="bi bi-exclamation-triangle text-danger me-2"></i> Xác nhận xóa</h3>
          </div>
          <button class="close-btn" @click="closeDeleteModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="text-center">
            <i class="bi bi-trash text-danger" style="font-size: 48px; margin-bottom: 20px;"></i>
            <h4>Bạn có chắc chắn muốn xóa cửa hàng này?</h4>
            
            <div v-if="storeToDelete" class="store-info mt-4">
              <p><strong>Tên:</strong> {{ storeToDelete.name }}</p>
              <p><strong>Địa chỉ:</strong> {{ storeToDelete.address }}</p>
              <p><strong>Email:</strong> {{ storeToDelete.email }}</p>
              <p><strong>Trạng thái:</strong> {{ storeToDelete.status === 'active' ? 'Đang hoạt động' : 'Đóng cửa' }}</p>
              
              <div v-if="storeToDelete.isMain" class="alert alert-warning mt-3">
                <i class="bi bi-exclamation-circle"></i> Đây là trụ sở chính, không thể xóa!
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeDeleteModal">Hủy bỏ</button>
          <button class="btn-danger-custom" @click="deleteStore" :disabled="storeToDelete && storeToDelete.isMain">
            <i class="bi bi-trash"></i> Xóa Cửa Hàng
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Lấy dữ liệu từ localStorage hoặc API
const loadStoresFromDB = () => {
  const savedStores = localStorage.getItem('orchid_stores');
  if (savedStores) {
    return JSON.parse(savedStores);
  }
  
  // Nếu không có, tạo dữ liệu mẫu ban đầu
  const initialStores = [
    {
      id: 1,
      name: "Orchid Store Hà Nội",
      address: "Số 12 đường Nguyễn Huệ, Hà Nội",
      email: "store.hanoi@orchid.com.vn",
      phone: "024.777.1001",
      status: 'active',
      isMain: true,
      description: "Trụ sở chính tại Hà Nội",
      createdAt: "2025-11-26"
    },
    {
      id: 2,
      name: "Orchid Store TP.HCM",
      address: "Số 24 đường Lê Lợi, Quận 1, TP.HCM",
      email: "store.hcm@orchid.com.vn",
      phone: "028.777.1002",
      status: 'active',
      isMain: false,
      description: "Chi nhánh tại TP.HCM",
      createdAt: "2025-11-25"
    },
    {
      id: 3,
      name: "Orchid Store Đà Nẵng",
      address: "Số 36 đường Trần Hưng Đạo, Đà Nẵng",
      email: "store.danang@orchid.com.vn",
      phone: "023.777.1003",
      status: 'active',
      isMain: false,
      description: "Chi nhánh tại Đà Nẵng",
      createdAt: "2025-11-24"
    }
  ];
  
  localStorage.setItem('orchid_stores', JSON.stringify(initialStores));
  return initialStores;
};

const stores = ref(loadStoresFromDB());

const searchKeyword = ref("");
const currentStatus = ref("all");
const currentPage = ref(1);
const itemsPerPage = 10;
const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedStore = ref({});
const storeToDelete = ref(null);

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang mở', value: 'active' },
  { label: 'Đóng cửa', value: 'inactive' }
];

const filteredStores = computed(() => {
  let result = stores.value;

  if (currentStatus.value !== 'all') {
    result = result.filter(s => s.status === currentStatus.value);
  }

  if (searchKeyword.value) {
    const key = searchKeyword.value.toLowerCase();
    result = result.filter(s =>
      s.name.toLowerCase().includes(key) ||
      s.address.toLowerCase().includes(key) ||
      s.email.toLowerCase().includes(key)
    );
  }
  return result;
});

const paginatedStores = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredStores.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredStores.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  const uniqueCities = new Set(stores.value.map(s => s.address.split(',').pop().trim()));
  return {
    total: stores.value.length,
    active: stores.value.filter(s => s.status === 'active').length,
    inactive: stores.value.filter(s => s.status === 'inactive').length,
    cities: uniqueCities.size
  };
});

const setFilter = (status) => {
  currentStatus.value = status;
  currentPage.value = 1;
};

const getCountByStatus = (status) => {
  if (status === 'all') return stores.value.length;
  return stores.value.filter(s => s.status === status).length;
};

const toggleStatus = (store) => {
  store.status = store.status === 'active' ? 'inactive' : 'active';
  saveStoresToDB();
};

const formatStatus = (status) => status === 'active' ? 'Đang mở' : 'Đóng cửa';

const openModal = (store) => {
  selectedStore.value = store;
  showModal.value = true;
};

const closeModal = () => showModal.value = false;

// Mở modal xác nhận xóa
const confirmDelete = (store) => {
  storeToDelete.value = store;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  storeToDelete.value = null;
};

// Chức năng xóa cửa hàng
const deleteStore = () => {
  if (storeToDelete.value) {
    if (storeToDelete.value.isMain) {
      alert('Không thể xóa trụ sở chính!');
      closeDeleteModal();
      return;
    }
    
    // Xóa cửa hàng
    stores.value = stores.value.filter(s => s.id !== storeToDelete.value.id);
    saveStoresToDB();
    
    // Reset phân trang nếu cần
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
    
    closeDeleteModal();
    alert('Xóa cửa hàng thành công!');
  }
};

// Chức năng chỉnh sửa
const editStore = (storeId) => {
  router.push({ name: 'store-edit', params: { id: storeId } });
};

// Lưu dữ liệu vào localStorage (giả lập DB)
const saveStoresToDB = () => {
  localStorage.setItem('orchid_stores', JSON.stringify(stores.value));
};

// Load dữ liệu khi component được mount
onMounted(() => {
  console.log('Đang tải dữ liệu cửa hàng...');
});
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

.orange .icon {
  background: #fff7ed;
  color: #f97316;
}

.purple .icon {
  background: #f3e8ff;
  color: #a855f7;
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
  padding: 8px 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

tr:hover td {
  background-color: #f9fafb;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 600;
  color: #111;
  font-size: 14px;
}

.sub-info {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  align-items: center;
}

.sku-badge {
  font-size: 11px;
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 3px;
  color: #666;
}

.campaign-tag {
  background: linear-gradient(45deg, #fce7f3, #e0e7ff);
  color: #db2777;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.price-group {
  display: flex;
  flex-direction: column;
}

.text-gray-700 {
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

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 15px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f3f4f6;
}

.btn-icon .text-blue:hover {
  color: #2563eb;
}

.btn-icon .text-warning:hover {
  color: #f59e0b;
}

.btn-icon .text-danger:hover {
  color: #ef4444;
}

.text-warning {
  color: #f59e0b;
}

.text-danger {
  color: #ef4444;
}

.text-center {
  text-align: center;
}

.text-xs {
  font-size: 11px;
}

.text-muted {
  color: #9ca3af;
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
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  width: 480px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease-out;
}

.delete-modal {
  width: 500px;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title-group h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.store-image-wrapper {
  height: 160px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #9ca3af;
  gap: 5px;
}

.img-placeholder i {
  font-size: 30px;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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

.modal-footer {
  padding: 15px 20px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-danger-custom {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-danger-custom:hover:not(:disabled) {
  background: #dc2626;
}

.btn-danger-custom:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.store-info {
  text-align: left;
  padding: 15px;
  background: #f9fafb;
  border-radius: 6px;
  margin-top: 15px;
}

.store-info p {
  margin: 5px 0;
}

.alert {
  padding: 10px 15px;
  border-radius: 6px;
  margin: 10px 0;
}

.alert-warning {
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  color: #92400e;
}

.alert-warning i {
  margin-right: 5px;
}

.text-center {
  text-align: center;
}

.mt-3 {
  margin-top: 15px;
}

.mt-4 {
  margin-top: 20px;
}

.me-2 {
  margin-right: 8px;
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

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modal-content,
  .delete-modal {
    width: 90%;
    max-width: 480px;
  }
}
</style>