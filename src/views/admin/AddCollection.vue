<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="header-content">
        <h3 class="page-title">Thêm Mới Bộ Sưu Tập</h3>
        <p class="page-subtitle">Nhập thông tin chi tiết, liên kết mạng xã hội và hình ảnh</p>
      </div>
      <button class="btn btn-light-secondary" @click="goBack">
        <i class="bi bi-arrow-left"></i> Quay lại
      </button>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span class="mt-2 fw-bold">Đang xử lý dữ liệu (Giả lập)...</span>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        
        <div class="card-body">
          
          <h5 class="section-title"><i class="bi bi-info-circle"></i> Thông Tin Chung</h5>
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="form-label">Tiêu đề chính (Title) <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-icon"><i class="bi bi-type-h1"></i></span>
                  <input type="text" v-model="form.title" class="form-control" placeholder="Nhập tên bộ sưu tập" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Tiêu đề phụ (Small Title)</label>
                <div class="input-group">
                  <span class="input-icon"><i class="bi bi-type-h3"></i></span>
                  <input type="text" v-model="form.small_title" class="form-control" placeholder="Nhập tiêu đề nhỏ">
                </div>
              </div>
               <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select class="form-control" v-model="form.status">
                    <option value="active">Công khai</option>
                    <option value="hidden">Ẩn</option>
                </select>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <label class="form-label">Ảnh bìa chính (Main Image)</label>
                
                <div class="image-upload-box" @click="triggerMainImageUpload">
                    <img v-if="previewMainImage" :src="previewMainImage" class="preview-img-main" />
                    <div v-else class="upload-placeholder">
                        <i class="bi bi-cloud-arrow-up"></i>
                        <span>Nhấn để chọn ảnh</span>
                    </div>
                    <input 
                        type="file" 
                        ref="mainImageInput" 
                        class="d-none" 
                        accept="image/*"
                        @change="onMainImageSelected"
                    >
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nội dung mô tả (Content)</label>
            <textarea v-model="form.content" class="form-control textarea-custom" rows="3" placeholder="Mô tả chi tiết về bộ sưu tập..."></textarea>
          </div>

          <hr class="divider">

          <h5 class="section-title"><i class="bi bi-share"></i> Liên Kết & Kênh Bán Hàng</h5>
          
          <div class="grid-container">
            <div class="form-group">
              <label class="form-label">Hotline</label>
              <div class="input-group">
                <span class="input-icon"><i class="bi bi-telephone"></i></span>
                <input type="text" v-model="form.hotline" class="form-control" placeholder="Số điện thoại">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fanpage URL</label>
              <div class="input-group">
                <span class="input-icon"><i class="bi bi-facebook"></i></span>
                <input type="text" v-model="form.fanpage" class="form-control" placeholder="Link Facebook">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Lazada URL</label>
              <div class="input-group">
                <span class="input-icon text-lazada"><i class="bi bi-bag"></i></span>
                <input type="text" v-model="form.lazada_url" class="form-control" placeholder="Link Lazada">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Shopee URL</label>
              <div class="input-group">
                <span class="input-icon text-shopee"><i class="bi bi-bag-check"></i></span>
                <input type="text" v-model="form.shopee_url" class="form-control" placeholder="Link Shopee">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Youtube URL</label>
              <div class="input-group">
                <span class="input-icon text-youtube"><i class="bi bi-youtube"></i></span>
                <input type="text" v-model="form.youtube_url" class="form-control" placeholder="Link Youtube">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">TikTok URL</label>
              <div class="input-group">
                <span class="input-icon text-tiktok"><i class="bi bi-tiktok"></i></span>
                <input type="text" v-model="form.tiktok_url" class="form-control" placeholder="Link TikTok">
              </div>
            </div>
          </div>

          <hr class="divider">

          <h5 class="section-title"><i class="bi bi-images"></i> Album Ảnh Chi Tiết</h5>
          
          <div class="image-list-wrapper">
            <div class="form-group">
                <button type="button" class="btn btn-secondary btn-upload-multi" @click="triggerDetailImageUpload">
                  <i class="bi bi-images"></i> Chọn ảnh chi tiết (Có thể chọn nhiều)
                </button>
                <input 
                    type="file" 
                    ref="detailImageInput" 
                    class="d-none" 
                    accept="image/*" 
                    multiple 
                    @change="onDetailImagesSelected"
                >
            </div>

            <div class="gallery-preview" v-if="form.detail_images.length > 0">
              <div v-for="(img, index) in form.detail_images" :key="index" class="gallery-item">
                <img :src="img.previewUrl" class="img-thumbnail-custom">
                <button type="button" class="btn-remove-img" @click="removeDetailImage(index)">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
            <p v-else class="text-muted small fst-italic">Chưa có ảnh chi tiết nào.</p>
          </div>

        </div>

        <div class="card-footer">
          <button type="button" class="btn btn-text" @click="goBack" :disabled="isLoading">Hủy bỏ</button>
          <button type="submit" class="btn btn-primary-gradient" :disabled="isLoading">
            <i class="bi bi-check-lg"></i> {{ isLoading ? 'Đang lưu...' : 'Lưu Dữ Liệu' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
// import axios from 'axios'; // Đã comment axios vì không dùng API

const router = useRouter();
const isLoading = ref(false); 

const mainImageInput = ref(null);
const detailImageInput = ref(null);
const previewMainImage = ref(null);

const form = reactive({
  imageFile: null,  
  title: '',
  small_title: '',
  status: 'active',
  content: '',
  hotline: '',
  fanpage: '',
  lazada_url: '',
  shopee_url: '',
  youtube_url: '',
  tiktok_url: '',
  detail_images: [] 
});

const triggerMainImageUpload = () => mainImageInput.value.click();

const onMainImageSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.imageFile = file;
        previewMainImage.value = URL.createObjectURL(file);
    }
};

const triggerDetailImageUpload = () => detailImageInput.value.click();

const onDetailImagesSelected = (event) => {
    const files = Array.from(event.target.files); 
    files.forEach(file => {
        form.detail_images.push({
            file: file, 
            previewUrl: URL.createObjectURL(file), 
            image_id: Date.now() + Math.random().toString()
        });
    });
    event.target.value = null; 
};

const removeDetailImage = (index) => {
    URL.revokeObjectURL(form.detail_images[index].previewUrl);
    form.detail_images.splice(index, 1);
};

// --- HÀM SUBMIT MỚI (MOCK DATA) ---
const handleSubmit = async () => {
  isLoading.value = true;
  
  // Vẫn tạo FormData để kiểm tra logic code
  const formData = new FormData();

  formData.append('title', form.title);
  formData.append('small_title', form.small_title);
  formData.append('status', form.status);
  formData.append('content', form.content);
  formData.append('hotline', form.hotline);
  formData.append('fanpage', form.fanpage);
  formData.append('lazada_url', form.lazada_url);
  formData.append('shopee_url', form.shopee_url);
  formData.append('youtube_url', form.youtube_url);
  formData.append('tiktok_url', form.tiktok_url);

  if (form.imageFile) {
    formData.append('image', form.imageFile);
  }

  if (form.detail_images.length > 0) {
    form.detail_images.forEach((item) => {
        formData.append('detail_images', item.file);
    });
  }

  // LOG DỮ LIỆU SẼ GỬI ĐI RA CONSOLE
  console.group("=== MOCK SUBMIT DATA ===");
  console.log("Title:", form.title);
  console.log("Status:", form.status);
  console.log("Main Image:", form.imageFile ? form.imageFile.name : "Không có");
  console.log("Số lượng ảnh chi tiết:", form.detail_images.length);
  // Log chi tiết FormData
  for (let pair of formData.entries()) {
    console.log(`Key: ${pair[0]}, Value:`, pair[1]);
  }
  console.groupEnd();

  // GIẢ LẬP GỌI API (DELAY 1.5 GIÂY)
  setTimeout(() => {
    isLoading.value = false;
    alert("Thêm mới bộ sưu tập thành công! (Dữ liệu đã được log ra console)");
    
    // Chuyển trang sau khi thành công
    router.push({ name: 'collection' }); 
  }, 1500);
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.page-wrapper {
  padding: 5px;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.page-title { font-weight: 700; color: #2c3e50; margin: 0; }
.page-subtitle { color: #6c757d; font-size: 14px; margin-top: 5px; }

.form-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  max-width: 1300px;
  margin: 0 auto;
  border: 1px solid #eaeaea;
  overflow: hidden;
}
.card-body { padding: 10px; }
.section-title {
  color: #6c63ff;
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.row { display: flex; gap: 20px; margin-bottom: 15px; }
.col { flex: 1; }
.grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.divider { border: 0; border-top: 1px dashed #e0e0e0; margin: 30px 0; }
.form-group { margin-bottom: 15px; }
.form-label { font-weight: 600; font-size: 13px; color: #495057; margin-bottom: 8px; display: block; }
.required { color: red; }
.input-group { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 12px; color: #adb5bd; z-index: 2; }
.form-control {
  width: 100%;
  padding: 10px 10px 10px 38px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}
.form-control:focus {
  border-color: #6c63ff;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
  outline: none;
}
.textarea-custom { padding: 10px; height: auto; }
.d-none { display: none; }

.image-upload-box {
  width: 100%;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #fafafa;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}
.image-upload-box:hover {
  border-color: #6c63ff;
  background-color: #f0f0ff;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #888;
}
.upload-placeholder i { font-size: 30px; margin-bottom: 10px; }
.preview-img-main {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-upload-multi {
  width: 100%;
  padding: 10px;
  border: 1px dashed #6c63ff;
  background: #f9f9ff;
  color: #6c63ff;
  font-weight: bold;
}
.btn-upload-multi:hover {
  background: #eaeaea;
}

.gallery-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}
.gallery-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.img-thumbnail-custom {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn-remove-img {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}
.btn-remove-img:hover { background: red; }

.card-footer {
  background: #f8f9fa;
  padding: 20px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
}
.btn {
  padding: 9px 18px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-light-secondary { background: #fff; border: 1px solid #ddd; color: #555; }
.btn-text { background: transparent; color: #666; }
.btn-primary-gradient {
  background: linear-gradient(135deg, #6c63ff 0%, #5a52d5 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.25);
}
.btn-primary-gradient:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
}
</style>