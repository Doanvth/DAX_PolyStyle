<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner">
      <i class="bi bi-arrow-clockwise"></i>
      <p>Đang tải dữ liệu...</p>
    </div>
  </div>
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
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm tên SP, SKU, Danh mục..."
          />
        </div>
        <select v-model="selectedCategory" class="filter-select">
          <option value="">Tất cả danh mục</option>
          <option value="Thời trang">Thời trang</option>
          <option value="Điện tử">Điện tử</option>
          <option value="Gia dụng">Gia dụng</option>
        </select>
        <div class="checkbox-wrapper">
          <input type="checkbox" id="lowStockOnly" v-model="filterLowStock" />
          <label for="lowStockOnly">Chỉ hiện SP sắp hết hàng</label>
        </div>
      </div>

      <div class="right-actions">
        <!-- Nút export với dropdown -->
        <div class="export-dropdown">
          <button class="btn-outline-custom" @click="toggleExportDropdown">
            <i class="bi bi-file-earmark-excel"></i> Xuất Excel
            <i class="bi bi-chevron-down"></i>
          </button>
          <div v-if="showExportDropdown" class="export-options">
            <button @click="exportAllProducts">
              <i class="bi bi-download"></i> Xuất tất cả sản phẩm
            </button>
            <button @click="exportFilteredProducts">
              <i class="bi bi-filter-square"></i> Xuất sản phẩm hiển thị
            </button>
            <button @click="exportLowStockProducts">
              <i class="bi bi-exclamation-triangle"></i> Xuất sản phẩm sắp hết
            </button>
            <button @click="exportProductTemplates">
              <i class="bi bi-file-earmark-plus"></i> Template nhập hàng
            </button>
          </div>
        </div>

        <button
          class="btn-primary-custom"
          @click="$router.push({ name: 'productsAdd' })"
        >
          <i class="bi bi-plus-lg"></i> Thêm sản phẩm
        </button>
      </div>
    </div>

    <!-- Export Progress Modal -->
    <div v-if="showExportModal" class="export-modal-overlay">
      <div class="export-modal">
        <div class="export-modal-header">
          <h3><i class="bi bi-file-earmark-excel"></i> Xuất Excel</h3>
          <button class="btn-close-modal" @click="showExportModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="export-modal-body">
          <div v-if="exportProgress.status === 'processing'">
            <div class="export-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: exportProgress.percentage + '%' }"
                ></div>
              </div>
              <p>{{ exportProgress.message }}</p>
              <p class="export-stats">{{ exportProgress.stats }}</p>
            </div>
          </div>

          <div v-else-if="exportProgress.status === 'success'">
            <div class="export-success">
              <div class="success-icon">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <h4 class="success-title">Xuất file thành công!</h4>
              <p class="success-description">File đã được tải xuống tự động</p>

              <div class="file-info-card">
                <div class="file-info-row">
                  <i class="bi bi-file-earmark-excel"></i>
                  <div class="file-details">
                    <div class="file-name">{{ exportProgress.fileName }}</div>
                    <div class="file-size">
                      {{ getFileSize(exportProgress.summary) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="export-summary-grid">
                <div class="summary-item">
                  <div class="summary-icon">
                    <i class="bi bi-box"></i>
                  </div>
                  <div class="summary-content">
                    <div class="summary-value">
                      {{ exportProgress.summary.totalProducts }}
                    </div>
                    <div class="summary-label">Sản phẩm</div>
                  </div>
                </div>

                <div class="summary-item">
                  <div class="summary-icon">
                    <i class="bi bi-upc-scan"></i>
                  </div>
                  <div class="summary-content">
                    <div class="summary-value">
                      {{ exportProgress.summary.totalVariants }}
                    </div>
                    <div class="summary-label">Biến thể</div>
                  </div>
                </div>

                <div class="summary-item">
                  <div class="summary-icon">
                    <i class="bi bi-calendar-check"></i>
                  </div>
                  <div class="summary-content">
                    <div class="summary-value">
                      {{ formatDate(exportProgress.summary.generatedAt) }}
                    </div>
                    <div class="summary-label">Thời gian</div>
                  </div>
                </div>
              </div>

              <div class="action-buttons">
                <button
                  class="btn-download-secondary"
                  @click="downloadExportedFile"
                >
                  <i class="bi bi-download"></i> Tải lại file
                </button>
                <button
                  class="btn-close-success"
                  @click="showExportModal = false"
                >
                  <i class="bi bi-check-lg"></i> Hoàn tất
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="exportProgress.status === 'error'">
            <div class="export-error">
              <div class="error-icon">
                <i class="bi bi-x-circle-fill"></i>
              </div>
              <h4 class="error-title">Xuất file thất bại</h4>
              <p class="error-message">{{ exportProgress.error }}</p>
              <div class="action-buttons">
                <button class="btn-retry" @click="retryExport">
                  <i class="bi bi-arrow-clockwise"></i> Thử lại
                </button>
                <button
                  class="btn-close-error"
                  @click="showExportModal = false"
                >
                  <i class="bi bi-x-lg"></i> Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
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
                  <i
                    class="bi"
                    :class="
                      product.isExpanded
                        ? 'bi-chevron-down'
                        : 'bi-chevron-right'
                    "
                  ></i>
                </button>
              </td>

              <td>
                <img :src="product.image" class="product-thumb" alt="img" />
              </td>

              <td>
                <div class="product-info">
                  <span class="product-name" :title="product.name">{{
                    product.name
                  }}</span>
                  <div class="sub-info">
                    <span class="sku-badge">{{ product.sku }}</span>
                    <span class="category-text">{{ product.category }}</span>
                  </div>
                </div>
              </td>

              <td>
                <div class="price-group">
                  <span class="current-price">{{
                    formatCurrency(product.price)
                  }}</span>
                </div>
              </td>

              <td class="text-center">
                <div class="stock-overview">
                  <span :class="getStockClass(product.totalStock)">{{
                    formatNumber(product.totalStock)
                  }}</span>
                  <i
                    v-if="hasLowStockVariant(product)"
                    class="bi bi-exclamation-circle-fill text-warning"
                    title="Có phân loại sắp hết hàng"
                  ></i>
                </div>
              </td>

              <td>
                <div class="variant-badges">
                  <span class="v-count"
                    >{{ product.variants.length }} biến thể</span
                  >
                </div>
              </td>

              <td>
                <div class="status-toggle" @click="toggleStatus(product)">
                  <span
                    class="dot"
                    :class="product.isActive ? 'bg-success' : 'bg-gray'"
                  ></span>
                  {{ product.isActive ? "Đang bán" : "Đã ẩn" }}
                </div>
              </td>

              <td class="text-center">
                <RouterLink
                  :to="`/edit-product/${product.id}`"
                  class="btn-icon"
                  title="Chỉnh sửa"
                  ><i class="bi bi-pencil-square text-blue"></i
                ></RouterLink>
              </td>
            </tr>

            <tr v-if="product.isExpanded" class="detail-row">
              <td colspan="8">
                <div class="detail-container">
                  <div class="detail-header">
                    <h5>
                      <i class="bi bi-grid-3x3-gap"></i> Chi tiết tồn kho & Biến
                      thể
                    </h5>
                    <button
                      class="btn-xs-primary"
                      @click="addVariantToProduct(product)"
                    >
                      + Thêm biến thể
                    </button>
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
                        <tr
                          v-for="(variant, vIndex) in product.variants"
                          :key="vIndex"
                        >
                          <td class="text-muted font-monospace">
                            {{ product.sku }}-{{ variant.size }}-{{
                              variant.colorCode
                            }}
                          </td>
                          <td>
                            <span class="badge-size">{{ variant.size }}</span>
                          </td>
                          <td>
                            <div class="badge-color">
                              <span
                                class="color-dot"
                                :style="{ backgroundColor: variant.hex }"
                              ></span>
                              {{ variant.color }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="quick-stock-edit">
                              <input
                                type="number"
                                v-model.number="variant.stock"
                                :class="{ 'text-red': variant.stock < 5 }"
                                @change="updateVariantStock(product, variant)"
                              />
                            </div>
                          </td>
                          <td class="text-center text-muted">
                            {{ variant.sold }}
                          </td>
                          <td class="text-center">
                            <button
                              class="btn-icon-sm text-red"
                              title="Xóa biến thể"
                              @click="deleteVariant(product, variant, vIndex)"
                              :disabled="variant.isDeleting"
                            >
                              <i
                                v-if="!variant.isDeleting"
                                class="bi bi-trash"
                              ></i>
                              <i v-else class="bi bi-arrow-clockwise"></i>
                            </button>
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
        <b>{{
          Math.min(currentPage * itemsPerPage, filteredProducts.length)
        }}</b>
        trong tổng <b>{{ filteredProducts.length }}</b> sản phẩm
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const API_BASE_URL = "http://localhost:3000";
const products = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const selectedCategory = ref("");
const filterLowStock = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const showExportDropdown = ref(false);
const showExportModal = ref(false);
const lastExportedFile = ref(null);

// Export progress tracking
const exportProgress = ref({
  status: "idle", // idle, processing, success, error
  percentage: 0,
  message: "",
  stats: "",
  fileName: "",
  summary: {},
  error: "",
  data: null,
});

// Dropdown data refs
const sizeList = ref([]);
const colorList = ref([]);
const categoriesList = ref([]);

// Toggle export dropdown
const toggleExportDropdown = () => {
  showExportDropdown.value = !showExportDropdown.value;
};

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".export-dropdown")) {
    showExportDropdown.value = false;
  }
});

// ==================== EXPORT FUNCTIONS ====================

// Export all products
const exportAllProducts = () => {
  showExportDropdown.value = false;
  startExport(products.value, "all");
};

// Export filtered products
const exportFilteredProducts = () => {
  showExportDropdown.value = false;
  startExport(filteredProducts.value, "filtered");
};

// Export low stock products
const exportLowStockProducts = () => {
  showExportDropdown.value = false;
  const lowStockProducts = products.value.filter((p) =>
    p.variants.some((v) => v.stock < 5)
  );
  startExport(lowStockProducts, "low-stock");
};

// Export product template for import
const exportProductTemplates = () => {
  showExportDropdown.value = false;

  // Create template data
  const templateData = [
    {
      "SKU Chính": "SP001-2025",
      "Tên Sản Phẩm": "Áo Thun Cotton Premium",
      "Danh Mục": "BST Hè 2025",
      "Giá Bán (VND)": 595000,
      "Mô Tả": "Mô tả sản phẩm...",
      Size: "S,M,L,XL",
      "Màu Sắc": "Đỏ,Đen,Trắng",
      "Số Lượng Mỗi Biến Thể": 10,
      "Chất Liệu": "100% Cotton",
      "Phom Dáng": "Slim Fit",
      "Xuất Xứ": "Việt Nam",
      "Nhà Sản Xuất": "Công ty ABC",
      "Năm Sản Xuất": 2025,
    },
  ];

  // Add instructions sheet
  const instructionData = [
    ["HƯỚNG DẪN NHẬP HÀNG"],
    ['1. Nhập thông tin sản phẩm vào sheet "Danh sách sản phẩm"'],
    ["2. Cột bắt buộc: SKU Chính, Tên Sản Phẩm, Giá Bán"],
    ["3. Size và Màu Sắc: nhập cách nhau bằng dấu phẩy (,)"],
    ["4. Số lượng sẽ được chia đều cho các biến thể"],
    ["5. Không xóa dòng tiêu đề"],
    ["6. Lưu file và tải lên hệ thống"],
  ];

  const wb = XLSX.utils.book_new();

  // Main data sheet
  const ws = XLSX.utils.json_to_sheet(templateData);
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách sản phẩm");

  // Instructions sheet
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionData);
  XLSX.utils.book_append_sheet(wb, wsInstructions, "Hướng dẫn");

  // Auto-size columns
  const wscols = [
    { wch: 15 }, // SKU Chính
    { wch: 30 }, // Tên Sản Phẩm
    { wch: 20 }, // Danh Mục
    { wch: 15 }, // Giá Bán
    { wch: 40 }, // Mô Tả
    { wch: 15 }, // Size
    { wch: 15 }, // Màu Sắc
    { wch: 20 }, // Số Lượng
    { wch: 20 }, // Chất Liệu
    { wch: 15 }, // Phom Dáng
    { wch: 15 }, // Xuất Xứ
    { wch: 20 }, // Nhà SX
    { wch: 15 }, // Năm SX
  ];
  ws["!cols"] = wscols;

  const fileName = `Template_Nhap_Hang_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(wb, fileName);

  Swal.fire({
    title: "Template đã được tải xuống!",
    text: "Vui lòng điền thông tin theo mẫu và tải lên hệ thống.",
    icon: "success",
    timer: 3000,
    showConfirmButton: false,
  });
};

// Main export function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startExport = async (data, type) => {
  try {
    showExportModal.value = true;
    exportProgress.value = {
      status: "processing",
      percentage: 0,
      message: "Đang chuẩn bị dữ liệu...",
      stats: "",
      fileName: "",
      summary: {},
      error: "",
      data: data,
    };

    // Bước 1: Chuẩn bị dữ liệu
    await delay(100); // Để UI kịp hiển thị
    exportProgress.value.message = "Đang xử lý dữ liệu sản phẩm...";
    exportProgress.value.percentage = 20;
    exportProgress.value.stats = `Đang chuẩn bị ${data.length} sản phẩm`;

    const exportData = await prepareExportData(data, type);
    await delay(300); // Giả lập thời gian xử lý

    // Bước 2: Tạo workbook
    exportProgress.value.message = "Đang tạo file Excel...";
    exportProgress.value.percentage = 50;
    exportProgress.value.stats = `Đã xử lý ${exportData.summary.totalProducts} sản phẩm`;
    await delay(100);

    const wb = XLSX.utils.book_new();
    const wsProducts = XLSX.utils.json_to_sheet(exportData.products);
    XLSX.utils.book_append_sheet(wb, wsProducts, "Sản phẩm");
    // ... (thêm các sheet variants và summary)

    // Bước 3: Ghi file
    exportProgress.value.message = "Đang ghi file và tải xuống...";
    exportProgress.value.percentage = 80;
    await delay(200);

    const fileName = generateFileName(type);
    XLSX.writeFile(wb, fileName); // Lệnh ghi file đồng bộ

    // Bước 4: Hoàn thành
    exportProgress.value.message = "Hoàn thành!";
    exportProgress.value.percentage = 100;
    exportProgress.value.stats = `Đã xuất ${exportData.summary.totalProducts} sản phẩm`;
    await delay(500); // Hiển thị trạng thái 100% một lát

    // Chuyển sang trạng thái thành công
    exportProgress.value.status = "success";
    exportProgress.value.fileName = fileName;
    exportProgress.value.summary = {
      totalProducts: exportData.summary.totalProducts,
      totalVariants: exportData.summary.totalVariants,
      generatedAt: new Date().toLocaleString("vi-VN"),
    };
    lastExportedFile.value = { fileName, data: wb, timestamp: new Date() };
  } catch (error) {
    console.error("Export error:", error);
    exportProgress.value.status = "error";
    exportProgress.value.error = "Lỗi xuất file: " + error.message;
  }
};

// Prepare data for export
const prepareExportData = async (productsData, type) => {
  const productsExport = [];
  const variantsExport = [];

  let totalStock = 0;
  let totalValue = 0;
  let lowStockProducts = 0;
  let lowStockVariants = 0;

  for (let i = 0; i < productsData.length; i++) {
    const product = productsData[i];
    const hasLowStock = product.variants.some((v) => v.stock < 5);

    if (hasLowStock) lowStockProducts++;

    // Product data
    productsExport.push({
      STT: i + 1,
      "SKU Chính": product.sku,
      "Tên Sản Phẩm": product.name,
      "Danh Mục": product.category,
      "Giá Bán (VND)": product.price,
      "Tổng Tồn Kho": product.totalStock,
      "Trạng Thái": product.isActive ? "Đang bán" : "Đã ẩn",
      "Số Biến Thể": product.variants.length,
      "Cảnh Báo Tồn Kho": hasLowStock ? "CÓ" : "KHÔNG",
      "Ngày Cập Nhật": product.lastUpdated,
      "Mô Tả Ngắn": product.description || "",
    });

    totalStock += product.totalStock;
    totalValue += product.price * product.totalStock;

    // Variants data
    product.variants.forEach((variant, vIndex) => {
      const isLowStock = variant.stock < 5;
      if (isLowStock) lowStockVariants++;

      variantsExport.push({
        STT: variantsExport.length + 1,
        "SKU Chính": product.sku,
        "SKU Phân Loại": `${product.sku}-${variant.size}-${variant.colorCode}`,
        "Tên Sản Phẩm": product.name,
        Size: variant.size,
        "Màu Sắc": variant.color,
        "Mã Màu": variant.hex,
        "Tồn Kho": variant.stock,
        "Cảnh Báo": isLowStock ? "SẮP HẾT (<5)" : "BÌNH THƯỜNG",
        "Giá Bán (VND)": product.price,
        "Giá Trị Tồn Kho": product.price * variant.stock,
      });
    });

    // Update progress
    exportProgress.value.percentage =
      20 + Math.floor((i / productsData.length) * 30);
    exportProgress.value.stats = `Đang xử lý sản phẩm ${i + 1}/${
      productsData.length
    }`;
  }

  return {
    products: productsExport,
    variants: variantsExport,
    summary: {
      totalProducts: productsData.length,
      totalVariants: variantsExport.length,
      totalStock,
      totalValue,
      lowStockProducts,
      lowStockVariants,
    },
  };
};

// Auto-size columns
const autoSizeColumns = (worksheet, columnWidths) => {
  worksheet["!cols"] = columnWidths;
};

// Generate file name
const generateFileName = (type) => {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "-");

  const typeMap = {
    all: "Tat_ca_san_pham",
    filtered: "San_pham_hien_thi",
    "low-stock": "San_pham_sap_het",
  };

  return `Bao_cao_${typeMap[type]}_${dateStr}_${timeStr}.xlsx`;
};

// Get export type label
const getExportTypeLabel = (type) => {
  const labels = {
    all: "Tất cả sản phẩm",
    filtered: "Sản phẩm đang hiển thị",
    "low-stock": "Sản phẩm sắp hết hàng",
  };
  return labels[type] || "Không xác định";
};

// Download exported file again
const downloadExportedFile = () => {
  if (lastExportedFile.value && lastExportedFile.value.data) {
    XLSX.writeFile(
      lastExportedFile.value.data,
      lastExportedFile.value.fileName
    );
  }
};

// Retry export
const retryExport = () => {
  if (exportProgress.value.data) {
    startExport(exportProgress.value.data, "retry");
  }
};

// ==================== PRODUCT MANAGEMENT FUNCTIONS ====================

const fetchDropdownData = async () => {
  try {
    const [sizesRes, colorsRes, categoriesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/size`),
      axios.get(`${API_BASE_URL}/color`),
      axios.get(`${API_BASE_URL}/categories`),
    ]);

    sizeList.value = sizesRes.data || [];
    colorList.value = colorsRes.data || [];
    categoriesList.value = categoriesRes.data || [];
  } catch (error) {
    console.error("Error fetching dropdown data:", error);

    // Fallback data
    sizeList.value = [
      { id: "1", name: "S" },
      { id: "2", name: "M" },
      { id: "3", name: "L" },
      { id: "4", name: "XL" },
    ];

    colorList.value = [
      { id: "1", name: "Đỏ" },
      { id: "2", name: "Trắng" },
      { id: "3", name: "Đen" },
      { id: "4", name: "Trắng/Đen" },
      { id: "5", name: "Ghi" },
    ];

    categoriesList.value = [
      { id: "40", name: "BST Hè 2025" },
      { id: "2", name: "Áo Đông 2025" },
    ];
  }
};

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE_URL}/products`);

    products.value = response.data.map((product) => ({
      id: product.id,
      sku: product.sku || `SP${product.id.toString().padStart(3, "0")}`,
      name: product.name,
      category: getCategoryName(product.categoryId),
      image:
        product.image?.[0]?.url || "https://placehold.co/40x40?text=No+Image",
      price: product.price || 0,
      description: product.description || "",
      totalStock: calculateTotalStock(product),
      variants: transformVariants(product),
      isActive: true,
      isExpanded: false,
      lastUpdated: product.create_At || new Date().toLocaleDateString("vi-VN"),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

const calculateTotalStock = (product) => {
  if (product.variant && product.variant.length > 0) {
    return product.variant.reduce(
      (sum, variant) => sum + (variant.quantity || 0),
      0
    );
  }
  return product.stock || 0;
};

const transformVariants = (product) => {
  if (!product.variant || product.variant.length === 0) {
    return [
      {
        id: generateId(),
        size_id: "",
        color_id: "",
        size: "M",
        color: "Đen",
        hex: "#000000",
        colorCode: "BK",
        stock: product.stock || 0,
        isDeleting: false,
      },
    ];
  }

  return product.variant.map((variant, index) => {
    const sizeObj = sizeList.value.find(
      (s) => s.id === variant.size_id?.toString()
    );
    const sizeName = sizeObj ? sizeObj.name : "M";

    const colorObj = colorList.value.find(
      (c) => c.id === variant.color_id?.toString()
    );
    const colorName = colorObj ? colorObj.name : "Đen";
    const colorHex = getColorHex(variant.color_id);
    const colorCode = getColorCode(variant.color_id);

    return {
      id: variant.id || `variant-${product.id}-${index}`,
      size_id: variant.size_id,
      color_id: variant.color_id,
      size: sizeName,
      color: colorName,
      hex: colorHex,
      colorCode: colorCode,
      stock: variant.quantity || 0,
      isDeleting: false,
    };
  });
};

// Helper functions
const getCategoryName = (categoryId) => {
  if (!categoryId) return "Chưa phân loại";

  const category = categoriesList.value.find(
    (cat) => cat.id === categoryId || cat.id === categoryId.toString()
  );
  if (category) return category.name;

  const categoryMap = {
    40: "BST Hè 2025",
    2: "Áo Đông 2025",
  };
  return categoryMap[categoryId] || "Chưa phân loại";
};

const getColorHex = (colorId) => {
  const colorMap = {
    1: "#ef4444", // Đỏ
    2: "#ffffff", // Trắng
    3: "#000000", // Đen
    4: "#6b7280", // Trắng/Đen
    5: "#9ca3af", // Ghi
    6: "#7f1d1d", // Đỏ đô
    7: "#f472b6", // Hồng
  };
  return colorMap[colorId] || "#9ca3af";
};

const getColorCode = (colorId) => {
  const codeMap = {
    1: "RD", // Đỏ
    2: "WH", // Trắng
    3: "BK", // Đen
    4: "WB", // Trắng/Đen
    5: "GY", // Ghi
    6: "BR", // Đỏ đô
    7: "PK", // Hồng
  };
  return codeMap[colorId] || "OT";
};

const generateId = () => {
  return `ID-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const filteredProducts = computed(() => {
  let result = products.value;

  if (selectedCategory.value) {
    result = result.filter((p) => p.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(key) || p.sku.toLowerCase().includes(key)
    );
  }

  if (filterLowStock.value) {
    result = result.filter((p) => p.variants.some((v) => v.stock < 5));
  }

  return result;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(
  () => Math.ceil(filteredProducts.value.length / itemsPerPage) || 1
);

const stats = computed(() => {
  let totalSKUs = 0;
  let lowStockVariant = 0;

  products.value.forEach((p) => {
    totalSKUs += p.variants.length;
    p.variants.forEach((v) => {
      if (v.stock < 5) lowStockVariant++;
    });
  });

  return {
    totalProducts: products.value.length,
    totalSKUs,
    lowStockVariant,
    inCampaign: products.value.filter((p) => p.discount_id).length || 0,
  };
});

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );
const formatNumber = (val) => new Intl.NumberFormat("vi-VN").format(val);

const toggleExpand = (product) => {
  product.isExpanded = !product.isExpanded;
};

const toggleStatus = async (product) => {
  try {
    const result = await Swal.fire({
      title: "Thay đổi trạng thái",
      text: `Bạn có chắc muốn ${
        product.isActive ? "ẩn" : "hiển thị"
      } sản phẩm này?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await axios.patch(`${API_BASE_URL}/products/${product.id}`, {
        isActive: !product.isActive,
      });

      product.isActive = !product.isActive;

      Swal.fire({
        title: "Thành công!",
        text: `Sản phẩm đã ${product.isActive ? "được hiển thị" : "bị ẩn"}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error("Error updating product status:", error);

    Swal.fire({
      title: "Lỗi!",
      text: "Không thể cập nhật trạng thái sản phẩm.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

const getStockClass = (stock) => {
  if (stock === 0) return "stock-badge out";
  if (stock < 20) return "stock-badge low";
  return "stock-text";
};

const hasLowStockVariant = (product) => {
  return product.variants.some((v) => v.stock < 5);
};

// Variant functions
const addVariantToProduct = (product) => {
  const defaultSize = sizeList.value.length > 0 ? sizeList.value[0].id : "";
  const defaultColor = colorList.value.length > 0 ? colorList.value[0].id : "";
  const defaultColorHex = getColorHex(defaultColor);
  const defaultColorCode = getColorCode(defaultColor);

  product.variants.push({
    id: generateId(),
    size_id: defaultSize,
    color_id: defaultColor,
    size: sizeList.value.find((s) => s.id === defaultSize)?.name || "",
    color: colorList.value.find((c) => c.id === defaultColor)?.name || "",
    hex: defaultColorHex,
    colorCode: defaultColorCode,
    stock: 0,
    isDeleting: false,
    isNew: true,
  });
};

const deleteVariant = async (product, variant, variantIndex) => {
  try {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa biến thể ${product.sku}-${variant.size}-${variant.colorCode}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      variant.isDeleting = true;

      if (variant.id && !variant.isNew) {
        await axios.delete(
          `${API_BASE_URL}/products/${product.id}/variants/${variant.id}`
        );

        Swal.fire({
          title: "Đã xóa!",
          text: "Biến thể đã được xóa thành công.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Đã xóa!",
          text: "Biến thể đã được xóa.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      product.variants.splice(variantIndex, 1);
      product.totalStock = product.variants.reduce(
        (sum, v) => sum + (v.stock || 0),
        0
      );

      if (product.variants.length === 0) {
        const defaultSize =
          sizeList.value.length > 0 ? sizeList.value[0].id : "";
        const defaultColor =
          colorList.value.length > 0 ? colorList.value[0].id : "";

        product.variants.push({
          id: generateId(),
          size_id: defaultSize,
          color_id: defaultColor,
          size: sizeList.value.find((s) => s.id === defaultSize)?.name || "M",
          color:
            colorList.value.find((c) => c.id === defaultColor)?.name || "Đen",
          hex: getColorHex(defaultColor),
          colorCode: getColorCode(defaultColor),
          stock: 0,
          isDeleting: false,
          isNew: true,
        });
      }
    }
  } catch (error) {
    console.error("Error deleting variant:", error);

    Swal.fire({
      title: "Lỗi!",
      text: "Không thể xóa biến thể. Vui lòng thử lại.",
      icon: "error",
      confirmButtonText: "OK",
    });

    variant.isDeleting = false;
  }
};

const updateVariantStock = async (product, variant) => {
  try {
    if (variant.stock < 0) {
      variant.stock = 0;
    }

    if (variant.id && !variant.isNew) {
      await axios.patch(
        `${API_BASE_URL}/products/${product.id}/variants/${variant.id}`,
        {
          quantity: variant.stock,
        }
      );

      Swal.fire({
        title: "Đã cập nhật!",
        text: "Số lượng tồn kho đã được cập nhật.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    }

    product.totalStock = product.variants.reduce(
      (sum, v) => sum + (v.stock || 0),
      0
    );
  } catch (error) {
    console.error("Error updating variant stock:", error);

    Swal.fire({
      title: "Lỗi!",
      text: "Không thể cập nhật số lượng tồn kho.",
      icon: "error",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

onMounted(async () => {
  await fetchDropdownData();
  await fetchProducts();
});
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

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  gap: 15px;
}

.loading-spinner i {
  font-size: 40px;
  color: #2563eb;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ========== EXPORT DROPDOWN ========== */
.export-dropdown {
  position: relative;
  display: inline-block;
}

.export-dropdown .btn-outline-custom {
  display: flex;
  align-items: center;
  gap: 6px;
}

.export-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 220px;
  z-index: 100;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.export-options button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.export-options button:last-child {
  border-bottom: none;
}

.export-options button:hover {
  background-color: #f8fafc;
  color: #2563eb;
}

.export-options button:hover i {
  color: #2563eb;
}

.export-options button i {
  width: 18px;
  color: #6b7280;
  font-size: 14px;
  transition: color 0.2s;
}

/* ========== EXPORT MODAL ========== */
.export-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInOverlay 0.3s ease;
}

@keyframes fadeInOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.export-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.export-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.export-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.export-modal-header h3 i {
  font-size: 22px;
}

.btn-close-modal {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.export-modal-body {
  padding: 30px;
}

/* ========== PROGRESS STATE ========== */
.export-progress {
  text-align: center;
  padding: 20px 0;
}

.progress-container {
  margin-bottom: 25px;
}

.progress-bar {
  height: 10px;
  background: #e5e7eb;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
}

.progress-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981, #3b82f6);
  background-size: 200% 100%;
  border-radius: 5px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: progressShimmer 2s infinite linear;
  position: relative;
  z-index: 1;
}

@keyframes progressShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.progress-stats {
  font-size: 13px;
  color: #6b7280;
}

.progress-message {
  color: #374151;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 5px;
}

.progress-details {
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.5;
}

/* ========== SUCCESS STATE ========== */
.export-success {
  text-align: center;
  padding: 10px 0;
}

.success-icon {
  margin-bottom: 25px;
  animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon i {
  font-size: 72px;
  color: #10b981;
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.success-description {
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 30px;
  line-height: 1.5;
}

/* File Info Card */
.file-info-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.file-info-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-info-row i {
  font-size: 36px;
  color: #059669;
  flex-shrink: 0;
}

.file-details {
  text-align: left;
  flex: 1;
  overflow: hidden;
}

.file-name {
  font-weight: 600;
  color: #111827;
  font-size: 15px;
  margin-bottom: 6px;
  word-break: break-all;
  line-height: 1.4;
}

.file-size {
  color: #6b7280;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-size i {
  font-size: 12px;
}

/* Summary Grid */
.export-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 35px;
}

.summary-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 15px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.summary-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.summary-icon {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.summary-icon i {
  font-size: 28px;
  color: #3b82f6;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-value {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
  line-height: 1;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Success Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 10px;
}

.btn-download-secondary {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  min-width: 140px;
  justify-content: center;
}

.btn-download-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-close-success {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  min-width: 140px;
  justify-content: center;
}

.btn-close-success:hover {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

/* ========== ERROR STATE ========== */
.export-error {
  text-align: center;
  padding: 20px 0;
}

.error-icon {
  margin-bottom: 25px;
  animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

.error-icon i {
  font-size: 72px;
  color: #ef4444;
  background: linear-gradient(135deg, #ef4444, #f87171);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.error-message {
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 35px;
  line-height: 1.6;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 10px;
}

/* Error Action Buttons */
.btn-retry {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  min-width: 140px;
  justify-content: center;
}

.btn-retry:hover {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-close-error {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  min-width: 140px;
  justify-content: center;
}

.btn-close-error:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .export-modal {
    width: 95%;
    max-width: 95%;
    margin: 20px;
  }

  .export-modal-header {
    padding: 20px;
  }

  .export-modal-body {
    padding: 20px;
  }

  .export-summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .btn-download-secondary,
  .btn-close-success,
  .btn-retry,
  .btn-close-error {
    min-width: 100%;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .export-summary-grid {
    grid-template-columns: 1fr;
  }

  .export-modal-header h3 {
    font-size: 18px;
  }

  .success-title,
  .error-title {
    font-size: 20px;
  }

  .success-icon i,
  .error-icon i {
    font-size: 56px;
  }
}
</style>
