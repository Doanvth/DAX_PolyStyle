<template>
  <div class="admin-container">
    <!-- HEADER ACTION -->
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">{{ isEditMode ? 'Cập Nhật Biểu Ngữ' : 'Thêm Biểu Ngữ Mới' }}</h2>
          <p class="text-muted">Quản lý banner quảng cáo và slide trang chủ</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="goBack">Hủy bỏ</button>
        <button class="btn-primary-custom" @click="saveBanner">
          <i class="bi bi-check2-circle"></i> 
          {{ isEditMode ? 'Lưu Thay Đổi' : 'Lưu Banner' }}
        </button>
      </div>
    </div>

    <!-- FORM LAYOUT -->
    <div class="form-layout">
      
      <!-- LEFT COLUMN: MAIN IMAGE & INFO -->
      <div class="col-left">
        
        <!-- 1. Banner Image -->
        <div class="card-box">
          <h4 class="card-title">Hình ảnh Banner</h4>
          
          <!-- Upload Zone -->
          <div class="upload-zone-large" :class="{'has-image': previewImg || banner.image}" @click="triggerFileUpload">
              <img v-if="previewImg" :src="previewImg" class="banner-preview" />
              <img v-else-if="banner.image" :src="banner.image" class="banner-preview" />
              
              <div v-else class="upload-placeholder">
                  <i class="bi bi-card-image"></i>
                  <p>Nhấn để tải ảnh banner lên</p>
                  <span class="text-sm-muted">Kích thước khuyên dùng: 1920x600px (Slider)</span>
              </div>
              
              <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileUpload">
              
              <button v-if="previewImg || banner.image" class="btn-reset-abs" @click.stop="resetImage">
                  <i class="bi bi-x"></i>
              </button>
          </div>

          <div class="form-group mt-3">
             <label class="form-label">Đường dẫn ảnh (Image Source URL)</label>
             <div class="input-wrapper">
                 <span class="input-prefix"><i class="bi bi-image"></i></span>
                 <input type="text" v-model="banner.image" class="form-input pl-40" placeholder="https://..." />
             </div>
             <small class="text-muted mt-1 d-block">Link trực tiếp đến file ảnh (nếu không upload).</small>
          </div>
        </div>

        <!-- 2. Basic Info -->
        <div class="card-box mt-4">
          <h4 class="card-title">Thông tin chi tiết</h4>
          
          <div class="form-group">
            <label class="form-label">Tiêu đề Banner <span class="text-red">*</span></label>
            <div class="input-wrapper">
                <span class="input-prefix"><i class="bi bi-type"></i></span>
                <input type="text" v-model="banner.title" class="form-input pl-40" placeholder="VD: Khuyến mãi Mùa Hè 2025..." required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Liên kết mục tiêu (Target Link)</label>
            <div class="input-wrapper">
                <span class="input-prefix"><i class="bi bi-link-45deg"></i></span>
                <input type="text" v-model="banner.link" class="form-input pl-40" placeholder="VD: https://myshop.com/khuyen-mai" />
            </div>
            <small class="text-muted mt-1 d-block">Khách hàng sẽ được chuyển đến link này khi bấm vào banner.</small>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: SETTINGS -->
      <div class="col-right">
        
        <!-- Configuration -->
        <div class="card-box">
          <h4 class="card-title">Cấu hình hiển thị</h4>
          
          <div class="form-group">
             <label class="form-label">Vị trí hiển thị <span class="text-red">*</span></label>
             <div class="select-wrapper">
                 <select v-model="banner.position" class="form-input">
                    <option value="" disabled>-- Chọn vị trí --</option>
                    <option value="Home Slider">Trang Chủ (Main Slider)</option>
                    <option value="Sidebar Right">Sidebar (Cột bên)</option>
                    <option value="Footer Banner">Footer (Chân trang)</option>
                    <option value="Popup Sale">Popup Khuyến mãi</option>
                 </select>
             </div>
          </div>

          <div class="form-group">
             <label class="form-label">Thứ tự ưu tiên</label>
             <div class="input-wrapper">
                 <span class="input-prefix"><i class="bi bi-sort-numeric-down"></i></span>
                 <input type="number" v-model.number="banner.order" class="form-input pl-40" placeholder="0" min="0"/>
             </div>
             <small class="text-muted mt-1 d-block">Số nhỏ hiển thị trước.</small>
          </div>

          <div class="form-group">
             <label class="form-label">Ngày đăng</label>
             <div class="input-wrapper">
                 <span class="input-prefix"><i class="bi bi-calendar-event"></i></span>
                 <input type="date" v-model="banner.create_at" class="form-input pl-40" />
             </div>
          </div>
        </div>

        <!-- Status -->
        <div class="card-box mt-4">
            <h4 class="card-title">Trạng thái</h4>
            <div class="status-selection">
                <label class="status-option" :class="{ active: banner.status === 'active' }">
                    <input type="radio" v-model="banner.status" value="active" hidden>
                    <span class="dot success"></span>
                    <span>Hiển thị</span>
                    <i class="bi bi-check-lg ms-auto" v-if="banner.status === 'active'"></i>
                </label>
                <label class="status-option" :class="{ active: banner.status === 'inactive' }">
                    <input type="radio" v-model="banner.status" value="inactive" hidden>
                    <span class="dot danger"></span>
                    <span>Ẩn</span>
                    <i class="bi bi-check-lg ms-auto" v-if="banner.status === 'inactive'"></i>
                </label>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            banner: {
                title: "",
                link: "",
                position: "",
                order: 0,
                status: "active",
                create_at: new Date().toISOString().split('T')[0],
                image: ""
            },
            previewImg: null
        };
    },
    computed: {
        isEditMode() {
            return !!this.$route.params.id;
        }
    },
    async created() {
        if (this.isEditMode) {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:3000/carousel/${id}`);
                let data = response.data;

                // Chuẩn hóa dữ liệu nếu cần
                if (Array.isArray(data.image) && data.image.length > 0) {
                    data.image = data.image[0].image_url;
                }
                
                this.banner = data;
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Không tìm thấy banner!");
            }
        }
    },
    methods: {
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Tạo preview local
                if (this.previewImg) URL.revokeObjectURL(this.previewImg);
                this.previewImg = URL.createObjectURL(file);
                
                // Giả lập lưu tên file vào model
                // Trong thực tế: Upload file lên server -> Nhận về URL -> Gán vào banner.image
                this.banner.image = "https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=1000&auto=format&fit=crop"; 
            }
        },
        resetImage() {
            if (this.previewImg) URL.revokeObjectURL(this.previewImg);
            this.previewImg = null;
            this.banner.image = "";
            if(this.$refs.fileInput) this.$refs.fileInput.value = '';
        },
        goBack() {
            this.$router.push('/admin/banner');
        },
        async saveBanner() {
            // Validate
            if (!this.banner.title || !this.banner.position) {
                return alert("Vui lòng nhập Tiêu đề và chọn Vị trí hiển thị!");
            }
            if (!this.banner.image) {
                return alert("Vui lòng tải ảnh banner lên!");
            }

            try {
                const dataToSend = { ...this.banner };

                if (this.isEditMode) {
                    const id = this.$route.params.id;
                    await axios.put(`http://localhost:3000/carousel/${id}`, dataToSend);
                    alert("Cập nhật thành công!");
                } else {
                    await axios.post('http://localhost:3000/carousel', dataToSend);
                    alert("Thêm mới thành công!");
                }
                this.goBack();
            } catch (error) {
                console.error("Lỗi lưu:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        }
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
.btn-outline-custom {
  background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 20px;
  border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-outline-custom:hover { background: #f9fafb; border-color: #9ca3af; }

/* LAYOUT GRID */
.form-layout { display: grid; grid-template-columns: 2fr 1.2fr; gap: 25px; }
@media (max-width: 1024px) { .form-layout { grid-template-columns: 1fr; } }

/* CARDS */
.card-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02); }
.card-title { margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px; }
.mt-4 { margin-top: 25px; }
.mt-3 { margin-top: 15px; }

/* INPUTS */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 6px; }
.text-red { color: #ef4444; }
.text-sm-muted { font-size: 12px; color: #9ca3af; margin-top: 4px; display: block; }
.form-input {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; color: #111; outline: none; transition: all 0.2s; background: #fff;
}
.form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

/* INPUT WRAPPER */
.input-wrapper { position: relative; }
.input-prefix {
  position: absolute; left: 1px; top: 1px; bottom: 1px; width: 40px;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 16px; border-right: 1px solid transparent;
}
.form-input.pl-40 { padding-left: 40px; }

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

/* UPLOAD ZONE LARGE */
.upload-zone-large {
    height: 300px; border: 2px dashed #e5e7eb; border-radius: 8px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; background: #f9fafb; position: relative; overflow: hidden; transition: 0.2s;
}
.upload-zone-large:hover { border-color: #2563eb; background: #eff6ff; }
.upload-zone-large.has-image { border: none; background: #000; }
.upload-placeholder { text-align: center; color: #6b7280; }
.upload-placeholder i { font-size: 48px; color: #9ca3af; margin-bottom: 10px; display: block; }
.upload-placeholder p { font-size: 14px; margin: 0; font-weight: 500; }
.banner-preview { width: 100%; height: 100%; object-fit: contain; }
.btn-reset-abs {
    position: absolute; top: 10px; right: 10px; width: 32px; height: 32px;
    background: rgba(255,255,255,0.9); border-radius: 50%; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; font-size: 18px;
}
.d-none { display: none; }
</style>