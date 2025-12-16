<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="manager-tabs">
        <button v-for="tab in managerTabs" :key="tab.id" class="manager-tab-btn"
          :class="{ active: activeManagerTab === tab.id }" @click="activeManagerTab = tab.id">
          <i :class="tab.icon"></i> {{ tab.label }}
        </button>
      </div>

      <div class="stats-grid" v-if="activeManagerTab === 'category'">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-diagram-3-fill"></i></div>
          <div class="info">
            <h3>{{ stats.total }}</h3>
            <p>Tổng danh mục</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-folder-fill"></i></div>
          <div class="info">
            <h3>{{ stats.parents }}</h3>
            <p>Danh mục gốc</p>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="icon"><i class="bi bi-palette-fill"></i></div>
          <div class="info">
            <h3>{{ colors.length }}</h3>
            <p>Màu sắc</p>
          </div>
        </div>
        <div class="stat-card gray">
          <div class="icon"><i class="bi bi-rulers"></i></div>
          <div class="info">
            <h3>{{ sizes.length }}</h3>
            <p>Kích cỡ</p>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbar-top">
      <div class="left-actions">
        <div class="status-tabs" v-if="activeManagerTab === 'category'">
          <button v-for="tab in filterTabs" :key="tab.value" class="tab-btn"
            :class="{ active: currentStatus === tab.value }" @click="setFilter(tab.value)">
            {{ tab.label }}
          </button>
        </div>

        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" type="text" :placeholder="`Tìm kiếm ${getTabName}...`" />
        </div>
      </div>

      <div class="right-actions">
        <button class="btn-outline-custom" @click="expandAll" v-if="activeManagerTab === 'category'">
          <i class="bi bi-arrows-expand"></i> Mở tất cả
        </button>

        <router-link v-if="activeManagerTab === 'category'" :to="{ name: 'category-add' }" class="btn-primary-custom"
          style="text-decoration: none;">
          <i class="bi bi-plus-lg"></i> Thêm Danh Mục
        </router-link>

        <button v-else class="btn-primary-custom" @click="openModal()">
          <i class="bi bi-plus-lg"></i> Thêm {{ getTabName }}
        </button>
      </div>
    </div>

    <div class="table-container">

      <table v-if="activeManagerTab === 'category'">
        <thead>
          <tr>
            <th width="50%">Tên Danh Mục</th>
            <th width="15%">ID</th>
            <th width="15%">Trạng Thái</th>
            <th width="20%" class="text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="category in filteredCategories" :key="category.id">
            <tr class="row-parent" :class="{ 'expanded': category.isOpen }">
              <td>
                <div class="tree-cell">
                  <button class="tree-toggle" @click="toggleCategory(category)"
                    v-if="category.children && category.children.length">
                    <i class="bi" :class="category.isOpen ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"></i>
                  </button>
                  <span class="tree-spacer" v-else></span>

                  <div class="cat-info">
                    <span class="cat-name fw-bold">{{ category.name }}</span>
                    <span class="cat-slug text-muted text-xs">/{{ category.slug }}</span>
                  </div>
                </div>
              </td>
              <td class="text-muted text-xs">#{{ category.id }}</td>
              <td>
                <div class="status-toggle" @click="toggleStatus(category)">
                  <span class="dot" :class="category.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                  {{ category.status === 'active' ? 'Hiển thị' : 'Ẩn' }}
                </div>
              </td>
              <td class="text-center">
                <button class="btn-icon" title="Sửa" @click="openModal(category)"><i
                    class="bi bi-pencil-square text-blue"></i></button>
                <button class="btn-icon" title="Xóa" @click="deleteItem(category.id)"><i
                    class="bi bi-trash text-red"></i></button>
              </td>
            </tr>
            <template v-if="category.isOpen && category.children">
              <tr v-for="child in category.children" :key="child.id" class="row-child">
                <td>
                  <div class="tree-cell child">
                    <div class="tree-connector"></div>
                    <div class="cat-info">
                      <span class="cat-name">{{ child.name }}</span>
                      <span class="cat-slug text-muted text-xs">/{{ child.slug }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-muted text-xs">#{{ child.id }}</td>
                <td>
                  <div class="status-toggle" @click="toggleStatus(child)">
                    <span class="dot" :class="child.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                    {{ child.status === 'active' ? 'Hiển thị' : 'Ẩn' }}
                  </div>
                </td>
                <td class="text-center">
                  <button class="btn-icon" title="Sửa" @click="openModal(child)"><i
                      class="bi bi-pencil text-muted"></i></button>
                  <button class="btn-icon" title="Xóa" @click="deleteItem(child.id)"><i
                      class="bi bi-trash text-muted"></i></button>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>

      <table v-else-if="activeManagerTab === 'color'">
        <thead>
          <tr>
            <th width="40%">Tên Màu</th>
            <th width="25%">Mã màu (Hex)</th>
            <th width="20%">Hiển thị</th>
            <th width="15%" class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingData && activeManagerTab === 'color'">
              <td colspan="4" class="empty-state">
                <i class="bi bi-arrow-clockwise animate-spin"></i> Đang tải dữ liệu màu sắc...
              </td>
          </tr>
          <tr v-else v-for="color in filteredColors" :key="color.id" class="row-parent">
            <td class="fw-bold">{{ color.name }}</td>
            <td class="font-monospace text-muted">{{ color.hex }}</td>
            <td>
              <div class="color-preview-box" :style="{ backgroundColor: color.hex }"></div>
            </td>
            <td class="text-center">
              <button class="btn-icon" @click="openModal(color)"><i class="bi bi-pencil-square text-blue"></i></button>
              <button class="btn-icon" @click="deleteItem(color.id)"><i class="bi bi-trash text-red"></i></button>
            </td>
          </tr>
          <tr v-if="!loadingData && filteredColors.length === 0 && activeManagerTab === 'color'">
            <td colspan="4" class="empty-state">Không tìm thấy màu sắc nào</td>
          </tr>
        </tbody>
      </table>

      <table v-else-if="activeManagerTab === 'size'">
        <thead>
          <tr>
            <th width="40%">Tên hiển thị</th>
            <th width="40%">Mã kích cỡ (Code)</th>
            <th width="20%" class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingData && activeManagerTab === 'size'">
              <td colspan="3" class="empty-state">
                <i class="bi bi-arrow-clockwise animate-spin"></i> Đang tải dữ liệu kích cỡ...
              </td>
          </tr>
          <tr v-else v-for="size in filteredSizes" :key="size.id" class="row-parent">
            <td class="fw-bold">{{ size.name }}</td>
            <td><span class="badge-code">{{ size.code }}</span></td>
            <td class="text-center">
              <button class="btn-icon" @click="openModal(size)"><i class="bi bi-pencil-square text-blue"></i></button>
              <button class="btn-icon" @click="deleteItem(size.id)"><i class="bi bi-trash text-red"></i></button>
            </td>
          </tr>
          <tr v-if="!loadingData && filteredSizes.length === 0 && activeManagerTab === 'size'">
            <td colspan="3" class="empty-state">Không tìm thấy kích cỡ nào</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }} {{ getTabName }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          
          <div v-if="activeManagerTab === 'category'" class="form-group">
            <label>Tên danh mục</label>
            <input v-model="formData.name" type="text" class="form-input" placeholder="Ví dụ: Áo phông">

            <label class="mt-2">Trạng thái</label>
            <div class="status-group-modal">
                <label class="status-item">
                    <input type="radio" v-model="formData.status" value="active" name="status-modal">
                    <span class="status-box">
                        <i class="bi bi-eye"></i> Hiển thị
                    </span>
                </label>
                <label class="status-item">
                    <input type="radio" v-model="formData.status" value="inactive" name="status-modal">
                    <span class="status-box">
                        <i class="bi bi-eye-slash"></i> Ẩn
                    </span>
                </label>
            </div>
          </div>
          <div v-else-if="activeManagerTab === 'color'" class="form-group">
            <label>Tên màu</label>
            <input v-model="formData.name" type="text" class="form-input" placeholder="Ví dụ: Đỏ đô">

            <label class="mt-2">Chọn màu</label>
            <div class="color-picker-wrapper">
              <input v-model="formData.hex" type="color" class="color-input">
              <input v-model="formData.hex" type="text" class="form-input" placeholder="#000000">
            </div>
          </div>

          <div v-else-if="activeManagerTab === 'size'" class="form-group">
            <label>Tên hiển thị</label>
            <input v-model="formData.name" type="text" class="form-input" placeholder="Ví dụ: Lớn, Nhỏ, 42...">

            <label class="mt-2">Mã viết tắt (Code)</label>
            <input v-model="formData.code" type="text" class="form-input" placeholder="XL, S, M...">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Hủy bỏ</button>
          <button class="btn-primary-custom" @click="saveData">Lưu thay đổi</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import Swal from 'sweetalert2'; 

// ----------------------------------------------------
// THIẾT LẬP CẤU HÌNH API
const API_URL = 'http://localhost:3000'; 
const CATEGORY_API_URL = `${API_URL}/categories`;
const COLOR_API_URL = `${API_URL}/color`; 
const SIZE_API_URL = `${API_URL}/size`; 
// ----------------------------------------------------

// --- DATA ---
const categories = ref([]); 
const colors = ref([]); 
const sizes = ref([]); 

// --- STATE MANAGEMENT ---
const activeManagerTab = ref('category');
const searchQuery = ref("");
const currentStatus = ref("all");
const loadingData = ref(false); 

const managerTabs = [
  { id: 'category', label: 'Danh mục', icon: 'bi bi-list-ul' },
  { id: 'color', label: 'Màu sắc', icon: 'bi bi-palette' },
  { id: 'size', label: 'Kích cỡ', icon: 'bi bi-rulers' }
];

const filterTabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hoạt động', value: 'active' },
  { label: 'Đang ẩn', value: 'inactive' }
];

// --- MODAL STATE ---
const showModal = ref(false);
const isEditMode = ref(false);
const formData = reactive({
  id: null,
  name: '',
  slug: '',
  hex: '#000000', 
  code: '', // Sử dụng cho Kích cỡ
  status: 'active',
  parentId: null,
  description: ''
});

// --- COMPUTED ---
const getTabName = computed(() => {
  if (activeManagerTab.value === 'category') return 'danh mục';
  if (activeManagerTab.value === 'color') return 'màu sắc';
  return 'kích cỡ';
});

/**
 * Hàm giúp tổ chức danh mục dạng cây (Parent-Child)
 */
const buildCategoryTree = (list) => {
    const map = {};
    const processedList = [];

    // Bước 1: Chuẩn hóa ID thành chuỗi để làm key Map
    list.forEach(item => {
        const itemIdString = String(item.id);
        const node = { 
            ...item, 
            id: itemIdString, // Chuẩn hóa ID thành chuỗi
            children: item.children || [], 
            isOpen: item.isOpen !== undefined ? item.isOpen : true, 
            status: item.status || 'active'
        };
        map[itemIdString] = node;
        processedList.push(node);
    });

    const tree = [];
    // Bước 2: Xây dựng mối quan hệ cha con (Sử dụng parentIdString để tra cứu)
    processedList.forEach(node => {
        const parentIdString = node.parentId !== null && node.parentId !== undefined ? String(node.parentId) : null;
        
        // Kiểm tra cha tồn tại trong map
        if (parentIdString && map[parentIdString]) {
            // Đây là danh mục con (đẩy vào mảng children của cha)
            if (!map[parentIdString].children.some(child => child.id === node.id)) {
                 map[parentIdString].children.push(node);
            }
        } else {
            // Đây là danh mục gốc (đẩy vào mảng tree chính)
            tree.push(node);
        }
    });
    return tree; // Chỉ trả về các danh mục gốc
};


// Filter Categories 
const filteredCategories = computed(() => {
  let list = categories.value;
    
  if (currentStatus.value !== 'all') {
      list = list.filter(parent => parent.status === currentStatus.value);
  }

  const key = searchQuery.value.toLowerCase();
  if (key) {
      list = list.filter(parent => {
          const parentMatch = parent.name.toLowerCase().includes(key);
          const childMatch = parent.children.some(child => child.name.toLowerCase().includes(key));
          return parentMatch || childMatch;
      });
  }
  
  return list;
});

const filteredColors = computed(() => {
  return colors.value.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || c.hex.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const filteredSizes = computed(() => {
  return sizes.value.filter(s =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const stats = computed(() => ({ 
    total: categories.value.length + colors.value.length + sizes.value.length, 
    parents: categories.value.filter(c => c.children.length > 0).length, 
    children: categories.value.reduce((acc, cat) => acc + cat.children.length, 0),
    inactive: categories.value.filter(c => c.status === 'inactive').length,
}));

// --- HÀM GỌI API THỰC TẾ ---

/** Hàm lấy danh sách danh mục */
const fetchCategories = async () => {
    loadingData.value = true;
    try {
        const response = await fetch(CATEGORY_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawData = await response.json();
        categories.value = buildCategoryTree(rawData); 
    } catch (error) {
        console.error("Lỗi khi tải danh mục (API):", error);
    } finally {
        loadingData.value = false;
    }
};

/** Hàm lấy danh sách màu sắc */
const fetchColors = async () => {
    try {
        const response = await fetch(COLOR_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawData = await response.json();
        colors.value = rawData; 
    } catch (error) {
        console.error("Lỗi khi tải màu sắc (API):", error);
    }
};

/** Hàm lấy danh sách kích cỡ */
const fetchSizes = async () => {
    try {
        const response = await fetch(SIZE_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawData = await response.json();
        sizes.value = rawData; 
    } catch (error) {
        console.error("Lỗi khi tải kích cỡ (API):", error);
        Swal.fire('Lỗi', 'Không thể tải danh sách kích cỡ từ server.', 'error');
    }
};


/** Hàm API DELETE cho Danh mục */
const deleteCategoryApi = async (id) => {
    const response = await fetch(`${CATEGORY_API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Lỗi Server (Status: ${response.status})`);
    return { success: true };
};

/** Hàm API DELETE cho Màu sắc */
const deleteColorApi = async (id) => {
    const response = await fetch(`${COLOR_API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Lỗi Server (Status: ${response.status})`);
    return { success: true };
};

/**
 * Hàm API DELETE cho Kích cỡ
 */
const deleteSizeApi = async (id) => {
    const response = await fetch(`${SIZE_API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Lỗi Server (Status: ${response.status})`);
    return { success: true };
};


/** * Hàm API PUT cho Danh mục 
 * ĐÃ SỬA LỖI 404: Đảm bảo itemId được chuẩn hóa và tồn tại
 */
const updateCategoryApi = async (data) => {
    
    // BẮT LỖI 404: Đảm bảo ID hợp lệ (không null/undefined) và chuẩn hóa
    if (!data.id) {
        // Lỗi nghiêm trọng, không nên xảy ra nếu openModal hoạt động đúng
        throw new Error("ID danh mục không hợp lệ để cập nhật.");
    }
    
    // LUÔN CHUẨN HÓA ID THÀNH CHUỖI ĐỂ TẠO URL PUT
    const itemId = String(data.id);
    
    // Chuẩn hóa parentId sang chuỗi (nếu không null)
    const normalizedParentId = data.parentId !== null ? String(data.parentId) : null;


    // Chỉ trích xuất các trường cần thiết (dạng phẳng) để gửi lên API
    const dataToSend = {
        id: itemId, // Gửi ID chuẩn hóa (String)
        name: data.name,
        status: data.status,
        slug: data.slug || undefined,
        description: data.description || "",
        parentId: normalizedParentId, // Gửi parentId chuẩn hóa
    };

    // SỬA URL: Dùng ID đã được chuẩn hóa (itemId)
    const response = await fetch(`${CATEGORY_API_URL}/${itemId}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Thêm log URL để kiểm tra khi debug
        console.error("PUT URL thất bại:", `${CATEGORY_API_URL}/${itemId}`); 
        throw new Error(`Lỗi Server (Status: ${response.status}): ${errorData.message || 'Không thể cập nhật danh mục'}`);
    }
    return { success: true, data: await response.json() };
};

/** Hàm API POST cho Màu sắc */
const createColorApi = async (data) => {
    const response = await fetch(COLOR_API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, hex: data.hex }),
    });
    if (!response.ok) throw new Error(`Lỗi Server (Status: ${response.status})`);
    return { success: true, data: await response.json() };
};

/** Hàm API PUT cho Màu sắc */
const updateColorApi = async (data) => { 
    const response = await fetch(`${COLOR_API_URL}/${data.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, hex: data.hex }),
    });
    if (!response.ok) throw new Error(`Lỗi Server (Status: ${response.status})`);
    return { success: true, data: await response.json() };
};

/**
 * Hàm API POST cho Kích cỡ
 */
const createSizeApi = async (data) => {
    // Thêm validation code
    if (!data.code || !data.code.trim()) {
        throw new Error("Mã kích cỡ không được để trống.");
    }
    const response = await fetch(SIZE_API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, code: data.code }),
    });
    if (!response.ok) throw new Error(`Lỗi Server (Status: ${response.status})`);
    return { success: true, data: await response.json() };
};

/**
 * Hàm API PUT cho Kích cỡ
 */
const updateSizeApi = async (data) => { 
    // Thêm validation code
    if (!data.code || !data.code.trim()) {
        throw new Error("Mã kích cỡ không được để trống.");
    }
    const response = await fetch(`${SIZE_API_URL}/${data.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.name, code: data.code }),
    });
    if (!response.ok) throw new Error(`Lỗi Server (Status: ${response.status})`);
    return { success: true, data: await response.json() };
};


// --- ACTIONS ---
const setFilter = (val) => currentStatus.value = val;
const toggleCategory = (cat) => cat.isOpen = !cat.isOpen;
const toggleStatus = (item) => item.status = item.status === 'active' ? 'inactive' : 'active'; 
const expandAll = () => categories.value.forEach(c => c.isOpen = true);

// MODAL ACTIONS
const openModal = (item = null) => {
  isEditMode.value = !!item;
  
  // RESET FORM DATA TRƯỚC
  formData.id = null;
  formData.name = '';
  formData.slug = '';
  formData.hex = '#000000';
  formData.code = '';
  formData.status = 'active';
  formData.parentId = null; 
  formData.description = ''; 

  if (item) {
    // KHI MỞ MODAL: LUÔN CHUẨN HÓA ID CỦA ITEM ĐỂ ĐẢM BẢO KHÔNG BỊ UNDEFINED/NULL
    formData.id = item.id !== null && item.id !== undefined ? String(item.id) : null;
    formData.name = item.name;
    
    // Gán dữ liệu cho form tùy theo tab
    if (activeManagerTab.value === 'category') {
        formData.slug = item.slug || '';
        formData.status = item.status || 'active';
        // Lấy parentId và description từ item để gửi lại trong PUT request
        formData.parentId = item.parentId || null; 
        formData.description = item.description || ''; 
    } else if (activeManagerTab.value === 'color') {
        formData.hex = item.hex; 
    } else if (activeManagerTab.value === 'size') {
        formData.code = item.code; 
    }
  }
  showModal.value = true;
};

const closeModal = () => showModal.value = false;

/**
 * Hàm xử lý lưu data: Thêm mới (POST) hoặc Cập nhật (PUT)
 * DÒNG 632: Gọi await updateCategoryApi(payload);
 */
const saveData = async () => {
    
    // 1. KIỂM TRA VALIDATION CHUNG
    if (!formData.name.trim()) {
        return Swal.fire('Lỗi', `Tên ${getTabName.value} không được để trống.`, 'error');
    }
    // Kiểm tra validation code cho Kích cỡ ngay trong hàm saveData
    if (activeManagerTab.value === 'size' && !formData.code.trim()) {
        return Swal.fire('Lỗi', `Mã kích cỡ không được để trống.`, 'error');
    }
    
    loadingData.value = true;
    
    try {
        if (activeManagerTab.value === 'category') {
            if (isEditMode.value) {
                
                // KIỂM TRA QUAN TRỌNG: Đảm bảo ID tồn tại trước khi tạo payload
                if (!formData.id) {
                    throw new Error("Không thể cập nhật. ID danh mục bị thiếu.");
                }

                // CHUẨN HÓA LOGIC CHỈ GỬI CÁC TRƯỜNG CẦN THIẾT
                const payload = { 
                    id: formData.id, // Đã là String từ openModal
                    name: formData.name, 
                    status: formData.status, 
                    slug: formData.slug,
                    parentId: formData.parentId, 
                    description: formData.description, 
                };
                
                // DÒNG 632: CALL API PUT
                await updateCategoryApi(payload);
                
                Swal.fire('Thành công!', 'Cập nhật danh mục thành công.', 'success');
                await fetchCategories(); 
            }
        } else if (activeManagerTab.value === 'color') {
            const payload = { id: formData.id, name: formData.name, hex: formData.hex };
            if (isEditMode.value) {
                await updateColorApi(payload);
                Swal.fire('Thành công!', 'Đã cập nhật màu sắc thành công.', 'success');
            } else {
                await createColorApi(payload);
                Swal.fire('Thành công!', 'Đã thêm màu sắc mới thành công.', 'success');
            }
            await fetchColors(); 
        } else if (activeManagerTab.value === 'size') {
            // --- XỬ LÝ KÍCH CỠ (SIZE) ---
            const payload = { id: formData.id, name: formData.name, code: formData.code };
            
            if (isEditMode.value) {
                // UPDATE (PUT)
                await updateSizeApi(payload);
                Swal.fire('Thành công!', 'Đã cập nhật kích cỡ thành công.', 'success');
            } else {
                // CREATE (POST)
                await createSizeApi(payload);
                Swal.fire('Thành công!', 'Đã thêm kích cỡ mới thành công.', 'success');
            }
            // Sau khi thêm/sửa, load lại danh sách kích cỡ để cập nhật giao diện
            await fetchSizes(); 
        }
        
        closeModal();

    } catch (error) {
        console.error(`Lỗi ${isEditMode.value ? 'cập nhật' : 'thêm mới'} :`, error);
        // Cập nhật thông báo lỗi để bao gồm lỗi validation code nếu có
        Swal.fire('Lỗi!', error.message.includes('Mã kích cỡ') ? error.message : (error.message || 'Lỗi hệ thống khi lưu dữ liệu.'), 'error');
    } finally {
        loadingData.value = false;
    }
};

/**
 * Xử lý sự kiện xóa item (danh mục, màu sắc, kích cỡ)
 */
const deleteItem = async (id) => {
    // 1. Logic xóa danh mục
    if (activeManagerTab.value === 'category') {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?', text: "Danh mục này sẽ bị xóa vĩnh viễn!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Đồng ý, xóa nó!', cancelButtonText: 'Hủy bỏ'
        });

        if (result.isConfirmed) {
            loadingData.value = true;
            try {
                await deleteCategoryApi(id);
                await fetchCategories(); 
                Swal.fire('Đã xóa!', 'Danh mục đã được xóa thành công.', 'success');
            } catch (error) {
                console.error('Lỗi xóa danh mục:', error);
                Swal.fire('Lỗi!', error.message || 'Không thể xóa danh mục do lỗi hệ thống.', 'error');
            } finally { loadingData.value = false; }
        }
    } else if (activeManagerTab.value === 'color') {
        // 2. Logic xóa màu sắc
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?', text: "Màu sắc này sẽ bị xóa vĩnh viễn!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Đồng ý, xóa nó!', cancelButtonText: 'Hủy bỏ'
        });
        
        if (result.isConfirmed) {
            loadingData.value = true;
            try {
                await deleteColorApi(id);
                await fetchColors();
                Swal.fire('Đã xóa!', 'Màu sắc đã được xóa thành công.', 'success');
            } catch (error) {
                console.error('Lỗi xóa màu sắc:', error);
                Swal.fire('Lỗi!', error.message || 'Không thể xóa màu sắc do lỗi hệ thống.', 'error');
            } finally { loadingData.value = false; }
        }
    } else if (activeManagerTab.value === 'size') {
        // 3. Logic xóa kích cỡ (SIZE)
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?', text: "Kích cỡ này sẽ bị xóa vĩnh viễn!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Đồng ý, xóa nó!', cancelButtonText: 'Hủy bỏ'
        });
        
        if (result.isConfirmed) {
            loadingData.value = true;
            try {
                await deleteSizeApi(id); // Gọi hàm xóa API
                await fetchSizes(); // Tải lại danh sách
                Swal.fire('Đã xóa!', 'Kích cỡ đã được xóa thành công.', 'success');
            } catch (error) {
                console.error('Lỗi xóa kích cỡ:', error);
                Swal.fire('Lỗi!', error.message || 'Không thể xóa kích cỡ do lỗi hệ thống.', 'error');
            } finally { loadingData.value = false; }
        }
    }
};

// --- LIFECYCLE HOOK ---
onMounted(() => {
    fetchCategories(); 
    fetchColors(); 
    fetchSizes(); 
});

// WATCHER: Chỉ hiển thị loadingData khi tab active trùng với tab đang fetch (Tùy chọn)
watch(activeManagerTab, (newTab) => {
    // Tải dữ liệu khi chuyển tab nếu dữ liệu chưa có
    if (newTab === 'category' && !categories.value.length) {
        fetchCategories();
    } else if (newTab === 'color' && !colors.value.length) {
        fetchColors();
    } else if (newTab === 'size' && !sizes.value.length) {
        fetchSizes();
    }
});
</script>
<style scoped>
/* Reuse existing styles */
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, sans-serif;
  color: #374151;
  font-size: 13px;
}

.status-group-modal {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.status-group-modal .status-item input {
    display: none;
}

.status-group-modal .status-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #4b5563;
    transition: 0.2s;
}

.status-group-modal .status-item input:checked+.status-box {
    border-color: #2563eb;
    background: #eff6ff;
    color: #2563eb;
}
/* ... */
/* Biểu tượng loading/spinner cho Bootstrap Icons */
.animate-spin {
    animation: spin 1s linear infinite;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}

.dashboard-header {
  margin-bottom: 20px;
}

.status-group-modal {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.status-group-modal .status-item input {
    display: none;
}

.status-group-modal .status-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #4b5563;
    transition: 0.2s;
}

.status-group-modal .status-item input:checked+.status-box {
    border-color: #2563eb;
    background: #eff6ff;
    color: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 15px;
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

/* --- MANAGER TABS (NEW) --- */
.manager-tabs {
  display: flex;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.manager-tab-btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.manager-tab-btn:hover {
  background: #f9fafb;
  color: #374151;
}

.manager-tab-btn.active {
  background: #2563eb;
  color: white;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.manager-tab-btn i {
  margin-right: 6px;
}

/* Filters & Toolbar */
.status-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.toolbar-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.right-actions {
  display: flex;
  gap: 10px;
}

.search-box {
  position: relative;
  width: 250px;
}

.search-box input {
  width: 100%;
  padding: 8px 10px 8px 30px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
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
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-outline-custom {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Table Styles */
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
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  font-size: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 12px 15px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.row-parent:hover td {
  background-color: #f9fafb;
}

.fw-bold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #9ca3af;
}

.text-red {
  color: #ef4444;
}

.text-blue {
  color: #2563eb;
}

.count-pill {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 4px;
}

/* Tree Styles */
.tree-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tree-toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.tree-cell.child {
  padding-left: 32px;
  position: relative;
}

.tree-connector {
  position: absolute;
  left: 12px;
  top: -15px;
  bottom: 50%;
  width: 15px;
  border-left: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  border-bottom-left-radius: 8px;
}

/* Status Toggle */
.status-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  width: fit-content;
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

/* COLOR & SIZE SPECIFIC */
.color-preview-box {
  width: 60px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.font-monospace {
  font-family: monospace;
}

.badge-code {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

/* --- MODAL STYLES (NEW) --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 450px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
}

.modal-body {
  padding: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 13px;
  color: #374151;
}

.mt-2 {
  margin-top: 15px;
}

.form-input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
}

.color-picker-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input {
  width: 50px;
  height: 40px;
  padding: 0;
  border: none;
  cursor: pointer;
  background: none;
}

.modal-footer {
  padding: 15px 20px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e5e7eb;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #9ca3af;
  font-style: italic;
}
</style>