<template>
  <div class="admin-container">
    <!-- HEADER ACTION -->
    <div class="page-header">
      <div class="header-left">
        <router-link :to="{ name: 'collection' }" class="btn-back">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div>
          <h2 class="page-title">Xóa Bộ Sưu Tập</h2>
          <p class="text-muted">Xác nhận xóa bộ sưu tập</p>
        </div>
      </div>
      <div class="header-right">
        <router-link :to="{ name: 'collection' }" class="btn-outline-custom">Quay lại</router-link>
      </div>
    </div>

    <!-- DELETE CONFIRMATION -->
    <div class="confirmation-container">
      <div class="confirmation-card">
        <div class="confirmation-header">
          <div class="warning-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3 class="warning-title">Xác nhận xóa</h3>
          <p class="warning-text">Bạn có chắc chắn muốn xóa bộ sưu tập này không?</p>
        </div>

        <div class="confirmation-body">
          <div class="collection-info">
            <div class="info-preview">
              <img :src="collection.image || 'https://placehold.co/100x60?text=No+Image'" alt="Collection Image" class="preview-image" />
              <div class="info-details">
                <h4 class="collection-title">{{ collection.title }}</h4>
                <p class="collection-subtitle">{{ collection.subtitle || 'Không có mô tả' }}</p>
                <div class="info-meta">
                  <span class="badge" :class="collection.status === 'active' ? 'active' : 'inactive'">
                    {{ collection.status === 'active' ? 'Hiển thị' : 'Đang ẩn' }}
                  </span>
                  <span class="text-muted">ID: #{{ collection.id }}</span>
                </div>
              </div>
            </div>

            <div class="info-stats">
              <div class="stat-item">
                <i class="bi bi-box-seam"></i>
                <span>{{ collection.productCount || 0 }} sản phẩm</span>
              </div>
              <div class="stat-item">
                <i class="bi bi-calendar"></i>
                <span>{{ collection.createAt || 'Chưa cập nhật' }}</span>
              </div>
            </div>
          </div>

          <div class="warning-message">
            <i class="bi bi-info-circle"></i>
            <p>Hành động này sẽ xóa vĩnh viễn bộ sưu tập và không thể hoàn tác.</p>
          </div>
        </div>

        <div class="confirmation-footer">
          <router-link :to="{ name: 'collection' }" class="btn-cancel">
            <i class="bi bi-x-circle"></i> Hủy bỏ
          </router-link>
          <button class="btn-delete" @click="handleDelete" :disabled="isDeleting">
            <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-trash3" v-else></i>
            {{ isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isDeleting = ref(false);
const collection = ref({});

// Load collection data by ID
const loadCollectionData = () => {
  const collectionId = parseInt(route.params.id);
  if (!collectionId) {
    alert('Không tìm thấy bộ sưu tập');
    router.push({ name: 'collection' });
    return;
  }

  const savedData = localStorage.getItem('collections');
  if (savedData) {
    const collections = JSON.parse(savedData);
    const foundCollection = collections.find(item => item.id === collectionId);
    
    if (foundCollection) {
      collection.value = { ...foundCollection };
    } else {
      alert('Bộ sưu tập không tồn tại');
      router.push({ name: 'collection' });
    }
  } else {
    alert('Không có dữ liệu bộ sưu tập');
    router.push({ name: 'collection' });
  }
};

onMounted(() => {
  loadCollectionData();
});

// Delete collection
const handleDelete = async () => {
  if (!confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này?')) {
    return;
  }

  isDeleting.value = true;

  try {
    // Load existing collections
    const savedData = localStorage.getItem('collections');
    let collections = [];
    if (savedData) {
      collections = JSON.parse(savedData);
    }

    // Filter out the collection to delete
    const updatedCollections = collections.filter(item => item.id !== collection.value.id);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
    
    // Simulate API call delay
    setTimeout(() => {
      isDeleting.value = false;
      alert("Đã xóa bộ sưu tập thành công!");
      router.push({ name: 'collection' });
    }, 1000);
  } catch (error) {
    console.error('Error deleting collection:', error);
    alert('Có lỗi xảy ra khi xóa');
    isDeleting.value = false;
  }
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

/* HEADER */
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
  text-decoration: none;
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

/* BUTTONS */
.btn-outline-custom {
  background: white; 
  border: 1px solid #d1d5db; 
  color: #374151; 
  padding: 10px 20px;
  border-radius: 8px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}
.btn-outline-custom:hover { 
  background: #f9fafb; 
  border-color: #9ca3af; 
}

/* CONFIRMATION CARD */
.confirmation-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.confirmation-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.confirmation-header {
  background: #fef2f2;
  padding: 30px;
  text-align: center;
  border-bottom: 1px solid #fee2e2;
}

.warning-icon {
  font-size: 48px;
  color: #dc2626;
  margin-bottom: 15px;
}

.warning-title {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 700;
  color: #7f1d1d;
}

.warning-text {
  color: #991b1b;
  font-size: 16px;
  margin: 0;
}

.confirmation-body {
  padding: 30px;
}

.collection-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-preview {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.preview-image {
  width: 100px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.info-details {
  flex: 1;
}

.collection-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111;
}

.collection-subtitle {
  margin: 0 0 10px 0;
  color: #6b7280;
  font-size: 14px;
}

.info-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge.active {
  background: #dcfce7;
  color: #166534;
}

.badge.inactive {
  background: #f3f4f6;
  color: #4b5563;
}

.info-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.stat-item i {
  font-size: 16px;
}

.warning-message {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.warning-message i {
  color: #d97706;
  font-size: 20px;
  flex-shrink: 0;
}

.warning-message p {
  margin: 0;
  color: #92400e;
  font-size: 14px;
  line-height: 1.5;
}

.confirmation-footer {
  padding: 20px 30px;
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn-cancel {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-delete {
  background: #dc2626;
  border: none;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-delete:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}
</style>