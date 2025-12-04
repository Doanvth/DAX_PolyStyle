<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-receipt"></i></div>
          <div class="info">
            <h3>{{ stats.totalOrders }}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-currency-dollar"></i></div>
          <div class="info">
            <h3>{{ formatCurrency(stats.totalRevenue) }}</h3>
            <p>Doanh thu thực tế</p>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="icon"><i class="bi bi-hourglass-split"></i></div>
          <div class="info">
            <h3>{{ stats.pendingOrders }}</h3>
            <p>Chờ xử lý</p>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="icon"><i class="bi bi-truck"></i></div>
          <div class="info">
            <h3>{{ stats.shippingOrders }}</h3>
            <p>Đang giao hàng</p>
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
          <input v-model="searchQuery" type="text" placeholder="Tìm tên khách, SĐT, mã đơn..." />
        </div>
      </div>

      <div class="right-actions">
        <button class="btn-outline-custom"><i class="bi bi-printer"></i> In danh sách</button>
        <button class="btn-primary-custom"><i class="bi bi-file-earmark-excel"></i> Xuất Excel</button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="10%">Mã Đơn</th>
            <th width="25%">Khách hàng</th>
            <th width="15%">Ngày đặt</th>
            <th width="15%">Tổng tiền</th>
            <th width="20%">Trạng Thái</th>
            <th width="10%">Thanh toán</th>
            <th width="5%" class="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td class="text-muted text-xs font-mono">#{{ order.id }}</td>

            <td>
              <div class="product-info">
                <span class="product-name">{{ order.customerName }}</span>
                <div class="sub-info">
                  <span class="sku-badge"><i class="bi bi-telephone"></i> {{ order.phone }}</span>
                </div>
              </div>
            </td>

            <td class="text-sm text-gray-700">{{ order.date }}</td>

            <td>
              <div class="price-group">
                <span class="current-price">{{ formatCurrency(order.totalAmount) }}</span>
                <span class="text-xs text-muted">{{ order.itemsCount }} sản phẩm</span>
              </div>
            </td>

            <td>
              <div class="status-select-wrapper">
                <select v-model="order.status" class="status-select" :class="getStatusColorClass(order.status)"
                  @change="handleStatusChange(order)">
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="active">Hoàn thành</option>
                  <option value="cancel">Đã hủy</option>
                </select>
                <i class="bi bi-caret-down-fill select-arrow"></i>
              </div>
            </td>

            <td>
              <span class="badge-payment" :class="order.paymentStatus === 'Paid' ? 'paid' : 'unpaid'">
                {{ order.paymentStatus === 'Paid' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán' }}
              </span>
            </td>

            <td class="text-center">
              <button class="btn-icon" title="Xem chi tiết" @click="openModal(order)">
                <i class="bi bi-eye text-blue"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredOrders.length === 0" class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>Không tìm thấy đơn hàng nào.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredOrders.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> -
        <b>{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }}</b>
        trong tổng <b>{{ filteredOrders.length }}</b> đơn hàng
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
      <div class="modal-content large">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3>Đơn hàng #{{ selectedOrder.id }}</h3>
            <span class="date-badge">{{ selectedOrder.date }}</span>
          </div>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="info-grid-row">
            <div class="info-box">
              <div class="box-header"><i class="bi bi-person"></i> Khách hàng</div>
              <div class="box-content">
                <p class="fw-bold">{{ selectedOrder.customerName }}</p>
                <p>{{ selectedOrder.phone }}</p>
                <p class="text-xs text-muted">ID Khách: #CUS-992</p>
              </div>
            </div>
            <div class="info-box">
              <div class="box-header"><i class="bi bi-geo-alt"></i> Giao nhận</div>
              <div class="box-content">
                <p>{{ selectedOrder.address }}</p>
                <p class="text-blue fw-500">Phí vận chuyển: Miễn phí</p>
              </div>
            </div>
            <div class="info-box">
              <div class="box-header"><i class="bi bi-credit-card"></i> Thanh toán</div>
              <div class="box-content">
                <p>COD - Thanh toán khi nhận hàng</p>
                <p :class="selectedOrder.paymentStatus === 'Paid' ? 'text-green' : 'text-orange'">
                  {{ selectedOrder.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                </p>
              </div>
            </div>
          </div>

          <div class="order-items-container">
            <table class="simple-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th class="text-center">SL</th>
                  <th class="text-right">Đơn giá</th>
                  <th class="text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in selectedOrder.products" :key="idx">
                  <td>
                    <div class="item-mini">
                      <img src="https://placehold.co/40x40" alt="img">
                      <span>{{ item.name }}</span>
                    </div>
                  </td>
                  <td class="text-center">x{{ item.quantity }}</td>
                  <td class="text-right">{{ formatCurrency(item.price) }}</td>
                  <td class="text-right fw-500">{{ formatCurrency(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>Tạm tính:</span>
              <span>{{ formatCurrency(selectedOrder.totalAmount) }}</span>
            </div>
            <div class="summary-row">
              <span>Giảm giá:</span>
              <span>-0 ₫</span>
            </div>
            <div class="summary-row total">
              <span>Tổng cộng:</span>
              <span class="total-price">{{ formatCurrency(selectedOrder.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Đóng</button>
          <button class="btn-primary-custom"><i class="bi bi-printer"></i> In hóa đơn</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const generateData = () => {
  const data = [];
  const statuses = ['pending', 'shipping', 'active', 'cancel'];
  const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng E'];
  const productNames = ['Áo Thun Polo Premium', 'Quần Jean Slimfit', 'Áo Khoác Gió 2 Lớp', 'Váy Hoa Nhí Vintage', 'Giày Sneaker Basic'];

  for (let i = 1; i <= 30; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const products = [];
    const numItems = Math.floor(Math.random() * 3) + 1;
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const price = (Math.floor(Math.random() * 5) + 2) * 100000;
      const qty = Math.floor(Math.random() * 2) + 1;
      products.push({ name: productNames[Math.floor(Math.random() * productNames.length)], price, quantity: qty });
      total += price * qty;
    }

    data.push({
      id: `ORD${(1000 + i)}`,
      customerName: `${randomName} (${i})`,
      phone: `09${Math.floor(Math.random() * 100000000)}`,
      address: `Số ${i} Đường 3/2, Quận Ninh Kiều, Cần Thơ`,
      date: `${Math.floor(Math.random() * 28) + 1}/12/2025`,
      itemsCount: products.reduce((acc, cur) => acc + cur.quantity, 0),
      totalAmount: total,
      status: randomStatus,
      paymentStatus: Math.random() > 0.4 ? 'Paid' : 'Unpaid',
      products: products
    });
  }
  return data.reverse();
};

const orders = ref(generateData());

const searchQuery = ref("");
const currentStatus = ref("all");
const currentPage = ref(1);
const itemsPerPage = 10;
const showModal = ref(false);
const selectedOrder = ref({});

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xử lý', value: 'pending' },
  { label: 'Đang giao', value: 'shipping' },
  { label: 'Hoàn thành', value: 'active' },
  { label: 'Đã hủy', value: 'cancel' }
];

const filteredOrders = computed(() => {
  let result = orders.value;
  if (currentStatus.value !== 'all') {
    result = result.filter(o => o.status === currentStatus.value);
  }
  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(o =>
      o.customerName.toLowerCase().includes(key) ||
      o.id.toLowerCase().includes(key) ||
      o.phone.includes(key)
    );
  }
  return result;
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  return {
    totalOrders: orders.value.length,
    totalRevenue: orders.value.reduce((sum, item) => sum + (item.status === 'active' ? item.totalAmount : 0), 0),
    pendingOrders: orders.value.filter(item => item.status === 'pending').length,
    shippingOrders: orders.value.filter(item => item.status === 'shipping').length
  };
});

const setFilter = (status) => {
  currentStatus.value = status;
  currentPage.value = 1;
};

const getCountByStatus = (status) => {
  if (status === 'all') return orders.value.length;
  return orders.value.filter(o => o.status === status).length;
};

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const getStatusColorClass = (status) => {
  switch (status) {
    case 'active': return 'bg-success-subtle';
    case 'pending': return 'bg-warning-subtle';
    case 'shipping': return 'bg-blue-subtle';
    case 'cancel': return 'bg-gray-subtle';
    default: return '';
  }
};

const handleStatusChange = (order) => {
  console.log(`Updated Order ${order.id} to ${order.status}`);
};

const openModal = (order) => {
  selectedOrder.value = order;
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
  margin-top: 4px;
}

.sku-badge {
  font-size: 12px;
  color: #666;
}

.price-group {
  display: flex;
  flex-direction: column;
}

.current-price {
  font-weight: 600;
  color: #111;
}

.font-mono {
  font-family: monospace;
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

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-blue {
  color: #2563eb;
}

.text-green {
  color: #10b981;
}

.text-orange {
  color: #f97316;
}

.fw-bold {
  font-weight: 700;
}

.fw-500 {
  font-weight: 500;
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

.status-select-wrapper {
  position: relative;
  width: 130px;
}

.status-select {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 10px;
  opacity: 0.7;
}

.bg-success-subtle {
  background: #dcfce7;
  color: #166534;
}

.bg-warning-subtle {
  background: #ffedd5;
  color: #9a3412;
}

.bg-blue-subtle {
  background: #dbeafe;
  color: #1e40af;
}

.bg-gray-subtle {
  background: #f3f4f6;
  color: #4b5563;
}

.badge-payment {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-payment.paid {
  color: #10b981;
  background: #ecfdf5;
  border: 1px solid #d1fae5;
}

.badge-payment.unpaid {
  color: #9ca3af;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
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

.modal-content.large {
  width: 700px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease-out;
  max-width: 95%;
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

.date-badge {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #666;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  max-height: 75vh;
  overflow-y: auto;
}

.info-grid-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-box {
  background: #f9fafb;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #eee;
}

.box-header {
  font-size: 11px;
  text-transform: uppercase;
  color: #6b7280;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.box-content p {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

.simple-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.simple-table th {
  background: white;
  border-bottom: 2px solid #f3f4f6;
  padding: 8px;
  font-size: 12px;
  color: #6b7280;
}

.simple-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}

.item-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.item-mini img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #eee;
}

.order-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  padding-top: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  width: 220px;
  font-size: 13px;
  color: #6b7280;
}

.summary-row.total {
  font-weight: 700;
  color: #111;
  font-size: 15px;
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 5px;
}

.total-price {
  color: #2563eb;
}

.modal-footer {
  padding: 15px 20px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-grid-row {
    grid-template-columns: 1fr;
  }
}
</style>