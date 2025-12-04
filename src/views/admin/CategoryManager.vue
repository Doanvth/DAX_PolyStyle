<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <!-- 1. MANAGEMENT TABS (NEW) -->
      <div class="manager-tabs">
        <button 
          v-for="tab in managerTabs" 
          :key="tab.id"
          class="manager-tab-btn"
          :class="{ active: activeManagerTab === tab.id }"
          @click="activeManagerTab = tab.id"
        >
          <i :class="tab.icon"></i> {{ tab.label }}
        </button>
      </div>

      <!-- Stats Grid (Chỉ hiện khi ở tab Danh mục hoặc tổng quan chung) -->
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

    <!-- TOOLBAR -->
    <div class="toolbar-top">
      <div class="left-actions">
        <!-- Filter Tabs (Chỉ cho Category) -->
        <div class="status-tabs" v-if="activeManagerTab === 'category'">
            <button 
                v-for="tab in filterTabs" :key="tab.value" 
                class="tab-btn" :class="{ active: currentStatus === tab.value }"
                @click="setFilter(tab.value)"
            >
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
        <button class="btn-primary-custom" @click="openModal()">
          <i class="bi bi-plus-lg"></i> Thêm {{ getTabName }}
        </button>
      </div>
    </div>

    <!-- TABLE CONTAINER -->
    <div class="table-container">
      
      <!-- 2. TABLE: CATEGORIES (Existing) -->
      <table v-if="activeManagerTab === 'category'">
        <thead>
          <tr>
            <th width="50%">Tên Danh Mục</th>
            <th width="15%">ID</th>
            <!-- Đã bỏ cột Sản phẩm -->
            <th width="15%">Trạng Thái</th>
            <th width="20%" class="text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="category in filteredCategories" :key="category.id">
            <tr class="row-parent" :class="{ 'expanded': category.isOpen }">
              <td>
                <div class="tree-cell">
                   <button class="tree-toggle" @click="toggleCategory(category)" v-if="category.children && category.children.length">
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
              <!-- Đã bỏ td count -->
              <td>
                <div class="status-toggle" @click="toggleStatus(category)">
                    <span class="dot" :class="category.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                    {{ category.status === 'active' ? 'Hiển thị' : 'Ẩn' }}
                </div>
              </td>
              <td class="text-center">
                <button class="btn-icon" title="Sửa" @click="openModal(category)"><i class="bi bi-pencil-square text-blue"></i></button>
                <button class="btn-icon" title="Xóa" @click="deleteItem(category.id)"><i class="bi bi-trash text-red"></i></button>
              </td>
            </tr>
            <!-- Children rendering -->
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
                <!-- Đã bỏ td count child -->
                <td>
                    <div class="status-toggle" @click="toggleStatus(child)">
                        <span class="dot" :class="child.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                        {{ child.status === 'active' ? 'Hiển thị' : 'Ẩn' }}
                    </div>
                </td>
                <td class="text-center">
                    <button class="btn-icon" title="Sửa" @click="openModal(child)"><i class="bi bi-pencil text-muted"></i></button>
                    <button class="btn-icon" title="Xóa" @click="deleteItem(child.id)"><i class="bi bi-trash text-muted"></i></button>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>

      <!-- 3. TABLE: COLORS (New) -->
      <table v-else-if="activeManagerTab === 'color'">
        <thead>
            <tr>
                <th width="40%">Tên Màu</th>
                <th width="25%">Mã màu (Hex)</th>
                <th width="20%">Hiển thị</th>
                <!-- Đã bỏ cột Số sản phẩm -->
                <th width="15%" class="text-center">Hành động</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="color in filteredColors" :key="color.id" class="row-parent">
                <td class="fw-bold">{{ color.name }}</td>
                <td class="font-monospace text-muted">{{ color.hex }}</td>
                <td>
                    <div class="color-preview-box" :style="{ backgroundColor: color.hex }"></div>
                </td>
                <!-- Đã bỏ td count -->
                <td class="text-center">
                    <button class="btn-icon" @click="openModal(color)"><i class="bi bi-pencil-square text-blue"></i></button>
                    <button class="btn-icon" @click="deleteItem(color.id)"><i class="bi bi-trash text-red"></i></button>
                </td>
            </tr>
             <tr v-if="filteredColors.length === 0"><td colspan="4" class="empty-state">Không tìm thấy màu sắc nào</td></tr>
        </tbody>
      </table>

      <!-- 4. TABLE: SIZES (New) -->
      <table v-else-if="activeManagerTab === 'size'">
         <thead>
            <tr>
                <th width="40%">Tên hiển thị</th>
                <th width="40%">Mã kích cỡ (Code)</th>
                <!-- Đã bỏ cột Số sản phẩm -->
                <th width="20%" class="text-center">Hành động</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="size in filteredSizes" :key="size.id" class="row-parent">
                <td class="fw-bold">{{ size.name }}</td>
                <td><span class="badge-code">{{ size.code }}</span></td>
                <!-- Đã bỏ td count -->
                <td class="text-center">
                    <button class="btn-icon" @click="openModal(size)"><i class="bi bi-pencil-square text-blue"></i></button>
                    <button class="btn-icon" @click="deleteItem(size.id)"><i class="bi bi-trash text-red"></i></button>
                </td>
            </tr>
             <tr v-if="filteredSizes.length === 0"><td colspan="3" class="empty-state">Không tìm thấy kích cỡ nào</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 5. MODAL MODEL (Popup Thêm/Sửa) -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }} {{ getTabName }}</h3>
                <button class="close-btn" @click="closeModal">&times;</button>
            </div>
            
            <div class="modal-body">
                <!-- Form cho Categories -->
                <div v-if="activeManagerTab === 'category'" class="form-group">
                    <label>Tên danh mục</label>
                    <input v-model="formData.name" type="text" class="form-input" placeholder="Nhập tên danh mục">
                    <label class="mt-2">Đường dẫn (Slug)</label>
                    <input v-model="formData.slug" type="text" class="form-input" placeholder="tu-dong-tao-tu-ten">
                </div>

                <!-- Form cho Colors -->
                <div v-if="activeManagerTab === 'color'" class="form-group">
                    <label>Tên màu</label>
                    <input v-model="formData.name" type="text" class="form-input" placeholder="Ví dụ: Đỏ đô">
                    
                    <label class="mt-2">Chọn màu</label>
                    <div class="color-picker-wrapper">
                        <input v-model="formData.hex" type="color" class="color-input">
                        <input v-model="formData.hex" type="text" class="form-input" placeholder="#000000">
                    </div>
                </div>

                <!-- Form cho Sizes -->
                <div v-if="activeManagerTab === 'size'" class="form-group">
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
import { ref, computed, reactive } from 'vue';

// --- DATA ---
// Mock Data Categories (Giữ nguyên logic cũ)
const categories = ref([
    { id: 101, name: 'Thời trang Nam', slug: 'thoi-trang-nam', status: 'active', productCount: 150, isOpen: true, children: [
        { id: 102, name: 'Áo Thun', slug: 'ao-thun-nam', status: 'active', productCount: 50 },
        { id: 103, name: 'Quần Jean', slug: 'quan-jean-nam', status: 'active', productCount: 45 }
    ]},
    { id: 201, name: 'Thời trang Nữ', slug: 'thoi-trang-nu', status: 'active', productCount: 200, isOpen: false, children: [] }
]);

// Mock Data Colors
const colors = ref([
    { id: 1, name: 'Đỏ', hex: '#FF0000', count: 12 },
    { id: 2, name: 'Xanh Dương', hex: '#0000FF', count: 8 },
    { id: 3, name: 'Đen', hex: '#000000', count: 50 },
    { id: 4, name: 'Trắng', hex: '#FFFFFF', count: 30 },
]);

// Mock Data Sizes
const sizes = ref([
    { id: 1, name: 'Size Nhỏ', code: 'S', count: 20 },
    { id: 2, name: 'Size Trung Bình', code: 'M', count: 45 },
    { id: 3, name: 'Size Lớn', code: 'L', count: 30 },
    { id: 4, name: 'Size Đại', code: 'XL', count: 10 },
]);

// --- STATE MANAGEMENT ---
const activeManagerTab = ref('category'); // 'category', 'color', 'size'
const searchQuery = ref("");
const currentStatus = ref("all");

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
    slug: '', // For category
    hex: '#000000', // For color
    code: '' // For size
});

// --- COMPUTED ---
const getTabName = computed(() => {
    if (activeManagerTab.value === 'category') return 'danh mục';
    if (activeManagerTab.value === 'color') return 'màu sắc';
    return 'kích cỡ';
});

// Filter Categories
const filteredCategories = computed(() => {
    // Logic filter giữ nguyên như cũ
    let result = JSON.parse(JSON.stringify(categories.value));
    return result.filter(parent => {
        const key = searchQuery.value.toLowerCase();
        const parentNameMatch = parent.name.toLowerCase().includes(key);
        return parentNameMatch; // Rút gọn cho demo
    });
});

// Filter Colors
const filteredColors = computed(() => {
    return colors.value.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Filter Sizes
const filteredSizes = computed(() => {
    return sizes.value.filter(s => 
        s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        s.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Stats Logic (Simplified)
const stats = computed(() => ({ total: 10, parents: 5, children: 5, inactive: 1 }));

// --- ACTIONS ---
const setFilter = (val) => currentStatus.value = val;
const toggleCategory = (cat) => cat.isOpen = !cat.isOpen;
const toggleStatus = (item) => item.status = item.status === 'active' ? 'inactive' : 'active';
const expandAll = () => categories.value.forEach(c => c.isOpen = true);

// MODAL ACTIONS
const openModal = (item = null) => {
    isEditMode.value = !!item;
    if (item) {
        formData.id = item.id;
        formData.name = item.name;
        // Map fields based on current tab
        if (activeManagerTab.value === 'category') formData.slug = item.slug;
        if (activeManagerTab.value === 'color') formData.hex = item.hex;
        if (activeManagerTab.value === 'size') formData.code = item.code;
    } else {
        // Reset form
        formData.id = null;
        formData.name = '';
        formData.slug = '';
        formData.hex = '#000000';
        formData.code = '';
    }
    showModal.value = true;
};

const closeModal = () => showModal.value = false;

const saveData = () => {
    // Logic lưu data giả lập
    const newItem = {
        id: formData.id || Date.now(),
        name: formData.name,
        // Các trường khác tùy tab
        ...(activeManagerTab.value === 'category' && { slug: formData.slug || formData.name.toLowerCase(), status: 'active', children: [] }),
        ...(activeManagerTab.value === 'color' && { hex: formData.hex }),
        ...(activeManagerTab.value === 'size' && { code: formData.code }),
        count: 0
    };

    if (activeManagerTab.value === 'category') {
        if (isEditMode.value) {
            // Update logic (simplified)
            const idx = categories.value.findIndex(c => c.id === formData.id);
            if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...newItem };
        } else {
            categories.value.push(newItem);
        }
    } else if (activeManagerTab.value === 'color') {
        if (isEditMode.value) {
             const idx = colors.value.findIndex(c => c.id === formData.id);
             if (idx !== -1) colors.value[idx] = newItem;
        } else {
            colors.value.push(newItem);
        }
    } else {
        if (isEditMode.value) {
             const idx = sizes.value.findIndex(c => c.id === formData.id);
             if (idx !== -1) sizes.value[idx] = newItem;
        } else {
            sizes.value.push(newItem);
        }
    }

    closeModal();
};

const deleteItem = (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    if (activeManagerTab.value === 'category') {
        categories.value = categories.value.filter(c => c.id !== id);
    } else if (activeManagerTab.value === 'color') {
        colors.value = colors.value.filter(c => c.id !== id);
    } else {
        sizes.value = sizes.value.filter(c => c.id !== id);
    }
};

</script>

<style scoped>
/* Reuse existing styles */
.admin-container { padding: 20px; min-height: 100vh; background-color: #f3f4f6; font-family: -apple-system, sans-serif; color: #374151; font-size: 13px; }
.dashboard-header { margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 15px; }
.stat-card { background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.stat-card .icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.stat-card h3 { margin: 0; font-size: 20px; font-weight: 700; }
.stat-card p { margin: 0; color: #6b7280; font-size: 12px; }
.blue .icon { background: #eff6ff; color: #3b82f6; }
.green .icon { background: #ecfdf5; color: #10b981; }
.purple .icon { background: #f3e8ff; color: #a855f7; }
.gray .icon { background: #f3f4f6; color: #6b7280; }

/* --- MANAGER TABS (NEW) --- */
.manager-tabs { display: flex; gap: 10px; background: white; padding: 10px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.manager-tab-btn {
    border: none; background: transparent; padding: 8px 16px; border-radius: 6px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.2s; font-size: 14px;
}
.manager-tab-btn:hover { background: #f9fafb; color: #374151; }
.manager-tab-btn.active { background: #2563eb; color: white; box-shadow: 0 2px 4px rgba(37,99,235,0.2); }
.manager-tab-btn i { margin-right: 6px; }

/* Filters & Toolbar */
.status-tabs { display: flex; gap: 8px; }
.tab-btn { background: white; border: 1px solid #e5e7eb; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; color: #6b7280; }
.tab-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
.toolbar-top { display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center; }
.left-actions { display: flex; gap: 15px; align-items: center; }
.right-actions { display: flex; gap: 10px; }
.search-box { position: relative; width: 250px; }
.search-box input { width: 100%; padding: 8px 10px 8px 30px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; }
.search-box i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
.btn-primary-custom { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.btn-outline-custom { background: white; border: 1px solid #d1d5db; color: #374151; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; }

/* Table Styles */
.table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th { background: #f9fafb; padding: 12px 15px; text-align: left; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
td { padding: 12px 15px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.row-parent:hover td { background-color: #f9fafb; }
.fw-bold { font-weight: 600; }
.text-center { text-align: center; }
.text-muted { color: #9ca3af; }
.text-red { color: #ef4444; }
.text-blue { color: #2563eb; }
.count-pill { background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 16px; margin: 0 4px; }

/* Tree Styles */
.tree-cell { display: flex; align-items: center; gap: 8px; }
.tree-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: 1px solid #e5e7eb; background: white; border-radius: 4px; cursor: pointer; }
.tree-cell.child { padding-left: 32px; position: relative; }
.tree-connector { position: absolute; left: 12px; top: -15px; bottom: 50%; width: 15px; border-left: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; border-bottom-left-radius: 8px; }

/* Status Toggle */
.status-toggle { cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 12px; width: fit-content; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.bg-success { background: #10b981; } 
.bg-gray { background: #9ca3af; }

/* COLOR & SIZE SPECIFIC */
.color-preview-box { width: 60px; height: 24px; border-radius: 4px; border: 1px solid #e5e7eb; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
.font-monospace { font-family: monospace; }
.badge-code { background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }

/* --- MODAL STYLES (NEW) --- */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; width: 450px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; animation: slideDown 0.2s ease-out; }
@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { padding: 15px 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #9ca3af; }
.modal-body { padding: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #374151; }
.mt-2 { margin-top: 15px; }
.form-input { padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; transition: border 0.2s; }
.form-input:focus { border-color: #2563eb; }
.color-picker-wrapper { display: flex; gap: 10px; align-items: center; }
.color-input { width: 50px; height: 40px; padding: 0; border: none; cursor: pointer; background: none; }
.modal-footer { padding: 15px 20px; background: #f9fafb; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e5e7eb; }
.empty-state { text-align: center; padding: 30px; color: #9ca3af; font-style: italic; }
</style>