<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">Thêm Danh Mục Mới</h2>
          <p class="text-muted">Quản lý phân cấp và tổ chức sản phẩm</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="handleReset">Làm mới</button>
        <button class="btn-primary-custom" @click="handleSubmit">
          <i class="bi bi-check2-circle"></i> Lưu Danh Mục
        </button>
      </div>
    </div>

    <div class="form-layout">

      <div class="col-left">
        <div class="card-box">
          <h4 class="card-title">Thông tin chi tiết</h4>

          <div class="info-alert mb-4">
            <i class="bi" :class="activeTab === 'root' ? 'bi-info-circle-fill' : 'bi-diagram-3-fill'"></i>
            <div class="info-content">
              <span class="fw-600">{{ activeTab === 'root' ? 'Đang tạo Danh mục gốc' : 'Đang tạo Danh mục con' }}</span>
      
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Tên danh mục <span class="text-red">*</span></label>
            <input type="text" v-model="formData.name" class="form-input" placeholder="Ví dụ: Áo phông,..." />
          </div>

          <transition name="fade">
            <div class="form-group" v-if="activeTab === 'child'">
              <label class="form-label">Thuộc danh mục <span class="text-red">*</span></label>
              <div class="select-wrapper">
                <select v-model="formData.parentId" class="form-input">
                  <option :value="null" disabled>-- Chọn danh mục --</option>
                  <option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <small v-if="loading" class="input-helper text-blue">
                  <i class="spinner-border spinner-border-sm"></i> Đang tải dữ liệu...
                </small>
              </div>
            </div>
          </transition>

          <div class="form-group">
            <label class="form-label">Mô tả (Tùy chọn)</label>
            <textarea v-model="formData.description" class="form-textarea" rows="4"
              placeholder="Nhập mô tả chi tiết cho danh mục này..."></textarea>
          </div>

        </div>
      </div>

      <div class="col-right">

        <div class="card-box">
          <h4 class="card-title">Phân loại</h4>

          <div class="type-selection-group">
            <div class="type-option" :class="{ active: activeTab === 'root' }" @click="switchTab('root')">
              <div class="radio-circle"></div>
              <div class="type-info">
                <span class="type-title">Danh mục</span>
              </div>
            </div>

            <div class="type-option" :class="{ active: activeTab === 'child' }" @click="switchTab('child')">
              <div class="radio-circle"></div>
              <div class="type-info">
                <span class="type-title">Danh mục con</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="card-box mt-4">
          <h4 class="card-title">Trạng thái hiển thị</h4>

          <div class="status-group">
            <label class="status-item">
              <input type="radio" v-model="formData.status" value="active" name="status">
              <span class="status-box">
                <i class="bi bi-eye"></i> Hiển thị
              </span>
            </label>
            <label class="status-item">
              <input type="radio" v-model="formData.status" value="inactive" name="status">
              <span class="status-box">
                <i class="bi bi-eye-slash"></i> Ẩn
              </span>
            </label>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

const activeTab = ref('root');
const parentCategories = ref([]);
const loading = ref(false);

const formData = reactive({
  name: '',
  parentId: null,
  description: '',
  status: 'active'
});


const mockParentData = [
  { id: 1, name: 'Thời trang Nam' },
  { id: 2, name: 'Thời trang Nữ' },
  { id: 3, name: 'Phụ kiện' },
  { id: 4, name: 'Giày dép' }
];

const fetchParentCategories = async () => {
  loading.value = true;
  try {
    setTimeout(() => {
      parentCategories.value = mockParentData;
      loading.value = false;
    }, 500);

  } catch (error) {
    console.error("Lỗi kết nối:", error);
    alert("Không thể tải danh sách danh mục.");
    loading.value = false;
  }
};

const switchTab = (tabName) => {
  activeTab.value = tabName;
  if (tabName === 'root') {
    formData.parentId = null;
  } else {
    fetchParentCategories();
  }
};

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    console.log("Go back home");
  }
};

const handleReset = () => {
  formData.name = '';
  formData.parentId = null;
  formData.description = '';
  formData.status = 'active';
  activeTab.value = 'root';
};

const handleSubmit = async () => {
  if (!formData.name.trim()) {
    return alert("Vui lòng nhập tên danh mục!");
  }
  if (activeTab.value === 'child' && !formData.parentId) {
    return alert("Vui lòng chọn danh mục gốc!");
  }

  const payload = {
    ...formData,
    parentId: activeTab.value === 'root' ? null : formData.parentId
  };

  alert("Thêm danh mục thành công");
};


</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
}


.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-back {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #6b7280;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f9fafb;
  color: #111;
  transform: translateX(-2px);
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #111;
}

.text-muted {
  color: #9ca3af;
  font-size: 13px;
  margin: 2px 0 0 0;
}

.header-right {
  display: flex;
  gap: 10px;
}


.btn-primary-custom {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2);
}

.btn-primary-custom:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-outline-custom {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline-custom:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}


.form-layout {
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 25px;
}

@media (max-width: 1024px) {
  .form-layout {
    grid-template-columns: 1fr;
  }
}

.card-box {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.card-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 15px;
}

.mt-4 {
  margin-top: 25px;
}


.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 6px;
}

.text-red {
  color: #ef4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111;
  outline: none;
  transition: all 0.2s;
  background: #fff;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-helper {
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.text-blue {
  color: #2563eb;
}

.type-selection-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-option {
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s;
  background: #fff;
}

.type-option:hover {
  border-color: #2563eb;
  background: #f8fafc;
}

.type-option.active {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.type-option.active .radio-circle {
  border-width: 5px;
  border-color: #2563eb;
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  margin-top: 2px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.type-info {
  display: flex;
  flex-direction: column;
}

.type-title {
  font-weight: 600;
  font-size: 14px;
  color: #111;
}

.type-desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.info-alert {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-alert i {
  color: #2563eb;
  font-size: 18px;
  margin-top: 2px;
}

.info-content {
  font-size: 13px;
  color: #1e40af;
}

.fw-600 {
  font-weight: 600;
  display: block;
  margin-bottom: 2px;
}

.text-sm-muted {
  font-size: 13px;
  color: #64748b;
}

.status-group {
  display: flex;
  gap: 10px;
}

.status-item input {
  display: none;
}

.status-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  transition: 0.2s;
}

.status-item input:checked+.status-box {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.status-box i {
  font-size: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>