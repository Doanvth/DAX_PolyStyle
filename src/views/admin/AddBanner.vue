<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.push('/admin/banner')">
          <i class="bi bi-arrow-left-short"></i>
        </button>
        <div>
          <h2 class="page-title">{{ isEditMode ? 'Cập Nhật Banner' : 'Tạo Banner Mới' }}</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active">{{ isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }}</li>
            </ol>
          </nav>
<!-- ======= Delete after pulish branch ============ -->
            <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active">{{ isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }}</li>
            </ol>
          </nav>
<!-- ===================================================== -->
        </div>
      </div>
      <div class="header-right">
        <button class="btn-cancel" @click="$router.push('/admin/banner')">Hủy bỏ</button>
        <button class="btn-save" @click="saveBanner" :disabled="isUploading">
          <i v-if="!isUploading" class="bi bi-cloud-check"></i>
          <span v-else class="spinner-border spinner-border-sm me-2"></span>
          {{ isUploading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật ngay' : 'Lưu Banner') }}
        </button>
      </div>
    </div>

    <div class="form-content-wrapper">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card-custom">
            <div class="card-header-custom">
              <i class="bi bi-info-circle"></i> Thông tin cơ bản
            </div>
            <div class="card-body-custom">
              <div class="form-group mb-4">
                <label class="form-label-custom">Tiêu đề Banner <span class="required">*</span></label>
                <input type="text" v-model="banner.title" class="form-control-custom" placeholder="Ví dụ: Khuyến mãi mùa hè 2024" />
              </div>

              <div class="form-group mb-4">
                <label class="form-label-custom">Đường dẫn liên kết (Link)</label>
                <div class="input-group-custom">
                  <span class="input-icon"><i class="bi bi-link-45deg"></i></span>
                  <input type="text" v-model="banner.link" class="form-control-custom has-icon" placeholder="https://domain.com/san-pham" />
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-4">
                  <label class="form-label-custom">Vị trí hiển thị</label>
                  <select v-model="banner.position" class="form-select-custom">
                    <option value="Home Slider">Trang chủ</option>
                    <option value="Sidebar Right">Cột bên phải </option>
                  </select>
                </div>
                <div class="col-md-6 mb-4">
                  <label class="form-label-custom">Thứ tự ưu tiên</label>
                  <input type="number" v-model.number="banner.order" class="form-control-custom" />
                </div>
              </div>
            </div>
          </div>

          <div class="card-custom mt-4">
            <div class="card-header-custom">
              <i class="bi bi-image"></i> Hình ảnh hiển thị
            </div>
            <div class="card-body-custom">
              <div class="upload-zone" @click="$refs.fileInput.click()" :class="{ 'has-img': banner.image }">
                <input type="file" ref="fileInput" hidden @change="handleFileUpload" accept="image/*" />
                
                <div v-if="!banner.image" class="upload-empty">
                  <div class="upload-icon">
                    <i class="bi bi-cloud-arrow-up-fill"></i>
                  </div>
                  <h5>Kéo thả hoặc nhấp để tải ảnh</h5>
                  <p>Hỗ trợ: JPG, PNG, WEBP (Tối đa 2MB)</p>
                </div>

                <div v-else class="upload-preview">
                  <img :src="banner.image" alt="Preview" />
                  <div class="upload-overlay">
                    <button class="btn-change-img"><i class="bi bi-arrow-repeat"></i> Thay đổi ảnh</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card-custom">
            <div class="card-header-custom">
              <i class="bi bi-gear"></i> Cài đặt xuất bản
            </div>
            <div class="card-body-custom">
              <label class="form-label-custom">Trạng thái hiển thị</label>
              <div class="status-selector">
                <div 
                  class="status-opt active-opt" 
                  :class="{ selected: banner.status === 'active' }"
                  @click="banner.status = 'active'"
                >
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Kích hoạt</span>
                </div>
                <div 
                  class="status-opt inactive-opt" 
                  :class="{ selected: banner.status === 'inactive' }"
                  @click="banner.status = 'inactive'"
                >
                  <i class="bi bi-eye-slash-fill"></i>
                  <span>Tạm ẩn</span>
                </div>
              </div>

              <hr class="my-4" />

              <div class="helper-box">
                <h6>Gợi ý:</h6>
                <ul>
                  <li>Kích thước khuyến nghị: 1920x600px cho Slider.</li>
                  <li>Đảm bảo link bắt đầu bằng http:// hoặc https://</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const isUploading = ref(false);
const fileInput = ref(null);

const banner = ref({
  title: '',
  image: '',
  link: '',
  position: 'Home Slider',
  status: 'active',
  order: 0
});

const isEditMode = computed(() => !!route.params.id);

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const res = await axios.get(`http://localhost:3000/carousel/${route.params.id}`);
      let data = res.data;
      if (Array.isArray(data.image)) data.image = data.image[0]?.image_url || data.image[0];
      banner.value = data;
    } catch (err) {
      console.error("Lỗi lấy data:", err);
    }
  }
});

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'DAX_BE');

  try {
    const res = await axios.post('https://api.cloudinary.com/v1_1/dm623a8ue/image/upload', formData);
    banner.value.image = res.data.secure_url;
  } catch (err) {
    alert("Lỗi upload ảnh lên Cloudinary!");
  } finally {
    isUploading.value = false;
  }
};

const saveBanner = async () => {
  if (!banner.value.title || !banner.value.image) {
    return alert("Vui lòng nhập tiêu đề và tải ảnh lên!");
  }

  try {
    if (isEditMode.value) {
      await axios.put(`http://localhost:3000/carousel/${route.params.id}`, banner.value);
    } else {
      await axios.post('http://localhost:3000/carousel', banner.value);
    }
    alert("Thành công: Dữ liệu đã được lưu!");
    router.push('/admin/banner');
  } catch (err) {
    alert("Lỗi khi lưu dữ liệu!");
  }
};
</script>

<style scoped>
/* Tổng thể */
.admin-container {
  padding: 30px;
  background-color: #f4f7fe;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header-left { display: flex; align-items: center; gap: 15px; }

.btn-back {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: 0.3s;
}
.btn-back:hover { background: #eef2ff; color: #2563eb; }

.page-title { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0; }
.breadcrumb { margin: 0; font-size: 13px; }

.btn-cancel {
  background: transparent;
  border: none;
  font-weight: 600;
  color: #64748b;
  margin-right: 15px;
}

.btn-save {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}
.btn-save:hover { background: #1d4ed8; transform: translateY(-1px); }

/* Card & Form */
.card-custom {
  background: white;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  overflow: hidden;
}

.card-header-custom {
  padding: 18px 25px;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 700;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-body-custom { padding: 25px; }

.form-label-custom {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
  display: block;
}

.required { color: #ef4444; }

.form-control-custom, .form-select-custom {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  transition: 0.3s;
  font-size: 14px;
}

.form-control-custom:focus, .form-select-custom:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

/* Input Icon */
.input-group-custom { position: relative; }
.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 18px;
}
.has-icon { padding-left: 45px; }

/* Upload Zone */
.upload-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 15px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.upload-zone:hover { border-color: #2563eb; background: #eff6ff; }

.upload-empty { text-align: center; }
.upload-icon {
  font-size: 40px;
  color: #2563eb;
  margin-bottom: 10px;
}

.upload-preview { width: 100%; height: 100%; }
.upload-preview img { width: 100%; height: 250px; object-fit: cover; }

.upload-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.upload-zone:hover .upload-overlay { opacity: 1; }

.btn-change-img {
  background: white;
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
}

/* Status Selector */
.status-selector { display: flex; flex-direction: column; gap: 12px; }
.status-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: 0.3s;
  color: #64748b;
}

.status-opt i { font-size: 18px; }
.status-opt.selected.active-opt {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}
.status-opt.selected.inactive-opt {
  background: #fff1f2;
  border-color: #f43f5e;
  color: #f43f5e;
}

.helper-box {
  background: #f8fafc;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #94a3b8;
}
.helper-box h6 { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
.helper-box ul { padding-left: 20px; font-size: 12px; color: #64748b; margin: 0; }
</style>