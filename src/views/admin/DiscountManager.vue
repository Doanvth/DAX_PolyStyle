<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-megaphone-fill"></i></div>
          <div class="info">
            <h3>{{ stats.total }}</h3>
            <p>Tổng chiến dịch</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-play-circle-fill"></i></div>
          <div class="info">
            <h3>{{ stats.active }}</h3>
            <p>Đang chạy</p>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="icon"><i class="bi bi-calendar-event"></i></div>
          <div class="info">
            <h3>{{ stats.upcoming }}</h3>
            <p>Sắp diễn ra</p>
          </div>
        </div>
        <div class="stat-card gray">
          <div class="icon"><i class="bi bi-stop-fill"></i></div>
          <div class="info">
            <h3>{{ stats.expired }}</h3>
            <p>Đã kết thúc</p>
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
          <input v-model="searchQuery" type="text" placeholder="Tìm tên chương trình..." />
        </div>
        <select v-model="selectedScope" class="filter-select">
            <option value="">Tất cả phạm vi</option>
            <option value="Toàn bộ cửa hàng">Toàn bộ cửa hàng</option>
            <option value="Theo Danh mục">Theo Danh mục</option>
            <option value="Sản phẩm chọn lọc">Sản phẩm chọn lọc</option>
        </select>
      </div>
      
      <div class="right-actions">
        <router-link   to="addDiscounts" class="btn-primary-custom">
          <i class="bi bi-plus-lg"></i> Tạo chiến dịch mới
        </router-link>

        
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="30%">Tên Chương Trình</th>
            <th width="15%">Mức giảm</th>
            <th width="20%">Phạm vi áp dụng</th>
            <th width="25%">Thời gian hiệu lực</th> <th width="10%">Trạng thái</th>
            <th width="5%" class="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="camp in paginatedCampaigns" :key="camp.id">
            
            <td>
              <div class="camp-info">
                <span class="camp-name" :title="camp.name">{{ camp.name }}</span>
                <span class="camp-type text-muted text-xs">
                    <i class="bi bi-tag-fill"></i> {{ camp.type === 'percent' ? 'Giảm theo %' : 'Giảm tiền mặt' }}
                </span>
              </div>
            </td>

            <td>
                <span class="discount-value">
                    {{ camp.type === 'percent' ? 'Giảm ' + camp.value + '%' : '-' + formatCurrency(camp.value) }}
                </span>
            </td>

            <td>
                <span class="scope-badge" :class="getScopeClass(camp.scope)">
                    {{ camp.scope }}
                </span>
                <div class="text-xs text-muted mt-1" v-if="camp.scope !== 'Toàn bộ cửa hàng'">
                    {{ camp.targetCount }} mục áp dụng
                </div>
            </td>

            <td class="date-cell">
                <div class="date-wrapper">
                    <span>{{ camp.startDate }}</span>
                    <i class="bi bi-arrow-right mx-2 text-muted"></i>
                    <span>{{ camp.endDate }}</span>
                </div>
            </td>

            <td>
                <span class="status-badge" :class="getStatusClass(camp.status)">
                    {{ getStatusLabel(camp.status) }}
                </span>
            </td>

            <td class="text-center">
              <button class="btn-icon" title="Chi tiết" @click="openModal(camp)">
                <i class="bi bi-pencil-square text-blue"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredCampaigns.length === 0" class="empty-state">
        <i class="bi bi-basket"></i>
        <p>Không tìm thấy chương trình nào.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredCampaigns.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> - 
        <b>{{ Math.min(currentPage * itemsPerPage, filteredCampaigns.length) }}</b> 
        trong tổng <b>{{ filteredCampaigns.length }}</b> chương trình
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
            <h3>{{ selectedCamp.name }}</h3>
            <span class="status-badge" :class="getStatusClass(selectedCamp.status)">
                {{ getStatusLabel(selectedCamp.status) }}
            </span>
          </div>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
            <div class="modal-info-grid">
                <div class="info-item full">
                    <label>Thời gian diễn ra</label>
                    <p class="fw-bold">{{ selectedCamp.startDate }} - {{ selectedCamp.endDate }}</p>
                </div>
                <div class="info-item">
                    <label>Loại khuyến mãi</label>
                    <p>{{ selectedCamp.type === 'percent' ? 'Giảm giá theo phần trăm' : 'Giảm giá tiền mặt cố định' }}</p>
                </div>
                <div class="info-item">
                    <label>Mức giảm</label>
                    <p class="text-blue fw-bold">{{ selectedCamp.type === 'percent' ? selectedCamp.value + '%' : formatCurrency(selectedCamp.value) }}</p>
                </div>
                <div class="info-item">
                    <label>Phạm vi áp dụng</label>
                    <p>{{ selectedCamp.scope }}</p>
                </div>
                <div class="info-item">
                    <label>Đối tượng</label>
                    <p>{{ selectedCamp.targetCount }} mục (Danh mục/Sản phẩm)</p>
                </div>
            </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Đóng</button>
          <button class="btn-primary-custom">Chỉnh sửa chương trình</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- 1. MOCK DATA ---
const generateData = () => {
  const data = [];
  const scopes = ['Toàn bộ cửa hàng', 'Theo Danh mục', 'Sản phẩm chọn lọc'];
  const statuses = ['active', 'upcoming', 'expired'];
  
  for (let i = 1; i <= 15; i++) {
    const scope = scopes[Math.floor(Math.random() * scopes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isPercent = Math.random() > 0.5;
    
    data.push({
      id: i,
      name: `Chương trình Flash Sale Tháng ${i} - Xả kho toàn bộ`,
      type: isPercent ? 'percent' : 'fixed',
      value: isPercent ? (Math.floor(Math.random() * 50) + 10) : (Math.floor(Math.random() * 20) + 1) * 10000,
      scope: scope,
      targetCount: scope === 'Toàn bộ cửa hàng' ? 'Tất cả' : Math.floor(Math.random() * 50) + 5,
      // Date format string text
      startDate: `01/12/2025 00:00`,
      endDate: `05/12/2025 23:59`,
      status: status
    });
  }
  return data.sort((a, b) => (a.status === 'active' ? -1 : 1));
};

const campaigns = ref(generateData());

// --- 2. STATE ---
const searchQuery = ref("");
const selectedScope = ref("");
const currentTab = ref("all");
const currentPage = ref(1);
const itemsPerPage = 8;
const showModal = ref(false);
const selectedCamp = ref({});

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang chạy', value: 'active' },
  { label: 'Sắp tới', value: 'upcoming' },
  { label: 'Đã xong', value: 'expired' }
];

// --- 3. COMPUTED ---
const filteredCampaigns = computed(() => {
  let result = campaigns.value;

  if (currentTab.value !== 'all') {
    result = result.filter(p => p.status === currentTab.value);
  }

  if (selectedScope.value) {
    result = result.filter(p => p.scope === selectedScope.value);
  }

  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(key));
  }
  return result;
});

const paginatedCampaigns = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCampaigns.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredCampaigns.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  return {
    total: campaigns.value.length,
    active: campaigns.value.filter(p => p.status === 'active').length,
    upcoming: campaigns.value.filter(p => p.status === 'upcoming').length,
    expired: campaigns.value.filter(p => p.status === 'expired').length,
  };
});

// --- 4. HELPERS ---
const setFilter = (tab) => {
  currentTab.value = tab;
  currentPage.value = 1;
};

const getCountByTab = (tab) => {
  if (tab === 'all') return campaigns.value.length;
  return campaigns.value.filter(p => p.status === tab).length;
};

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const getStatusClass = (status) => {
    switch(status) {
        case 'active': return 'badge-active';
        case 'upcoming': return 'badge-upcoming';
        default: return 'badge-expired';
    }
};

const getStatusLabel = (status) => {
    switch(status) {
        case 'active': return 'Đang chạy';
        case 'upcoming': return 'Sắp diễn ra';
        default: return 'Đã kết thúc';
    }
};

const getScopeClass = (scope) => {
    if(scope === 'Toàn bộ cửa hàng') return 'scope-all';
    if(scope === 'Theo Danh mục') return 'scope-cat';
    return 'scope-prod';
};

const openModal = (camp) => {
    selectedCamp.value = camp;
    showModal.value = true;
};
const closeModal = () => showModal.value = false;

</script>

<style scoped>
/* --- BASE --- */
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
  font-size: 13px;
}

/* --- STATS --- */
.dashboard-header { margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }

.stat-card {
  background: white; padding: 15px; border-radius: 8px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02);
}
.stat-card .icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.stat-card h3 { margin: 0; font-size: 20px; font-weight: 700; color: #111; }
.stat-card p { margin: 0; color: #6b7280; font-size: 12px; }

.blue .icon { background: #eff6ff; color: #3b82f6; }
.green .icon { background: #ecfdf5; color: #10b981; }
.orange .icon { background: #fff7ed; color: #f97316; }
.gray .icon { background: #f3f4f6; color: #6b7280; }

/* --- TABS --- */
.status-tabs { display: flex; gap: 8px; margin-bottom: 15px; }
.tab-btn {
  background: white; border: 1px solid #e5e7eb; padding: 6px 12px;
  border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;
  display: flex; align-items: center; gap: 6px; color: #6b7280; transition: all 0.2s;
}
.tab-btn:hover { background: #f9fafb; }
.tab-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
.count-badge { background: #f3f4f6; padding: 1px 6px; border-radius: 10px; font-size: 11px; color: #4b5563; }
.tab-btn.active .count-badge { background: rgba(255,255,255,0.2); color: white; }

/* --- TOOLBAR --- */
.toolbar-top { display: flex; justify-content: space-between; margin-bottom: 12px; }
.left-actions, .right-actions { display: flex; gap: 10px; }
.search-box { position: relative; width: 300px; }
.search-box input {
  width: 100%; padding: 7px 10px 7px 30px; border: 1px solid #d1d5db;
  border-radius: 6px; outline: none; font-size: 13px;
}
.search-box i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

.filter-select { padding: 0 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #374151; cursor: pointer; background: white; }

.btn-primary-custom {
  background: #2563eb; color: white; border: none; padding: 7px 14px;
  border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 13px; text-decoration: none;
}

/* --- TABLE --- */
.table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th { background: #f9fafb; padding: 10px 12px; text-align: left; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
tr:hover td { background-color: #f9fafb; }

/* Campaign Info */
.camp-info { display: flex; flex-direction: column; }
.camp-name { font-weight: 600; color: #111; font-size: 13px; margin-bottom: 3px; }
.camp-type { font-size: 11px; display: flex; align-items: center; gap: 4px; }

/* Discount Value */
.discount-value { font-weight: 700; color: #2563eb; font-size: 14px; }

/* Scope Badge */
.scope-badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-block; }
.scope-all { background: #f3e8ff; color: #7e22ce; }
.scope-cat { background: #e0e7ff; color: #3730a3; }
.scope-prod { background: #ffedd5; color: #9a3412; }

/* DATE CELL: NO WRAP */
.date-cell { 
    white-space: nowrap; /* Không xuống dòng */
    width: 1%; /* Co nhỏ nhất có thể, nhưng nowrap sẽ đẩy nó ra */
}
.date-wrapper {
    display: inline-flex; align-items: center;
    background: #f9fafb; border: 1px solid #e5e7eb; padding: 6px 10px; border-radius: 6px;
    font-family: monospace; font-size: 12px; color: #374151; font-weight: 600;
}

/* Status Badges */
.status-badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.badge-active { background: #dcfce7; color: #166534; }
.badge-upcoming { background: #ffedd5; color: #9a3412; }
.badge-expired { background: #f3f4f6; color: #4b5563; }

.btn-icon { background: none; border: none; cursor: pointer; color: #6b7280; font-size: 15px; }
.btn-icon:hover { transform: scale(1.1); }
.text-blue { color: #2563eb; }
.text-muted { color: #9ca3af; }
.text-xs { font-size: 11px; }
.text-center { text-align: center; }

/* --- PAGINATION --- */
.pagination-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-top: 1px solid #f3f4f6; }
.page-info { color: #6b7280; font-size: 13px; }
.page-controls { display: flex; align-items: center; gap: 8px; }
.page-btn { width: 28px; height: 28px; border: 1px solid #d1d5db; background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.page-btn:hover:not(:disabled) { background: #f3f4f6; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.current-page { font-weight: 600; color: #374151; font-size: 13px; }
.empty-state { text-align: center; padding: 40px; color: #9ca3af; }

/* --- MODAL --- */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; }
.modal-content { background: white; width: 500px; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideDown 0.2s ease-out; }

.modal-header { padding: 15px 20px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
.modal-title-group h3 { margin: 0; font-size: 16px; font-weight: 700; color: #111; margin-bottom: 4px; }
.close-btn { background: none; border: none; font-size: 18px; color: #9ca3af; cursor: pointer; }

.modal-body { padding: 20px; }
.modal-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.info-item label { font-size: 11px; text-transform: uppercase; color: #9ca3af; font-weight: 600; display: block; margin-bottom: 4px; }
.info-item p { margin: 0; font-size: 13px; color: #374151; font-weight: 500; }
.info-item.full { grid-column: 1 / -1; }
.fw-bold { font-weight: 700; }

.modal-footer { padding: 15px 20px; background: #f9fafb; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #f3f4f6; }
.btn-outline-custom { background: white; border: 1px solid #d1d5db; color: #374151; padding: 7px 14px; border-radius: 6px; cursor: pointer; }

@keyframes slideDown { from { transform: translateY(-15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>