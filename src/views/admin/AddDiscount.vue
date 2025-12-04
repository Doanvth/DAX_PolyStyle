<template>
  <div class="admin-container">
    <!-- HEADER ACTION -->
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.go(-1)">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">Tạo chiến dịch mới</h2>
          <p class="text-muted">Thiết lập chương trình khuyến mãi cho cửa hàng</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="$router.go(-1)">Hủy bỏ</button>
        <button class="btn-primary-custom" @click="saveCampaign">
          <i class="bi bi-check2-circle"></i> Lưu & Kích hoạt
        </button>
      </div>
    </div>

    <!-- FORM CONTAINER -->
    <div class="form-layout">
      
      <!-- LEFT COLUMN: GENERAL INFO -->
      <div class="col-left">
        
        <!-- 1. Thông tin chung -->
        <div class="card-box">
          <h4 class="card-title">Thông tin chung</h4>
          
          <div class="form-group">
            <label class="form-label">Tên chương trình <span class="text-red">*</span></label>
            <input type="text" v-model="form.name" class="form-input" placeholder="Ví dụ: Siêu Sale Giáng Sinh 2025 - Giảm 50%" />
          </div>

          <div class="form-group">
            <label class="form-label">Mô tả (Tùy chọn)</label>
            <textarea v-model="form.description" class="form-textarea" rows="3" placeholder="Ghi chú nội bộ hoặc mô tả hiển thị cho khách hàng..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Thời gian bắt đầu</label>
              <input type="datetime-local" v-model="form.startDate" class="form-input" />
            </div>
            <div class="form-group half">
              <label class="form-label">Thời gian kết thúc</label>
              <input type="datetime-local" v-model="form.endDate" class="form-input" />
            </div>
          </div>
        </div>

        <!-- 2. Cấu hình giảm giá -->
        <div class="card-box mt-4">
          <h4 class="card-title">Thiết lập mức giảm</h4>
          
          <div class="discount-type-group">
            <div class="type-option" 
                 :class="{ active: form.type === 'percent' }"
                 @click="form.type = 'percent'">
              <div class="radio-circle"></div>
              <div class="type-info">
                <span class="type-title">Theo phần trăm (%)</span>
                <span class="type-desc">Ví dụ: Giảm 20% giá bán</span>
              </div>
            </div>
            <div class="type-option" 
                 :class="{ active: form.type === 'fixed' }"
                 @click="form.type = 'fixed'">
              <div class="radio-circle"></div>
              <div class="type-info">
                <span class="type-title">Theo số tiền (VNĐ)</span>
                <span class="type-desc">Ví dụ: Giảm trực tiếp 50.000₫</span>
              </div>
            </div>
          </div>

          <div class="form-row align-bottom">
            <div class="form-group half">
              <label class="form-label">Giá trị giảm</label>
              <div class="input-wrapper">
                <input type="number" v-model="form.value" class="form-input bold-text" placeholder="0" />
                <span class="input-suffix">{{ form.type === 'percent' ? '%' : '₫' }}</span>
              </div>
            </div>
            
            <div class="form-group half" v-if="form.type === 'percent'">
              <label class="form-label">Giảm tối đa (Tùy chọn)</label>
              <div class="input-wrapper">
                <input type="number" v-model="form.maxDiscount" class="form-input" placeholder="Không giới hạn" />
                <span class="input-suffix">₫</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: SCOPE & TARGET -->
      <div class="col-right">
        
        <div class="card-box">
          <h4 class="card-title">Phạm vi áp dụng</h4>
          <p class="section-desc">Chọn đối tượng sản phẩm được áp dụng chương trình này.</p>

          <!-- Scope Selection List -->
          <div class="scope-list">
            <div class="scope-item" 
                 :class="{ active: form.scope === 'all' }" 
                 @click="form.scope = 'all'">
              <div class="scope-icon"><i class="bi bi-shop-window"></i></div>
              <div class="scope-content">
                <span class="scope-name">Toàn bộ cửa hàng</span>
                <span class="scope-detail">Áp dụng cho tất cả sản phẩm hiện có</span>
              </div>
              <i class="bi bi-check-circle-fill check-mark"></i>
            </div>

            <div class="scope-item" 
                 :class="{ active: form.scope === 'category' }" 
                 @click="form.scope = 'category'">
              <div class="scope-icon"><i class="bi bi-grid"></i></div>
              <div class="scope-content">
                <span class="scope-name">Theo Danh mục</span>
                <span class="scope-detail">Chọn các nhóm sản phẩm cụ thể</span>
              </div>
              <i class="bi bi-check-circle-fill check-mark"></i>
            </div>

            <div class="scope-item" 
                 :class="{ active: form.scope === 'product' }" 
                 @click="form.scope = 'product'">
              <div class="scope-icon"><i class="bi bi-box-seam"></i></div>
              <div class="scope-content">
                <span class="scope-name">Sản phẩm tùy chọn</span>
                <span class="scope-detail">Chọn từng sản phẩm lẻ</span>
              </div>
              <i class="bi bi-check-circle-fill check-mark"></i>
            </div>
          </div>

          <!-- Dynamic Content Based on Scope -->
          <transition name="fade">
            <div v-if="form.scope === 'category'" class="scope-config-area">
                <label class="form-label">Chọn danh mục</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox"> Thời trang Nam</label>
                    <label class="checkbox-item"><input type="checkbox"> Thời trang Nữ</label>
                    <label class="checkbox-item"><input type="checkbox"> Phụ kiện</label>
                    <label class="checkbox-item"><input type="checkbox"> Giày dép</label>
                </div>
            </div>
          </transition>

          <transition name="fade">
            <div v-if="form.scope === 'product'" class="scope-config-area">
                <label class="form-label">Thêm sản phẩm</label>
                <div class="search-add-wrapper">
                    <input type="text" placeholder="Tìm tên hoặc SKU..." class="form-input sm">
                    <button class="btn-icon-add"><i class="bi bi-search"></i></button>
                </div>

                <!-- Selected List Mockup -->
                <div class="selected-products-list">
                    <div class="product-mini-item" v-for="(prod, i) in mockProducts" :key="i">
                        <img :src="prod.img">
                        <div class="prod-info">
                            <span class="name">{{ prod.name }}</span>
                            <span class="sku">{{ prod.sku }}</span>
                        </div>
                        <button class="btn-remove" @click="removeProduct(i)"><i class="bi bi-x"></i></button>
                    </div>
                </div>
            </div>
          </transition>

        </div>

        <!-- Banner Upload -->
        <div class="card-box mt-4">
            <h4 class="card-title">Banner chương trình</h4>
            <div class="upload-zone">
                <div class="upload-content">
                    <i class="bi bi-cloud-upload"></i>
                    <p>Kéo thả ảnh hoặc <span>bấm để chọn</span></p>
                    <small>JPG, PNG, GIF (Max 2MB)</small>
                </div>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  type: 'percent', // 'percent' | 'fixed'
  value: null,
  maxDiscount: null,
  scope: 'all', // 'all' | 'category' | 'product'
});

const mockProducts = ref([
    { name: 'Áo Thun Polo Premium', sku: 'POLO-01', img: 'https://placehold.co/40x40' },
    { name: 'Quần Jean Slimfit', sku: 'JEAN-99', img: 'https://placehold.co/40x40' },
    { name: 'Váy Hoa Nhí Vintage', sku: 'VAY-05', img: 'https://placehold.co/40x40' }
]);

const removeProduct = (index) => {
    mockProducts.value.splice(index, 1);
};

const saveCampaign = () => {
    // Validate simple
    if(!form.value.name) return alert('Vui lòng nhập tên chiến dịch!');
    console.log('Submitting:', form.value);
    alert('Đã lưu chiến dịch thành công!');
};
</script>

<style scoped>
/* --- BASE --- */
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
}

/* --- HEADER --- */
.page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;
}
.header-left { display: flex; align-items: center; gap: 15px; }
.btn-back {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e5e7eb; background: white;
  cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #6b7280; transition: all 0.2s;
}
.btn-back:hover { background: #f9fafb; color: #111; transform: translateX(-2px); }

.page-title { margin: 0; font-size: 24px; font-weight: 700; color: #111; }
.text-muted { color: #9ca3af; font-size: 13px; margin: 2px 0 0 0; }

.header-right { display: flex; gap: 10px; }
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

/* --- FORM LAYOUT --- */
.form-layout { display: grid; grid-template-columns: 2fr 1.2fr; gap: 25px; }
@media (max-width: 1024px) { .form-layout { grid-template-columns: 1fr; } }

.card-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02); }
.card-title { margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px; }
.mt-4 { margin-top: 25px; }

/* INPUTS */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 6px; }
.text-red { color: #ef4444; }
.form-input, .form-textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; color: #111; outline: none; transition: all 0.2s;
}
.form-input:focus, .form-textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
.form-row { display: flex; gap: 20px; }
.form-row.align-bottom { align-items: flex-end; }
.half { flex: 1; }

.input-wrapper { position: relative; }
.input-wrapper .form-input { padding-right: 40px; font-weight: 500; }
.input-suffix {
  position: absolute; right: 1px; top: 1px; bottom: 1px; width: 36px;
  display: flex; align-items: center; justify-content: center;
  background: #f9fafb; border-left: 1px solid #d1d5db; border-radius: 0 8px 8px 0;
  color: #6b7280; font-weight: 600; font-size: 13px;
}

/* DISCOUNT TYPE */
.discount-type-group { display: flex; gap: 15px; margin-bottom: 20px; }
.type-option {
  flex: 1; padding: 15px; border: 1px solid #e5e7eb; border-radius: 10px;
  cursor: pointer; display: flex; align-items: flex-start; gap: 12px; transition: all 0.2s; background: #fff;
}
.type-option:hover { border-color: #2563eb; background: #f8fafc; }
.type-option.active { border-color: #2563eb; background-color: #eff6ff; }
.type-option.active .radio-circle { border-width: 5px; border-color: #2563eb; }

.radio-circle {
  width: 18px; height: 18px; border-radius: 50%; border: 2px solid #d1d5db; margin-top: 2px; transition: all 0.2s; flex-shrink: 0;
}
.type-info { display: flex; flex-direction: column; }
.type-title { font-weight: 600; font-size: 14px; color: #111; }
.type-desc { font-size: 12px; color: #6b7280; margin-top: 2px; }

/* SCOPE SELECTION */
.section-desc { font-size: 13px; color: #6b7280; margin-bottom: 15px; margin-top: -10px; }
.scope-list { display: flex; flex-direction: column; gap: 10px; }
.scope-item {
  display: flex; align-items: center; gap: 12px; padding: 12px 15px;
  border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; position: relative;
}
.scope-item:hover { border-color: #2563eb; }
.scope-item.active { border-color: #2563eb; background-color: #eff6ff; }
.scope-icon { 
    width: 36px; height: 36px; background: #f3f4f6; border-radius: 6px; 
    display: flex; align-items: center; justify-content: center; font-size: 18px; color: #4b5563;
}
.scope-item.active .scope-icon { background: #dbeafe; color: #2563eb; }

.scope-content { display: flex; flex-direction: column; flex: 1; }
.scope-name { font-weight: 600; font-size: 14px; color: #1f2937; }
.scope-detail { font-size: 12px; color: #6b7280; }
.check-mark { font-size: 18px; color: #2563eb; display: none; }
.scope-item.active .check-mark { display: block; }

/* SCOPE CONFIG AREA */
.scope-config-area { margin-top: 15px; padding-top: 15px; border-top: 1px dashed #e5e7eb; }
.checkbox-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.checkbox-item { font-size: 13px; color: #374151; display: flex; align-items: center; gap: 6px; cursor: pointer; }

/* PRODUCT SELECTOR */
.search-add-wrapper { display: flex; gap: 8px; margin-bottom: 10px; }
.form-input.sm { font-size: 13px; padding: 8px 10px; }
.btn-icon-add { 
    width: 38px; border: none; background: #f3f4f6; border-radius: 8px; color: #4b5563; cursor: pointer; transition: 0.2s;
}
.btn-icon-add:hover { background: #2563eb; color: white; }

.selected-products-list { max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
.product-mini-item { 
    display: flex; align-items: center; gap: 10px; padding: 8px; border: 1px solid #f3f4f6; border-radius: 6px; background: #fff; 
}
.product-mini-item img { width: 32px; height: 32px; border-radius: 4px; object-fit: cover; }
.prod-info { flex: 1; display: flex; flex-direction: column; }
.prod-info .name { font-size: 13px; font-weight: 500; color: #111; }
.prod-info .sku { font-size: 11px; color: #9ca3af; }
.btn-remove { background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; }
.btn-remove:hover { background: #fee2e2; border-radius: 4px; }

/* UPLOAD */
.upload-zone {
    border: 2px dashed #d1d5db; border-radius: 8px; height: 140px;
    display: flex; align-items: center; justify-content: center;
    background: #f9fafb; cursor: pointer; transition: all 0.2s;
}
.upload-zone:hover { border-color: #2563eb; background: #eff6ff; }
.upload-content { text-align: center; color: #6b7280; }
.upload-content i { font-size: 32px; display: block; margin-bottom: 5px; color: #9ca3af; }
.upload-content p span { color: #2563eb; font-weight: 600; }
.upload-content small { font-size: 11px; color: #9ca3af; display: block; margin-top: 4px; }

/* TRANSITION */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>