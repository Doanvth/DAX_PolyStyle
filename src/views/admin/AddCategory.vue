<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Thêm Danh Mục Mới</h4>
      <button @click="goBack" class="btn btn-secondary-custom">
        <i class="bi bi-arrow-left"></i> Quay lại
      </button>
    </div>

    <div class="tabs-container">
      <div 
        class="tab-item" 
        :class="{ 'active': activeTab === 'root' }" 
        @click="switchTab('root')"
      >
        <i class="bi bi-folder-plus"></i> Tạo Danh Mục Gốc
      </div>
      <div 
        class="tab-item" 
        :class="{ 'active': activeTab === 'child' }" 
        @click="switchTab('child')"
      >
        <i class="bi bi-diagram-3"></i> Tạo Danh Mục Con
      </div>
    </div>

    <div class="form-wrapper shadow-sm">
      <form @submit.prevent="handleSubmit">
        
        <div class="alert-info-custom mb-4">
          <i class="bi" :class="activeTab === 'root' ? 'bi-info-circle-fill' : 'bi-lightbulb-fill'"></i>
          <span v-if="activeTab === 'root'">
            Tạo danh mục (Ví dụ: Thời trang nam, Thời trang nữ).
          </span>
          <span v-else>
            Tạo danh mục nằm trong các danh mục gốc đã có.
          </span>
        </div>

        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="catName" class="form-label">Tên Danh Mục <span class="text-danger">*</span></label>
              <input 
                type="text" 
                id="catName" 
                v-model="formData.name" 
                class="form-control-custom" 
                placeholder="Nhập tên danh mục..." 
                required
              >
            </div>
          </div>

          <div class="form-col" v-if="activeTab === 'child'">
            <div class="form-group">
              <label for="parentId" class="form-label">Thuộc Danh Mục Gốc <span class="text-danger">*</span></label>
              <select 
                id="parentId" 
                v-model="formData.parentId" 
                class="form-control-custom form-select-custom"
                required
              >
                <option :value="null" disabled>-- Chọn danh mục--</option>
                
                <option 
                  v-for="cat in parentCategories" 
                  :key="cat.id" 
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>

              </select>
              <small class="text-muted mt-1 d-block" v-if="loading">
                <i class="spinner-border spinner-border-sm"></i> Đang tải danh mục...
              </small>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="catDesc" class="form-label">Mô tả</label>
          <textarea 
            id="catDesc" 
            v-model="formData.description" 
            class="form-control-custom" 
            rows="3" 
            placeholder="Nhập mô tả..."
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-col">
            <label class="form-label">Trạng Thái</label>
            <div class="status-toggle">
              <label class="radio-label">
                <input type="radio" v-model="formData.status" value="active">
                <span class="radio-custom"></span>
                Hiển thị
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.status" value="inactive">
                <span class="radio-custom"></span>
                Ẩn
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions-footer">
          <button type="button" @click="handleReset" class="btn btn-outline">Nhập lại</button>
          <button type="submit" class="btn btn-update">
            <i class="bi bi-save"></i> Lưu Dữ Liệu
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/categories'; 

const activeTab = ref('root');
const parentCategories = ref([]); 
const loading = ref(false);

const formData = reactive({
  name: '',
  parentId: null,
  description: '',
  status: 'active'
});

const fetchParentCategories = async () => {
  loading.value = true;
  try {
    const response = await axios.get(API_URL);
    

    if (response.data && Array.isArray(response.data)) {
        parentCategories.value = response.data;
    } else if (response.data && response.data.categories) {
        parentCategories.value = response.data.categories;
    } else {
        parentCategories.value = [];
    }

    console.log("Danh sách danh mục cha:", parentCategories.value);

  } catch (error) {
    console.error("Lỗi kết nối Database:", error);
    alert("Không thể tải danh sách danh mục. Kiểm tra kết nối mạng hoặc server!");
  } finally {
    loading.value = false;
  }
};

const switchTab = (tabName) => {
  activeTab.value = tabName;
  handleReset();
  
  if (tabName === 'child') {
    fetchParentCategories(); 
  }
};

const goBack = () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/'; 
    }
};

const handleReset = () => {
  formData.name = '';
  formData.parentId = null;
  formData.description = '';
  formData.status = 'active';
};

const handleSubmit = async () => {
  if (!formData.name.trim()) {
    alert("Vui lòng nhập tên danh mục!");
    return;
  }
  if (activeTab.value === 'child' && !formData.parentId) {
    alert("Vui lòng chọn danh mục gốc!");
    return;
  }

  const payload = {
    name: formData.name,
    description: formData.description,
    status: formData.status,
    parentId: activeTab.value === 'root' ? null : formData.parentId
  };

  try {
    const res = await axios.post(API_URL, payload);

    if (res.status === 200 || res.status === 201) {
        alert("Thêm danh mục thành công!");
        handleReset(); 
        
        if (activeTab.value === 'child' || activeTab.value === 'root') {
            fetchParentCategories();
        }
    }
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    const msg = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
    alert(msg);
  }
};

onMounted(() => {
  fetchParentCategories();
});
</script>

<style scoped>
.product-management-container { padding: 30px; font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
.header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.header-actions h4 { color: #111827; font-size: 1.5rem; }

.tabs-container { display: flex;  margin: 0 auto; padding-left: 10px; }
.tab-item {
  padding: 12px 24px; cursor: pointer; font-weight: 600; color: #6b7280; background-color: #e5e7eb;
  border-top-left-radius: 12px; border-top-right-radius: 12px; margin-right: 5px; transition: all 0.2s;
  display: flex; align-items: center; gap: 8px;
}
.tab-item.active { background-color: #fff; color: #4f46e5; box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.02); z-index: 1; }

.form-wrapper { background-color: #fff; border-radius: 16px; border-top-left-radius: 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); padding: 30px; margin: 0 auto; }
.alert-info-custom { background-color: #eff6ff; border-left: 4px solid #3b82f6; color: #1e40af; padding: 12px 16px; border-radius: 4px; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; }

.form-row { display: flex; gap: 30px; margin-bottom: 20px; }
.form-col { flex: 1; }
.form-group { margin-bottom: 20px; }
.form-label { display: block; margin-bottom: 8px; font-weight: 500; color: #374151; }
.form-control-custom { width: 100%; padding: 10px 15px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; }
.form-control-custom:focus { border-color: #4f46e5; outline: none; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
.form-select-custom { background-color: white; } 

.btn { padding: 10px 20px; border-radius: 10px; cursor: pointer; border: none; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; }
.btn-update { background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color: white; }
.btn-secondary-custom { background: white; border: 1px solid #e5e7eb; color: #374151; }
.btn-outline { background: transparent; border: 1px solid #d1d5db; color: #6b7280; margin-right: 15px; }

.status-toggle { display: flex; gap: 20px; align-items: center; height: 42px; }
.radio-label { display: flex; align-items: center; cursor: pointer; color: #4b5563; }
.radio-label input { display: none; }
.radio-custom { width: 18px; height: 18px; border: 2px solid #d1d5db; border-radius: 50%; margin-right: 8px; position: relative; }
.radio-label input:checked + .radio-custom { border-color: #4f46e5; }
.radio-label input:checked + .radio-custom::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background-color: #4f46e5; border-radius: 50%; }
.form-actions-footer { display: flex; justify-content: flex-end; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px; }
.text-danger { color: #dc2626; }

@media (max-width: 768px) { .form-row { flex-direction: column; gap: 15px; } }
</style>