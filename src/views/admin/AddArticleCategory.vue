<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.go(-1)">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">{{ isEditMode ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới' }}</h2>
          <p class="text-muted">Quản lý chuyên mục tin tức</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="$router.go(-1)">Hủy bỏ</button>
        <button class="btn-primary-custom" @click="save">
          <i class="bi bi-check2-circle"></i> Lưu lại
        </button>
      </div>
    </div>

    <div class="form-layout">
      <div class="col-left">
        <div class="card-box">
          <div class="form-group">
            <label class="form-label">Tên danh mục <span class="text-red">*</span></label>
            <input type="text" v-model="form.name" class="form-input" placeholder="Ví dụ: Xu hướng thời trang..." />
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="card-box">
          <h4 class="card-title">Trạng thái</h4>
          <div class="status-selection">
            <label class="status-option" :class="{ active: form.status === 'active' }">
              <input type="radio" v-model="form.status" value="active" hidden>
              <span class="dot success"></span>
              <span>Hiển thị</span>
              <i class="bi bi-check-lg ms-auto" v-if="form.status === 'active'"></i>
            </label>
            <label class="status-option" :class="{ active: form.status === 'inactive' }">
              <input type="radio" v-model="form.status" value="inactive" hidden>
              <span class="dot danger"></span>
              <span>Ẩn</span>
              <i class="bi bi-check-lg ms-auto" v-if="form.status === 'inactive'"></i>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => !!route.query.id);

const form = ref({
  name: '',
  status: 'active'
});

onMounted(() => {
  if (isEditMode.value) {
    console.log("Đang sửa danh mục bài viết (Mô phỏng)");
    form.value.name = "Tin tức Khuyến Mại (Sửa)";
  }
});

const save = () => {
  if (!form.value.name) return alert("Vui lòng nhập tên danh mục!");
  
  alert(isEditMode.value ? "Đã cập nhật danh mục!" : "Đã thêm danh mục mới!");
  router.push({ name: 'article-category' });
};
</script>

<style scoped>
.admin-container { padding: 20px; background: #f3f4f6; min-height: 100vh; font-family: -apple-system, sans-serif; color: #374151; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.header-left { display: flex; align-items: center; gap: 15px; }

.header-right { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.btn-back { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e5e7eb; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #6b7280; transition: 0.2s; }
.btn-back:hover { background: #f9fafb; color: #111; }
.page-title { margin: 0; font-size: 24px; font-weight: 700; color: #111; }
.text-muted { color: #9ca3af; font-size: 13px; margin: 2px 0 0 0; }

.btn-primary-custom { background: #2563eb; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-primary-custom:hover { background: #1d4ed8; }
.btn-outline-custom { background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-outline-custom:hover { background: #f9fafb; border-color: #9ca3af; }

.form-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; }
.card-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.card-title { margin: 0 0 15px 0; font-size: 16px; font-weight: 700; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 6px; }
.text-red { color: #ef4444; }
.form-input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; }
.form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

.status-selection { display: flex; flex-direction: column; gap: 8px; }
.status-option { display: flex; align-items: center; gap: 10px; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 14px; font-weight: 500; }
.status-option:hover { background: #f9fafb; }
.status-option.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.success { background-color: #10b981; }
.dot.danger { background-color: #ef4444; }
.ms-auto { margin-left: auto; }
</style>