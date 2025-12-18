<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">Xóa Cửa Hàng</h2>
          <p class="text-muted">Xác nhận xóa cửa hàng</p>
        </div>
      </div>
    </div>

    <div class="card-box">
      <div class="text-center">
        <i class="bi bi-exclamation-triangle text-danger" style="font-size: 64px;"></i>
        <h3 class="mt-3">Xác nhận xóa cửa hàng</h3>
        <p class="text-muted">Bạn có chắc chắn muốn xóa cửa hàng này?</p>
        
        <div v-if="store" class="store-info mt-4">
          <p><strong>Tên:</strong> {{ store.name }}</p>
          <p><strong>Địa chỉ:</strong> {{ store.address }}</p>
          <p><strong>Email:</strong> {{ store.email }}</p>
          <p><strong>Trạng thái:</strong> {{ store.status === 'active' ? 'Đang hoạt động' : 'Đóng cửa' }}</p>
        </div>

        <div class="mt-5">
          <button class="btn-outline-custom me-3" @click="goBack">Hủy bỏ</button>
          <button class="btn-danger-custom" @click="confirmDelete">
            <i class="bi bi-trash"></i> Xóa Cửa Hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const storeId = route.params.id; // Giữ nguyên string
const store = ref(null);

// Lấy dữ liệu cửa hàng
const loadStore = () => {
  const savedStores = localStorage.getItem('orchid_stores');
  if (savedStores) {
    const stores = JSON.parse(savedStores);
    // So sánh với string, không parse
    const foundStore = stores.find(s => s.id == storeId); // Dùng == thay vì ===
    
    if (foundStore) {
      store.value = foundStore;
      
      // Kiểm tra nếu là trụ sở chính
      if (foundStore.isMain) {
        alert('Không thể xóa trụ sở chính!');
        goBack();
      }
    } else {
      alert('Không tìm thấy cửa hàng!');
      goBack();
    }
  }
};

const confirmDelete = () => {
  const savedStores = localStorage.getItem('orchid_stores');
  if (savedStores) {
    const stores = JSON.parse(savedStores);
    const updatedStores = stores.filter(s => s.id != storeId); // So sánh string
    
    localStorage.setItem('orchid_stores', JSON.stringify(updatedStores));
    alert('Xóa cửa hàng thành công!');
    goBack();
  }
};

const goBack = () => {
  router.push({ name: 'store' });
};

onMounted(() => {
  loadStore();
});
</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
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

.card-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.02);
}

.text-danger {
  color: #ef4444;
}

.btn-danger-custom {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-danger-custom:hover {
  background: #dc2626;
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

.store-info {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mt-5 {
  margin-top: 3rem;
}

.me-3 {
  margin-right: 1rem;
}
</style>