<template>
  <!-- Loading overlay -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner">
      <i class="bi bi-arrow-clockwise"></i>
      <p>Đang xử lý...</p>
    </div>
  </div>

  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.go(-1)">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">
            {{ isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới" }}
          </h2>
          <p class="text-muted">Quản lý thông tin và thiết lập sản phẩm</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="$router.go(-1)">
          Hủy bỏ
        </button>
        <button
          class="btn-primary-custom"
          @click="handleSubmit"
          :disabled="isLoading"
        >
          <i class="bi bi-check2-circle"></i>
          {{ isLoading ? "Đang xử lý..." : "Lưu Sản Phẩm" }}
        </button>
      </div>
    </div>

    <div class="form-layout">
      <div class="col-left">
        <div class="card-box">
          <h4 class="card-title">Thông tin cơ bản</h4>

          <div class="form-group">
            <label class="form-label"
              >Tên sản phẩm <span class="text-red">*</span></label
            >
            <input
              type="text"
              v-model="product.name"
              class="form-input"
              placeholder="Ví dụ: Áo Thun Cotton Premium"
              :disabled="isLoading"
            />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label"
                >Mã SKU <span class="text-red">*</span></label
              >
              <input
                type="text"
                v-model="product.sku"
                class="form-input"
                placeholder="VD: SP001-2025"
                :disabled="isLoading"
              />
            </div>
            <div class="form-group half">
              <label class="form-label">Mô tả ngắn</label>
              <input
                type="text"
                class="form-input"
                placeholder="Nhập mô tả tổng quan..."
                v-model="product.description"
                :disabled="isLoading"
              />
            </div>
          </div>
        </div>

        <div class="card-box mt-4">
          <div class="d-flex-between">
            <h4 class="card-title">Thư viện ảnh & Video</h4>
            <button class="btn-sm-text" @click="addImage" :disabled="isLoading">
              + Thêm ảnh
            </button>
          </div>

          <div class="media-grid">
            <div
              class="upload-box-mini"
              @click="triggerFileUpload"
              :class="{ disabled: isLoading }"
            >
              <i class="bi bi-camera"></i>
              <span>Tải ảnh</span>
            </div>
            <div
              class="media-item"
              v-for="(img, index) in product.image"
              :key="'img' + index"
            >
              <img
                v-if="img.preview || img.url"
                :src="img.preview || img.url"
                class="media-img"
              />
              <div v-else class="empty-media"><i class="bi bi-image"></i></div>
              <button
                class="btn-remove-media"
                @click="removeImage(index)"
                :disabled="isLoading"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>

          <div class="video-section mt-3">
            <label class="form-label">Video URL</label>
            <div
              class="video-row"
              v-for="(vid, index) in product.video"
              :key="'vid' + index"
            >
              <div class="input-wrapper full">
                <span class="input-prefix"
                  ><i class="bi bi-play-circle"></i
                ></span>
                <input
                  type="text"
                  v-model="vid.video_url"
                  class="form-input pl-40"
                  placeholder="https://youtube.com/..."
                  :disabled="isLoading"
                />
              </div>
              <button
                class="btn-icon-trash"
                @click="removeVideo(index)"
                :disabled="isLoading"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <button
              class="btn-dashed mt-2"
              @click="addVideo"
              :disabled="isLoading"
            >
              + Thêm dòng video
            </button>
          </div>
        </div>

        <div class="card-box mt-4">
          <div class="d-flex-between">
            <h4 class="card-title">Phân loại hàng (Biến thể)</h4>
            <button
              class="btn-sm-text"
              @click="addVariant"
              :disabled="isLoading"
            >
              + Thêm biến thể
            </button>
          </div>

          <div class="variant-list">
            <div class="variant-header">
              <span>Size</span>
              <span>Màu sắc</span>
              <span>Số lượng</span>
              <span class="w-40"></span>
            </div>
            <div
              class="variant-row"
              v-for="(item, index) in product.variant"
              :key="index"
            >
              <select
                class="form-input sm"
                v-model="item.size_id"
                :disabled="isLoading"
              >
                <option value="1">S</option>
                <option value="2">M</option>
                <option value="3">L</option>
                <option value="4">XL</option>
              </select>
              <select
                class="form-input sm"
                v-model="item.color_id"
                :disabled="isLoading"
              >
                <option value="1">Đỏ</option>
                <option value="3">Đen</option>
                <option value="5">Ghi</option>
              </select>
              <input
                type="number"
                class="form-input sm"
                v-model="item.quantity"
                placeholder="0"
                :disabled="isLoading"
              />
              <button
                class="btn-icon-trash"
                @click="removeVariant(index)"
                :disabled="isLoading"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="card-box mt-4">
          <h4 class="card-title">Chi tiết thiết kế</h4>
          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Phom dáng</label>
              <input
                type="text"
                v-model="product.product_detail[0].silhouette"
                class="form-input"
                placeholder="VD: Slim fit"
                :disabled="isLoading"
              />
            </div>
            <div class="form-group half">
              <label class="form-label">Chất liệu</label>
              <input
                type="text"
                v-model="product.product_detail[0].material"
                class="form-input"
                placeholder="VD: 100% Cotton"
                :disabled="isLoading"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Kiểu cổ</label>
              <input
                type="text"
                v-model="product.product_detail[0].neckline"
                class="form-input"
                :disabled="isLoading"
              />
            </div>
            <div class="form-group half">
              <label class="form-label">Kiểu tay</label>
              <input
                type="text"
                v-model="product.product_detail[0].sleeve_style"
                class="form-input"
                :disabled="isLoading"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Điểm nhấn & Lưu ý</label>
            <textarea
              class="form-textarea"
              rows="2"
              v-model="product.product_detail[0].highlight"
              placeholder="Nhập điểm nhấn sản phẩm..."
              :disabled="isLoading"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="card-box">
          <h4 class="card-title">Tổ chức hàng hóa</h4>

          <div class="form-group">
            <label class="form-label"
              >Giá bán <span class="text-red">*</span></label
            >
            <div class="input-wrapper">
              <input
                type="number"
                v-model.number="product.price"
                class="form-input bold-text"
                placeholder="0"
                :disabled="isLoading"
              />
              <span class="input-suffix">₫</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Danh mục</label>
            <select
              class="form-input"
              v-model="product.categoryId"
              :disabled="isLoading"
            >
              <option value="" disabled>-- Chọn danh mục --</option>
              <option value="40">BST Hè 2025</option>
              <option value="2">Áo Đông 2025</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">Tồn kho tổng</label>
              <input
                type="number"
                v-model.number="product.stock"
                class="form-input"
                :disabled="isLoading"
              />
            </div>
            <div class="form-group half">
              <label class="form-label">Nhập hàng</label>
              <input
                type="number"
                v-model.number="product.quantity"
                class="form-input"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Khuyến mãi áp dụng</label>
            <div class="select-box-custom">
              <select
                class="form-input"
                v-model="product.discount_id"
                :disabled="isLoading"
              >
                <option value="">Không áp dụng</option>
                <option
                  v-for="item in discountList"
                  :key="item.id"
                  :value="item.id"
                >
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
            <input
              type="text"
              v-model="product.desc[0].country"
              class="form-input"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Đơn vị SX</label>
            <input
              type="text"
              v-model="product.desc[0].manufacturing_unit"
              class="form-input"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Năm SX</label>
            <input
              type="text"
              v-model="product.desc[0].create_year"
              class="form-input"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Cảnh báo</label>
            <textarea
              v-model="product.desc[0].warning_info"
              class="form-textarea"
              rows="2"
              :disabled="isLoading"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Hidden file input for image upload -->
  <input
    type="file"
    ref="fileInput"
    accept="image/*"
    multiple
    style="display: none"
    @change="onFileSelect"
  />
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const props = defineProps({
  isEdit: Boolean,
  id: String,
});

const CLOUD_NAME = "dm623a8ue";
const UPLOAD_PRESET = "DAX_BE";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const API_BASE_URL = "http://localhost:3000";
const isLoading = ref(false);
const errorMessage = ref("");
const fileInput = ref(null);
const imagesToDelete = ref([]);

// Thêm các ref để lưu dữ liệu từ API
const sizeList = ref([]);
const colorList = ref([]);
const categoriesList = ref([]);
const discountList = ref([]); // Thay thế discountList hardcoded

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
  image: [{ id: "", url: "", preview: "", public_id: "" }],
  video: [{ video_id: "", video_url: "" }],
  variant: [{ size_id: "", color_id: "", quantity: 0 }], // Để rỗng thay vì "1"
  product_detail: [
    {
      id: "",
      silhouette: "",
      sleeve_style: "",
      neckline: "",
      pant_leg_style: "",
      highlight: "",
      material: "",
      color: "",
      notice: "",
      video: [],
      image: [],
    },
  ],
  desc: [
    {
      warning_info: "",
      create_year: "",
      manufacturing_unit: "",
      country: "Việt Nam",
    },
  ],
  create_At: new Date().toLocaleDateString("vi-VN"),
  rate: "",
  comments: [],
});

// ==================== FETCH DROPDOWN DATA ====================

// Fetch tất cả dữ liệu dropdown
const fetchDropdownData = async () => {
  try {
    // Fetch dữ liệu từ các endpoint song song
    const [sizesRes, colorsRes, categoriesRes, discountsRes] =
      await Promise.all([
        axios.get(`${API_BASE_URL}/size`),
        axios.get(`${API_BASE_URL}/color`),
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/discount`),
      ]);

    sizeList.value = sizesRes.data || [];
    colorList.value = colorsRes.data || [];
    categoriesList.value = categoriesRes.data || [];
    discountList.value = discountsRes.data || [];

    console.log("Dropdown data loaded:", {
      sizes: sizeList.value.length,
      colors: colorList.value.length,
      categories: categoriesList.value.length,
      discounts: discountList.value.length,
    });
  } catch (error) {
    console.error("Error fetching dropdown data:", error);

    // Fallback data nếu API lỗi
    sizeList.value = [
      { id: "1", name: "S" },
      { id: "2", name: "M" },
      { id: "3", name: "L" },
      { id: "4", name: "XL" },
    ];

    colorList.value = [
      { id: "1", name: "Đỏ" },
      { id: "2", name: "Trắng" },
      { id: "3", name: "Đen" },
      { id: "4", name: "Trắng/Đen" },
      { id: "5", name: "Ghi" },
    ];

    categoriesList.value = [
      { id: "40", name: "BST Hè 2025" },
      { id: "2", name: "Áo Đông 2025" },
    ];

    discountList.value = [
      { id: "KM01", name: "SALE 50% - Black Friday" },
      { id: "KM02", name: "Giảm 10% - Khách mới" },
    ];
  }
};

// ==================== CLOUDINARY FUNCTIONS ====================

// Upload ảnh lên Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "products");
    formData.append("cloud_name", CLOUD_NAME);

    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    return {
      url: response.data.secure_url,
      public_id: response.data.public_id,
      format: response.data.format,
      bytes: response.data.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(
      `Upload thất bại: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

// Xóa ảnh từ Cloudinary thông qua backend
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/cloudinary/delete`, {
      data: { public_id: publicId },
    });
    console.log(`Đã xóa ảnh: ${publicId}`);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

// Xóa nhiều ảnh cùng lúc
const deleteMultipleImages = async (publicIds) => {
  if (!publicIds.length) return;

  try {
    await axios.post(`${API_BASE_URL}/api/cloudinary/delete-multiple`, {
      public_ids: publicIds,
    });
    console.log(`Đã xóa ${publicIds.length} ảnh`);
  } catch (error) {
    console.error("Error deleting multiple images:", error);
  }
};

// ==================== IMAGE HANDLING ====================

// Kích hoạt file input
const triggerFileUpload = () => {
  if (isLoading.value) return;
  fileInput.value.click();
};

// Xử lý chọn file
const onFileSelect = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  try {
    isLoading.value = true;

    // Upload từng file một
    for (const file of files) {
      // Validate file
      if (!file.type.startsWith("image/")) {
        alert(`File ${file.name} không phải là ảnh`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} vượt quá 10MB`);
        continue;
      }

      // Tạo preview
      const previewUrl = URL.createObjectURL(file);

      // Upload lên Cloudinary
      const uploadResult = await uploadToCloudinary(file);

      // Thêm vào danh sách ảnh
      product.image.push({
        id: generateId(),
        url: uploadResult.url,
        preview: previewUrl,
        public_id: uploadResult.public_id,
      });
    }

    // Reset file input
    event.target.value = "";
  } catch (error) {
    console.error("Upload error:", error);
    alert(error.message || "Upload ảnh thất bại");
  } finally {
    isLoading.value = false;
  }
};

// Xóa ảnh
const removeImage = async (index) => {
  if (isLoading.value) return;

  const image = product.image[index];

  // Nếu có public_id, thêm vào danh sách xóa
  if (image.public_id) {
    imagesToDelete.value.push(image.public_id);
  }

  // Giải phóng URL preview nếu có
  if (image.preview && image.preview.startsWith("blob:")) {
    URL.revokeObjectURL(image.preview);
  }

  // Xóa khỏi mảng
  product.image.splice(index, 1);

  // Nếu không còn ảnh nào, thêm một item trống
  if (product.image.length === 0) {
    product.image.push({ id: "", url: "", preview: "", public_id: "" });
  }
};

// Thêm ảnh trống
const addImage = () => {
  product.image.push({ id: "", url: "", preview: "", public_id: "" });
};

// ==================== PRODUCT FUNCTIONS ====================

// Fetch product data
const fetchProductData = async () => {
  if (props.isEdit && props.id) {
    try {
      isLoading.value = true;
      const response = await axios.get(`${API_BASE_URL}/products/${props.id}`);
      const productData = response.data;

      // Basic info
      product.id = productData.id || "";
      product.name = productData.name || "";
      product.sku = productData.sku || "";
      product.description = productData.description || "";
      product.price = productData.price || null;
      product.categoryId = productData.categoryId || "";
      product.stock = productData.stock || null;
      product.quantity = productData.quantity || null;
      product.discount_id = productData.discount_id || "";

      // Images with public_id
      if (Array.isArray(productData.image)) {
        product.image = productData.image.map((img) => ({
          id: img.id || "",
          url: img.url || "",
          preview: img.url || "",
          public_id: img.public_id || "",
        }));
      }

      // Video
      if (Array.isArray(productData.video)) {
        product.video = productData.video.map((vid) => ({
          video_id: vid.video_id || "",
          video_url: vid.video_url || "",
        }));
      }

      // Variants - cần convert string id sang đúng format
      if (Array.isArray(productData.variant)) {
        product.variant = productData.variant.map((varItem) => ({
          size_id: varItem.size_id?.toString() || "",
          color_id: varItem.color_id?.toString() || "",
          quantity: varItem.quantity || 0,
        }));
      }

      // Product detail
      if (
        Array.isArray(productData.product_detail) &&
        productData.product_detail.length > 0
      ) {
        const detail = productData.product_detail[0];
        product.product_detail[0] = {
          id: detail.id || "1",
          silhouette: detail.silhouette || "",
          sleeve_style: detail.sleeve_style || "",
          neckline: detail.neckline || "",
          pant_leg_style: detail.pant_leg_style || "",
          highlight: detail.highlight || "",
          material: detail.material || "",
          color: detail.color || "",
          notice: detail.notice || "",
          video: Array.isArray(detail.video) ? detail.video : [],
          image: Array.isArray(detail.image) ? detail.image : [],
        };
      }

      if (Array.isArray(productData.desc) && productData.desc.length > 0) {
        const descItem = productData.desc[0];
        product.desc[0] = {
          warning_info: descItem.warning_info || "",
          create_year: descItem.create_year || "",
          manufacturing_unit: descItem.manufacturing_unit || "",
          country: descItem.country || "Việt Nam",
        };
      }

      product.rate = productData.rate || "";
      product.comments = Array.isArray(productData.comments)
        ? productData.comments
        : [];
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Không thể tải thông tin sản phẩm");
    } finally {
      isLoading.value = false;
    }
  }
};

// Validate form
const validateForm = () => {
  if (!product.name.trim()) {
    errorMessage.value = "Vui lòng nhập tên sản phẩm";
    return false;
  }
  if (!product.sku.trim()) {
    errorMessage.value = "Vui lòng nhập mã SKU";
    return false;
  }
  if (!product.price || product.price <= 0) {
    errorMessage.value = "Vui lòng nhập giá bán hợp lệ";
    return false;
  }
  if (!product.categoryId) {
    errorMessage.value = "Vui lòng chọn danh mục";
    return false;
  }

  // Validate variant
  for (let i = 0; i < product.variant.length; i++) {
    const variant = product.variant[i];
    if (!variant.size_id) {
      errorMessage.value = `Vui lòng chọn size cho biến thể ${i + 1}`;
      return false;
    }
    if (!variant.color_id) {
      errorMessage.value = `Vui lòng chọn màu cho biến thể ${i + 1}`;
      return false;
    }
  }

  const hasValidImages = product.image.some((img) => img.url || img.preview);
  if (!hasValidImages) {
    errorMessage.value = "Vui lòng thêm ít nhất một ảnh sản phẩm";
    return false;
  }

  return true;
};

// Prepare data for API - cần chuyển đổi id sang số
const prepareProductData = () => {
  const validImages = product.image.filter((img) => img.url || img.preview);

  return {
    id: product.id || generateProductId(),
    name: product.name.trim(),
    sku: product.sku.trim(),
    price: Number(product.price),
    stock: Number(product.stock) || 0,
    quantity: Number(product.quantity) || 0,
    categoryId: product.categoryId,
    discount_id: product.discount_id || null,
    description: product.description.trim(),
    image: validImages.map((img) => ({
      id: img.id || generateId(),
      url: img.url || img.preview,
      public_id: img.public_id || "",
    })),
    video: product.video
      .filter((vid) => vid.video_url.trim())
      .map((vid) => ({
        video_id: vid.video_id || generateId(),
        video_url: vid.video_url.trim(),
      })),
    variant: product.variant.map((variant) => ({
      size_id: Number(variant.size_id) || null,
      color_id: Number(variant.color_id) || null,
      quantity: Number(variant.quantity) || 0,
    })),
    product_detail: [
      {
        id: product.product_detail[0].id || generateId(),
        silhouette: product.product_detail[0].silhouette || "",
        sleeve_style: product.product_detail[0].sleeve_style || "",
        neckline: product.product_detail[0].neckline || "",
        pant_leg_style: product.product_detail[0].pant_leg_style || "",
        highlight: product.product_detail[0].highlight || "",
        material: product.product_detail[0].material || "",
        color: product.product_detail[0].color || "",
        notice: product.product_detail[0].notice || "",
        video: product.product_detail[0].video || [],
        image: product.product_detail[0].image || [],
      },
    ],
    desc: [
      {
        warning_info: product.desc[0].warning_info || "",
        create_year: product.desc[0].create_year || "",
        manufacturing_unit: product.desc[0].manufacturing_unit || "",
        country: product.desc[0].country || "Việt Nam",
      },
    ],
    create_At: product.create_At || new Date().toISOString(),
    rate: product.rate || "0",
    comments: product.comments || [],
  };
};

// Handle submit
const handleSubmit = async () => {
  if (!validateForm()) {
    alert(errorMessage.value);
    return;
  }

  try {
    isLoading.value = true;

    if (imagesToDelete.value.length > 0) {
      await deleteMultipleImages(imagesToDelete.value);
    }

    const productData = prepareProductData();

    if (props.isEdit && props.id) {
      await axios.put(`${API_BASE_URL}/products/${props.id}`, productData);
      alert("Cập nhật sản phẩm thành công!");
    } else {
      await axios.post(`${API_BASE_URL}/products`, productData);
      alert("Thêm sản phẩm mới thành công!");
    }

    imagesToDelete.value = [];
    router.push("/admin/products");
  } catch (error) {
    console.error("Submit error:", error);

    let message = "Đã xảy ra lỗi khi lưu sản phẩm";
    if (error.response) {
      message =
        error.response.data?.message || `Lỗi server (${error.response.status})`;
    } else if (error.request) {
      message = "Không thể kết nối đến server";
    }

    alert(`Lỗi: ${message}`);
  } finally {
    isLoading.value = false;
  }
};

const generateProductId = () => {
  return `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const generateId = () => {
  return `ID-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

// ==================== VARIANT & VIDEO FUNCTIONS ====================

const addVariant = () => {
  product.variant.push({ size_id: "", color_id: "", quantity: 0 });
};

const removeVariant = (index) => {
  product.variant.splice(index, 1);
};

const addVideo = () => {
  product.video.push({ video_id: "", video_url: "" });
};

const removeVideo = (index) => {
  product.video.splice(index, 1);
};

// ==================== LIFECYCLE HOOKS ====================

onMounted(async () => {
  // Load dropdown data trước
  await fetchDropdownData();

  // Sau đó mới load product data nếu có
  if (props.isEdit && props.id) {
    await fetchProductData();
  }
});

onUnmounted(() => {
  product.image.forEach((img) => {
    if (img.preview && img.preview.startsWith("blob:")) {
      URL.revokeObjectURL(img.preview);
    }
  });
});
</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
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

.btn-back:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.btn-primary-custom:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-primary-custom:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.btn-outline-custom:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-outline-custom:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm-text {
  border: none;
  background: none;
  color: #2563eb;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.btn-sm-text:hover:not(:disabled) {
  text-decoration: underline;
}

.btn-sm-text:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.btn-dashed:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.btn-dashed:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.form-input:disabled,
.form-textarea:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
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

.upload-box-mini:hover:not(.disabled) {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.upload-box-mini.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  background-color: #f3f4f6;
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
  font-size: 12px;
}

.btn-remove-media:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
}

.btn-remove-media:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  align-items: center;
}

.btn-icon-trash:hover:not(:disabled) {
  color: #ef4444;
}

.btn-icon-trash:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.video-row {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  align-items: center;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  flex-direction: column;
  gap: 15px;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner i {
  font-size: 40px;
  color: #2563eb;
  animation: spin 1s linear infinite;
}

.loading-spinner p {
  margin-top: 10px;
  color: #4b5563;
  font-weight: 500;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Error message */
.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 10px;
  padding: 10px;
  background: #fee;
  border-radius: 6px;
  border-left: 4px solid #ef4444;
}

.w-40 {
  width: 40px;
}

.text-center {
  text-align: center;
}

.font-monospace {
  font-family: monospace;
}

.bg-success {
  background: #10b981;
}

.bg-gray {
  background: #9ca3af;
}
</style>
