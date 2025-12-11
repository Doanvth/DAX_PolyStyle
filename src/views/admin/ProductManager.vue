<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-box-seam"></i></div>
          <div class="info">
            <h3>{{ stats.totalProducts }}</h3>
            <p>Tổng sản phẩm</p>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="icon"><i class="bi bi-exclamation-triangle"></i></div>
          <div class="info">
            <h3>{{ stats.lowStockVariant }}</h3>
            <p>Biến thể sắp hết</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-upc-scan"></i></div>
          <div class="info">
            <h3>{{ formatNumber(stats.totalSKUs) }}</h3>
            <p>Tổng mã SKU con</p>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="icon"><i class="bi bi-tags-fill"></i></div>
          <div class="info">
            <h3>{{ stats.inCampaign }}</h3>
            <p>Đang chạy Sale</p>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbar-top">
      <div class="left-actions">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" type="text" placeholder="Tìm tên SP, SKU, Danh mục..." />
        </div>
        <select v-model="selectedCategory" class="filter-select">
          <option value="">Tất cả danh mục</option>
          <option value="Thời trang">Thời trang</option>
          <option value="Điện tử">Điện tử</option>
          <option value="Gia dụng">Gia dụng</option>
        </select>
        <div class="checkbox-wrapper">
          <input type="checkbox" id="lowStockOnly" v-model="filterLowStock">
          <label for="lowStockOnly">Chỉ hiện SP sắp hết hàng</label>
        </div>
      </div>

      <div class="right-actions">
        <button class="btn-primary-custom" @click="$router.push({ name: 'productsAdd' })">
          <i class="bi bi-plus-lg"></i> Thêm sản phẩm
        </button>

        <button class="btn-outline-custom"><i class="bi bi-file-earmark-excel"></i> Xuất Excel</button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="3%"></th>
            <th width="5%">Ảnh</th>
            <th width="30%">Tên Sản Phẩm / SKU</th>
            <th width="12%">Giá bán</th>
            <th width="10%" class="text-center">Tổng Kho</th>
            <th width="15%">Phân loại</th>
            <th width="10%">Trạng thái</th>
            <th width="5%" class="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="product in paginatedProducts" :key="product.id">
            <tr :class="{ 'expanded-row': product.isExpanded }">
              <td class="text-center">
                <button class="btn-expand" @click="toggleExpand(product)">
                  <i class="bi" :class="product.isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                </button>
              </td>

              <td>
                <img :src="product.image" class="product-thumb" alt="img" />
              </td>

              <td>
                <div class="product-info">
                  <span class="product-name" :title="product.name">{{ product.name }}</span>
                  <div class="sub-info">
                    <span class="sku-badge">{{ product.sku }}</span>
                    <span class="category-text">{{ product.category }}</span>
                  </div>
                </div>
              </td>

              <td>
                <div class="price-group">
                  <span class="current-price">{{ formatCurrency(product.price) }}</span>
                </div>
              </td>

              <td class="text-center">
                <div class="stock-overview">
                  <span :class="getStockClass(product.totalStock)">{{ formatNumber(product.totalStock) }}</span>
                  <i v-if="hasLowStockVariant(product)" class="bi bi-exclamation-circle-fill text-warning"
                    title="Có phân loại sắp hết hàng"></i>
                </div>
              </td>

              <td>
                <div class="variant-badges">
                  <span class="v-count">{{ product.variants.length }} biến thể</span>
                </div>
              </td>

              <td>
                <div class="status-toggle" @click="toggleStatus(product)">
                  <span class="dot" :class="product.isActive ? 'bg-success' : 'bg-gray'"></span>
                  {{ product.isActive ? 'Đang bán' : 'Đã ẩn' }}
                </div>
              </td>

              <td class="text-center">
                <button class="btn-icon" title="Chỉnh sửa"><i class="bi bi-pencil-square text-blue"></i></button>
              </td>
            </tr>

            <tr v-if="product.isExpanded" class="detail-row">
              <td colspan="8">
                <div class="detail-container">
                  <div class="detail-header">
                    <h5><i class="bi bi-grid-3x3-gap"></i> Chi tiết tồn kho & Biến thể</h5>
                    <button class="btn-xs-primary">Cập nhật nhanh</button>
                  </div>

                  <div class="variant-table-wrapper">
                    <table class="variant-table">
                      <thead>
                        <tr>
                          <th>SKU Phân loại</th>
                          <th>Kích cỡ (Size)</th>
                          <th>Màu sắc (Color)</th>
                          <th class="text-center">Tồn kho</th>
                          <th class="text-center">Đã bán</th>
                          <th class="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(variant, vIndex) in product.variants" :key="vIndex">
                          <td class="text-muted font-monospace">{{ product.sku }}-{{ variant.size }}-{{
                            variant.colorCode }}</td>
                          <td><span class="badge-size">{{ variant.size }}</span></td>
                          <td>
                            <div class="badge-color">
                              <span class="color-dot" :style="{ backgroundColor: variant.hex }"></span>
                              {{ variant.color }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="quick-stock-edit">
                              <input type="number" v-model.number="variant.stock"
                                :class="{ 'text-red': variant.stock < 5 }">
                            </div>
                          </td>
                          <td class="text-center text-muted">{{ variant.sold }}</td>
                          <td class="text-center">
                            <button class="btn-icon-sm text-red" title="Xóa biến thể"><i
                                class="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="filteredProducts.length === 0" class="empty-state">
        <i class="bi bi-box-seam"></i>
        <p>Không tìm thấy sản phẩm nào.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredProducts.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> -
        <b>{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</b>
        trong tổng <b>{{ filteredProducts.length }}</b> sản phẩm
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

const generateProducts = () => {
  const data = [];
  const categories = ['Thời trang Nam', 'Thời trang Nữ', 'Phụ kiện'];
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Đỏ', hex: '#ef4444', code: 'RD' },
    { name: 'Đen', hex: '#000000', code: 'BK' },
    { name: 'Trắng', hex: '#ffffff', code: 'WH' },
    { name: 'Xanh', hex: '#3b82f6', code: 'BL' }
  ];

  for (let i = 1; i <= 20; i++) {
    const variants = [];
    const numVariants = Math.floor(Math.random() * 4) + 1;
    let totalStock = 0;

    for (let j = 0; j < numVariants; j++) {
      const stock = Math.floor(Math.random() * 50);
      totalStock += stock;
      const color = colors[Math.floor(Math.random() * colors.length)];

      variants.push({
        size: sizes[Math.floor(Math.random() * sizes.length)],
        color: color.name,
        hex: color.hex,
        colorCode: color.code,
        stock: stock,
        sold: Math.floor(Math.random() * 200)
      });
    }

    data.push({
      id: i,
      sku: `SP${i.toString().padStart(3, '0')}`,
      name: `Áo Thun Premium Cotton Mẫu ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      image: `https://placehold.co/40x40?text=SP${i}`,
      price: 250000 + (i * 10000),
      totalStock: totalStock,
      variants: variants,
      isActive: true,
      isExpanded: false,
      lastUpdated: '05/12/2025'
    });
  }
  return data;
};

const products = ref(generateProducts());
const searchQuery = ref("");
const selectedCategory = ref("");
const filterLowStock = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;


const filteredProducts = computed(() => {
  let result = products.value;

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(key) || p.sku.toLowerCase().includes(key));
  }

  if (filterLowStock.value) {
    result = result.filter(p => p.variants.some(v => v.stock < 5));
  }

  return result;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  let totalSKUs = 0;
  let lowStockVariant = 0;

  products.value.forEach(p => {
    totalSKUs += p.variants.length;
    p.variants.forEach(v => {
      if (v.stock < 5) lowStockVariant++;
    });
  });

  return {
    totalProducts: products.value.length,
    totalSKUs,
    lowStockVariant,
    inCampaign: 5
  };
});

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('vi-VN').format(val);

const toggleExpand = (product) => {
  product.isExpanded = !product.isExpanded;
};

const toggleStatus = (product) => product.isActive = !product.isActive;

const getStockClass = (stock) => {
  if (stock === 0) return 'stock-badge out';
  if (stock < 20) return 'stock-badge low';
  return 'stock-text';
};

const hasLowStockVariant = (product) => {
  return product.variants.some(v => v.stock < 5);
};

</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
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

.orange .icon {
  background: #fff7ed;
  color: #f97316;
}

.purple .icon {
  background: #f3e8ff;
  color: #a855f7;
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
  align-items: center;
}

.search-box {
  position: relative;
  width: 280px;
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
  padding: 7px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  user-select: none;
}

.checkbox-wrapper input {
  cursor: pointer;
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

.btn-xs-primary {
  font-size: 11px;
  padding: 4px 8px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  cursor: pointer;
}

.btn-xs-primary:hover {
  background: #2563eb;
  color: white;
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

.product-thumb {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #eee;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 600;
  color: #111;
}

.sub-info {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

.sku-badge {
  font-size: 11px;
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 3px;
  color: #666;
  font-family: monospace;
}

.category-text {
  font-size: 11px;
  color: #888;
}

.current-price {
  font-weight: 600;
  color: #059669;
}


.stock-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.stock-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.stock-badge.out {
  background: #fee2e2;
  color: #ef4444;
}

.stock-badge.low {
  background: #ffedd5;
  color: #f97316;
}

.stock-text {
  font-weight: 600;
  color: #374151;
}

.text-warning {
  color: #f59e0b;
  font-size: 12px;
}


.btn-expand {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 0.2s;
}

.btn-expand:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.expanded-row td {
  background-color: #f8fafc;
  border-bottom: none;
}

.detail-row td {
  padding: 0;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.detail-container {
  padding: 10px 20px 20px 60px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.detail-header h5 {
  margin: 0;
  font-size: 13px;
  color: #475569;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.variant-table-wrapper {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.variant-table {
  width: 100%;
}

.variant-table th {
  background: #f1f5f9;
  font-size: 11px;
  color: #64748b;
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.variant-table td {
  padding: 6px 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
  background: white;
}

.variant-table tr:last-child td {
  border-bottom: none;
}

.badge-size {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
  min-width: 24px;
  display: inline-block;
  text-align: center;
}

.badge-color {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.font-monospace {
  font-family: monospace;
  font-size: 11px;
}

.quick-stock-edit input {
  width: 60px;
  padding: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  outline: none;
  transition: 0.2s;
}

.quick-stock-edit input:focus {
  border-color: #2563eb;
}

.text-red {
  color: #ef4444;
}

.status-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
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

.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 5px;
  margin-top: 10px;
}

.page-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon-sm {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.text-blue {
  color: #2563eb;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 15px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 10px; 
}
</style>