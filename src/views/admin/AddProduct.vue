<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.go(-1)">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">Thêm Sản Phẩm Mới</h2>
          <p class="text-muted">Quản lý thông tin và thiết lập sản phẩm</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="$router.go(-1)">Hủy bỏ</button>
        <button class="btn-primary-custom" @click="handleSubmit">
          <i class="bi bi-check2-circle"></i> Lưu Sản Phẩm
        </button>
      </div>
    </div>

    <div class="form-layout">

      <div class="col-left">

        <div class="card-box">
          <h4 class="card-title">Thông tin cơ bản</h4>

          <div class="form-group">
            <label class="form-label">Tên sản phẩm <span class="text-red">*</span></label>
            <input type="text" v-model="product.name" class="form-input" placeholder="Ví dụ: Áo Thun Cotton Premium" />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Mã SKU <span class="text-red">*</span></label>
              <input type="text" v-model="product.sku" class="form-input" placeholder="VD: SP001-2025" />
            </div>
            <div class="form-group half">
              <label class="form-label">Mô tả ngắn</label>
              <input type="text" class="form-input" placeholder="Nhập mô tả tổng quan..." v-model="product.description">
            </div>
          </div>
        </div>

        <div class="card-box mt-4">
          <div class="d-flex-between">
            <h4 class="card-title">Thư viện ảnh & Video</h4>
            <button class="btn-sm-text" @click="addImage">+ Thêm ảnh</button>
          </div>

          <div class="media-grid">
            <div class="upload-box-mini" @click="triggerFileUpload">
              <i class="bi bi-camera"></i>
              <span>Tải ảnh</span>
            </div>
            <div class="media-item" v-for="(img, index) in product.image" :key="'img' + index">
              <img v-if="img.preview" :src="img.preview" class="media-img" />
              <div v-else class="empty-media"><i class="bi bi-image"></i></div>
              <button class="btn-remove-media" @click="removeImage(index)"><i class="bi bi-x"></i></button>
              <input type="file" accept="image/*" style="display:none" :ref="'fileInput' + index"
                @change="(e) => onSelectImage(e, index)">
            </div>
          </div>

          <div class="video-section mt-3">
            <label class="form-label">Video URL</label>
            <div class="video-row" v-for="(vid, index) in product.video" :key="'vid' + index">
              <div class="input-wrapper full">
                <span class="input-prefix"><i class="bi bi-play-circle"></i></span>
                <input type="text" v-model="vid.video_url" class="form-input pl-40"
                  placeholder="https://youtube.com/..." />
              </div>
              <button class="btn-icon-trash" @click="removeVideo(index)"><i class="bi bi-trash"></i></button>
            </div>
            <button class="btn-dashed mt-2" @click="addVideo">+ Thêm dòng video</button>
          </div>
        </div>

        <div class="card-box mt-4">
          <div class="d-flex-between">
            <h4 class="card-title">Phân loại hàng (Biến thể)</h4>
            <button class="btn-sm-text" @click="addVariant">+ Thêm biến thể</button>
          </div>

          <div class="variant-list">
            <div class="variant-header">
              <span>Size</span>
              <span>Màu sắc</span>
              <span>Số lượng</span>
              <span class="w-40"></span>
            </div>
            <div class="variant-row" v-for="(item, index) in product.variant" :key="index">
              <select class="form-input sm" v-model="item.size_id">
                <option value="1">S</option>
                <option value="2">M</option>
                <option value="3">L</option>
                <option value="4">XL</option>
              </select>
              <select class="form-input sm" v-model="item.color_id">
                <option value="1">Đỏ</option>
                <option value="3">Đen</option>
                <option value="5">Ghi</option>
              </select>
              <input type="number" class="form-input sm" v-model="item.quantity" placeholder="0" />
              <button class="btn-icon-trash" @click="removeVariant(index)"><i class="bi bi-x-lg"></i></button>
            </div>
          </div>
        </div>

        <div class="card-box mt-4">
          <h4 class="card-title">Chi tiết thiết kế</h4>
          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Phom dáng</label>
              <input type="text" v-model="product.product_detail[0].silhouette" class="form-input"
                placeholder="VD: Slim fit" />
            </div>
            <div class="form-group half">
              <label class="form-label">Chất liệu</label>
              <input type="text" v-model="product.product_detail[0].material" class="form-input"
                placeholder="VD: 100% Cotton" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Kiểu cổ</label>
              <input type="text" v-model="product.product_detail[0].neckline" class="form-input" />
            </div>
            <div class="form-group half">
              <label class="form-label">Kiểu tay</label>
              <input type="text" v-model="product.product_detail[0].sleeve_style" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Điểm nhấn & Lưu ý</label>
            <textarea class="form-textarea" rows="2" v-model="product.product_detail[0].highlight"
              placeholder="Nhập điểm nhấn sản phẩm..."></textarea>
          </div>
        </div>

      </div>

      <div class="col-right">

        <div class="card-box">
          <h4 class="card-title">Tổ chức hàng hóa</h4>

          <div class="form-group">
            <label class="form-label">Giá bán <span class="text-red">*</span></label>
            <div class="input-wrapper">
              <input type="number" v-model.number="product.price" class="form-input bold-text" placeholder="0" />
              <span class="input-suffix">₫</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Danh mục</label>
            <select class="form-input" v-model="product.categoryId">
              <option value="" disabled>-- Chọn danh mục --</option>
              <option value="40">BST Hè 2025</option>
              <option value="2">Áo Đông 2025</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Tồn kho tổng</label>
              <input type="number" v-model.number="product.stock" class="form-input" />
            </div>
            <div class="form-group half">
              <label class="form-label">Nhập hàng</label>
              <input type="number" v-model.number="product.quantity" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Khuyến mãi áp dụng</label>
            <div class="select-box-custom">
              <select class="form-input" v-model="product.discount_id">
                <option value="">Không áp dụng</option>
                <option v-for="item in discountList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="card-box mt-4">
          <h4 class="card-title">Thông tin sản xuất</h4>

          <div class="form-group">
            <label class="form-label">Xuất xứ</label>
            <input type="text" v-model="product.desc[0].country" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Đơn vị SX</label>
            <input type="text" v-model="product.desc[0].manufacturing_unit" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Năm SX</label>
            <input type="text" v-model="product.desc[0].create_year" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Cảnh báo</label>
            <textarea v-model="product.desc[0].warning_info" class="form-textarea" rows="2"></textarea>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const discountList = [
  { id: "KM01", name: "SALE 50% - Black Friday" },
  { id: "KM02", name: "Giảm 10% - Khách mới" },
];

const product = reactive({
  id: "",
  name: "",
  sku: "",
  price: null,
  stock: null,
  quantity: null,
  categoryId: "",
  discount_id: "",
  description: "",
  image: [{ id: "", url: "", preview: "" }],
  video: [{ video_id: "", video_url: "" }],
  variant: [{ size_id: "1", color_id: "1", quantity: 0 }],
  product_detail: [
    {
      id: "1",
      silhouette: "", sleeve_style: "", neckline: "", pant_leg_style: "",
      highlight: "", material: "", color: "", notice: "",
      video: [], image: [],
    },
  ],
  desc: [
    {
      warning_info: "", create_year: "", manufacturing_unit: "", country: "Việt Nam",
    },
  ],
  create_At: new Date().toLocaleDateString("vi-VN"),
  rate: "",
  comments: [],
});

const addVariant = () => product.variant.push({ size_id: "1", color_id: "1", quantity: 0 });
const removeVariant = (index) => product.variant.splice(index, 1);

const addImage = () => product.image.push({ id: "", url: "", preview: "" });
const removeImage = (index) => product.image.splice(index, 1);
const triggerFileUpload = () => addImage();
const onSelectImage = (event, index) => {
  const file = event.target.files[0];
  if (file) product.image[index].preview = URL.createObjectURL(file);
};

const addVideo = () => product.video.push({ video_id: "", video_url: "" });
const removeVideo = (index) => product.video.splice(index, 1);

const handleSubmit = () => {
  // Validate simple
  if (!product.name || !product.sku || !product.price) return alert("Vui lòng nhập các thông tin bắt buộc!");

  console.log("Submitting Product:", JSON.parse(JSON.stringify(product)));
  alert("Đã lưu sản phẩm thành công!");
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

.btn-sm-text {
  border: none;
  background: none;
  color: #2563eb;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.btn-sm-text:hover {
  text-decoration: underline;
}

.btn-dashed {
  width: 100%;
  border: 1px dashed #d1d5db;
  background: #fff;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-dashed:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
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

.mt-3 {
  margin-top: 15px;
}

.d-flex-between {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.d-flex-between .card-title {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
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

.form-row {
  display: flex;
  gap: 20px;
}

.half {
  flex: 1;
}

.bold-text {
  font-weight: 600;
}

.input-wrapper {
  position: relative;
}

.input-wrapper.full {
  width: 100%;
}

.input-wrapper .form-input {
  padding-right: 40px;
}

.input-wrapper .pl-40 {
  padding-left: 40px;
  padding-right: 12px;
}

.input-suffix {
  position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-left: 1px solid #d1d5db;
  border-radius: 0 8px 8px 0;
  color: #6b7280;
  font-weight: 600;
  font-size: 13px;
}

.input-prefix {
  position: absolute;
  left: 1px;
  top: 1px;
  bottom: 1px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 16px;
  z-index: 2;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.upload-box-mini {
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  font-size: 12px;
  gap: 4px;
  background: #f9fafb;
  transition: 0.2s;
}

.upload-box-mini:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.upload-box-mini i {
  font-size: 20px;
}

.media-item {
  position: relative;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-media {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
}

.btn-remove-media {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  cursor: pointer;
}

.variant-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.variant-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 40px;
  gap: 10px;
  background: #f9fafb;
  padding: 10px 15px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.variant-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 40px;
  gap: 10px;
  padding: 10px 15px;
  border-top: 1px solid #f3f4f6;
  align-items: center;
}

.variant-row .form-input.sm {
  padding: 6px 10px;
  font-size: 13px;
}

.btn-icon-trash {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.btn-icon-trash:hover {
  color: #ef4444;
}

.video-row {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  align-items: center;
}
</style>