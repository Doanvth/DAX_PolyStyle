<template>
  <div class="admin-container">
    <!-- HEADER ACTION -->
    <div class="page-header">
      <div class="header-left">
        <router-link :to="{ name: 'collection' }" class="btn-back">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div>
          <h2 class="page-title">Chỉnh Sửa Bộ Sưu Tập</h2>
          <p class="text-muted">Cập nhật thông tin bộ sưu tập</p>
        </div>
      </div>
      <div class="header-right">
        <router-link :to="{ name: 'collection' }" class="btn-outline-custom">Hủy bỏ</router-link>
        <button class="btn-primary-custom" @click="handleSubmit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          <i class="bi bi-check2-circle" v-else></i> 
          {{ isLoading ? 'Đang lưu...' : 'Cập nhật' }}
        </button>
      </div>
    </div>

    <!-- FORM LAYOUT -->
    <div class="form-layout">
      
      <!-- LEFT COLUMN: MAIN CONTENT -->
      <div class="col-left">
        
        <!-- 1. General Info -->
        <div class="card-box">
          <h4 class="card-title">Thông tin chung</h4>
          
          <div class="form-group">
            <label class="form-label">Tiêu đề chính <span class="text-red">*</span></label>
            <div class="input-wrapper">
                <span class="input-prefix"><i class="bi bi-type-h1"></i></span>
                <input type="text" v-model="form.title" class="form-control form-input pl-40" placeholder="Nhập tiêu đề bộ sưu tập..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Tiêu đề phụ / Mô tả ngắn</label>
            <div class="input-wrapper">
                <span class="input-prefix"><i class="bi bi-type-h3"></i></span>
                <input type="text" v-model="form.subtitle" class="form-control form-input pl-40" placeholder="Nhập tiêu đề nhỏ..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mô tả chi tiết</label>
            <textarea v-model="form.description" class="form-textarea" rows="4" placeholder="Viết mô tả chi tiết về bộ sưu tập..."></textarea>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: SIDEBAR -->
      <div class="col-right">
        
        <!-- Status -->
        <div class="card-box">
            <h4 class="card-title">Trạng thái</h4>
            <div class="status-selection">
                <label class="status-option" :class="{ active: form.status === 'active' }">
                    <input type="radio" v-model="form.status" value="active" hidden>
                    <span class="dot success"></span>
                    <span>Công khai</span>
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

        <!-- Cover Image -->
        <div class="card-box mt-4">
            <h4 class="card-title">Ảnh bìa chính</h4>
            <div class="upload-zone-large" :class="{'has-image': form.image}" @click="triggerImageUpload">
                <img v-if="form.image" :src="form.image" class="banner-preview" />
                <div v-else class="upload-placeholder">
                    <i class="bi bi-cloud-arrow-up"></i>
                    <p>Tải ảnh bìa</p>
                </div>
                <input type="file" ref="imageInput" class="d-none" accept="image/*" @change="onImageSelected">
            </div>
            <div class="mt-3">
              <input type="text" v-model="form.image" class="form-input" placeholder="Hoặc nhập URL hình ảnh..." @input="updateImagePreview" />
            </div>
        </div>

        <!-- Additional Info -->
        <div class="card-box mt-4">
            <h4 class="card-title">Thông tin bổ sung</h4>
            
            <div class="form-group">
              <label class="form-label">Số lượng sản phẩm</label>
              <input type="number" v-model.number="form.productCount" min="0" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Hotline</label>
              <input type="text" v-model="form.hotline" class="form-input" placeholder="Nhập số hotline..." />
            </div>

            <div class="form-group">
              <label class="form-label">Ngày tạo</label>
              <input type="text" v-model="form.createAt" class="form-input" placeholder="dd/mm/yyyy" />
            </div>
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
const isLoading = ref(false);
const imageInput = ref(null);

const form = ref({
  id: null,
  title: '',
  subtitle: '',
  description: '',
  image: '',
  status: 'active',
  productCount: 0,
  hotline: '',
  createAt: ''
});

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
    const collection = collections.find(item => item.id === collectionId);
    
    if (collection) {
      form.value = { ...collection };
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

// Image handling
const triggerImageUpload = () => imageInput.value.click();

const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const updateImagePreview = () => {
  // URL validation can be added here
};

// Submit form
const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    alert("Vui lòng nhập tiêu đề chính!");
    return;
  }

  isLoading.value = true;

  try {
    // Load existing collections
    const savedData = localStorage.getItem('collections');
    let collections = [];
    if (savedData) {
      collections = JSON.parse(savedData);
    }

    // Find and update the collection
    const index = collections.findIndex(item => item.id === form.value.id);
    if (index !== -1) {
      collections[index] = { ...form.value };
      localStorage.setItem('collections', JSON.stringify(collections));
      
      // Simulate API call delay
      setTimeout(() => {
        isLoading.value = false;
        alert("Đã cập nhật bộ sưu tập thành công!");
        router.push({ name: 'collection' });
      }, 1000);
    } else {
      alert('Bộ sưu tập không tồn tại');
      router.push({ name: 'collection' });
    }
  } catch (error) {
    console.error('Error updating collection:', error);
    alert('Có lỗi xảy ra khi cập nhật');
    isLoading.value = false;
  }
};

</script>

<style scoped>
/* --- BASE STYLE --- */
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
}

/* HEADER */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.header-left { display: flex; align-items: center; gap: 15px; }
.btn-back {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e5e7eb; background: white;
  cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #6b7280; transition: all 0.2s;
}
.btn-back:hover { background: #f9fafb; color: #111; transform: translateX(-2px); }
.page-title { margin: 0; font-size: 24px; font-weight: 700; color: #111; }
.text-muted { color: #9ca3af; font-size: 13px; margin: 2px 0 0 0; }
.header-right { display: flex; gap: 10px; }

/* BUTTONS */
.btn-primary-custom {
  background: #2563eb; color: white; border: none; padding: 10px 24px;
  border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2);
}
.btn-primary-custom:hover { background: #1d4ed8; transform: translateY(-1px); }
.btn-primary-custom:disabled { background: #93c5fd; cursor: not-allowed; }
.btn-outline-custom {
  background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 20px;
  border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-outline-custom:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-dashed-sm {
    border: 1px dashed #d1d5db; background: white; padding: 5px 12px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: #6b7280; cursor: pointer; transition: 0.2s;
}
.btn-dashed-sm:hover { color: #2563eb; border-color: #2563eb; background: #eff6ff; }

/* LAYOUT GRID */
.form-layout { display: grid; grid-template-columns: 2fr 1.2fr; gap: 25px; }
@media (max-width: 1024px) { .form-layout { grid-template-columns: 1fr; } }

/* CARDS */
.card-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02); }
.card-title { margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px; }
.mt-4 { margin-top: 25px; }

/* INPUTS */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 6px; }
.form-label-sm { display: block; font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 6px; margin-top: 10px; }
.text-red { color: #ef4444; }
.form-input, .form-textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; color: #111; outline: none; transition: all 0.2s; background: #fff;
}
.form-input:focus, .form-textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

/* INPUT WRAPPER */
.input-wrapper { position: relative; }
.input-prefix {
  position: absolute; left: 1px; top: 1px; bottom: 1px; width: 40px;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 16px; border-right: 1px solid transparent;
}
.form-input.pl-40 { padding-left: 40px; }

/* SOCIAL COLORS */
.input-prefix.facebook { color: #1877f2; }
.input-prefix.shopee { color: #f59e0b; }
.input-prefix.youtube { color: #ff0000; }
.input-prefix.tiktok { color: #000; }

/* STORY TIMELINE */
.story-timeline { display: flex; flex-direction: column; gap: 20px; }
.story-item { display: flex; gap: 15px; }
.story-badge {
    width: 28px; height: 28px; background: #eff6ff; color: #2563eb;
    border-radius: 50%; font-weight: 700; font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff; box-shadow: 0 0 0 1px #dbeafe; flex-shrink: 0;
}
.story-content {
    flex: 1; background: #f9fafb; border-radius: 8px; padding: 15px; border: 1px solid #e5e7eb;
}
.story-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.story-label { font-size: 13px; font-weight: 600; color: #374151; }
.btn-icon-trash {
    background: none; border: none; color: #9ca3af; cursor: pointer; transition: 0.2s;
}
.btn-icon-trash:hover { color: #ef4444; }

/* MEDIA GRID (Mini) */
.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 10px; }
.upload-box-mini {
    height: 70px; border: 1px dashed #d1d5db; border-radius: 6px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; color: #9ca3af; font-size: 11px; background: #fff; transition: 0.2s;
}
.upload-box-mini:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.media-item { position: relative; height: 70px; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; }
.media-img { width: 100%; height: 100%; object-fit: cover; }
.btn-remove-media {
    position: absolute; top: 1px; right: 1px; width: 18px; height: 18px;
    background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px;
}

/* UPLOAD ZONE LARGE */
.upload-zone-large {
    height: 200px; border: 2px dashed #e5e7eb; border-radius: 8px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; background: #f9fafb; position: relative; overflow: hidden; transition: 0.2s;
}
.upload-zone-large:hover { border-color: #2563eb; background: #eff6ff; }
.upload-zone-large.has-image { border: none; }
.upload-placeholder { text-align: center; color: #6b7280; }
.upload-placeholder i { font-size: 32px; color: #9ca3af; }
.upload-placeholder p { font-size: 13px; margin: 5px 0 0 0; font-weight: 500; }
.banner-preview { width: 100%; height: 100%; object-fit: cover; }
.btn-reset-abs {
    position: absolute; top: 10px; right: 10px; width: 24px; height: 24px;
    background: white; border-radius: 50%; border: none; shadow: 0 2px 5px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444;
}

/* STATUS SELECTION */
.status-selection { display: flex; flex-direction: column; gap: 8px; }
.status-option {
    display: flex; align-items: center; gap: 10px; padding: 12px 15px;
    border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: 0.2s;
    font-size: 14px; color: #374151; font-weight: 500;
}
.status-option:hover { background: #f9fafb; border-color: #d1d5db; }
.status-option.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: block; }
.dot.success { background-color: #10b981; }
.dot.danger { background-color: #ef4444; }
.ms-auto { margin-left: auto; }

.btn-dashed {
    width: 100%; border: 1px dashed #d1d5db; background: #fff; padding: 10px; border-radius: 8px;
    color: #6b7280; font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.2s;
}
.btn-dashed:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
</style>