<template>
  <div class="product-detail-container">
    
    <!-- PHẦN 1: THÔNG TIN CƠ BẢN (ẢNH + MUA HÀNG) -->
    <div class="top-section container">
      
      <!-- CỘT TRÁI: GALLERY ẢNH -->
      <div class="gallery-column">
        <!-- Ảnh chính -->
        <div class="main-image">
          <img :src="activeImage" alt="Main Product" />
          <button class="nav-btn prev" @click="prevImage">&lt;</button>
          <button class="nav-btn next" @click="nextImage">&gt;</button>
        </div>
        
        <!-- Thumbnails -->
        <div class="thumbnail-list">
          <div 
            v-for="(img, index) in productImages" 
            :key="index" 
            class="thumb-item" 
            :class="{ active: activeImage === img }"
            @click="activeImage = img"
          >
            <img :src="img" alt="thumbnail" />
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI: THÔNG TIN & MUA HÀNG -->
      <div class="info-column">
        <h1 class="product-title">OD4S439 - ÁO LEN LÔNG GHI</h1>
        <div class="sku">MSP: OD4S439</div>
        <div class="price">659,000 ₫</div>

        <div class="divider"></div>

        <!-- Màu sắc -->
        <div class="option-group">
          <label>Màu sắc</label>
          <div class="color-options">
            <div class="color-box active" style="background-color: #ddd;" title="Ghi đá"></div>
          </div>
        </div>

        <!-- Kích cỡ -->
        <div class="option-group">
          <label>Kích cỡ</label>
          <div class="size-options">
            <button 
              v-for="size in ['S', 'M', 'L']" 
              :key="size"
              :class="{ active: selectedSize === size }"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Số lượng -->
        <div class="option-group">
          <label>Số lượng</label>
          <div class="quantity-selector">
            <button @click="quantity > 1 ? quantity-- : null">-</button>
            <input type="text" v-model="quantity" readonly />
            <button @click="quantity++">+</button>
          </div>
        </div>

        <!-- Thông tin bổ sung -->
        <div class="meta-info">
          <p>◦ Thông tin cảnh báo: Không</p>
          <p>◦ Năm sản xuất: 2025 - Xu hướng 2026</p>
          <p>◦ Đơn vị sản xuất: Công ty TNHH SX & TM Tuấn Trang</p>
          <p>◦ Xuất xứ hàng hoá: Việt Nam</p>
        </div>

        <!-- Nút Mua -->
        <div class="action-buttons">
          <button class="btn-buy-now">MUA NGAY</button>
          <div class="sub-links">
            <a href="#">THAM CHIẾU SIZE</a>
            <a href="#">HƯỚNG DẪN SỬ DỤNG</a>
          </div>
        </div>

        <!-- Danh sách cửa hàng -->
        <div class="store-availability">
          <h3>DANH SÁCH CỬA HÀNG</h3>
          <select class="city-select">
            <option>- Tỉnh thành -</option>
            <option>Hà Nội</option>
          </select>
          
          <div class="store-list-box">
            <ul class="store-items">
              <li v-for="(store, idx) in stores" :key="idx">
                {{ store }} <span class="status">(Còn hàng)</span>
              </li>
            </ul>
            <!-- Thanh cuộn giả lập màu đỏ giống ảnh -->
            <div class="custom-scrollbar-track">
              <div class="custom-scrollbar-thumb"></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- PHẦN 2: CHI TIẾT SẢN PHẨM (TABS) -->
    <div class="details-section container">
      <div class="detail-tabs">
        <button class="tab-btn active">THÀNH PHẦN / CHI TIẾT SẢN PHẨM</button>
      </div>
      <div class="detail-content">
        <p>Thiết kế áo nằm trong BST Đông 2025 mới nhất từ Orchid. Sản phẩm mang đến cho người mặc vẻ đẹp thanh lịch, sang trọng nhưng không kém phần trẻ trung, nữ tính. Phù hợp mặc đi làm, dự tiệc, đi chơi, dạo phố...</p>
        <ul>
          <li>- Phom dáng: Phom dáng suông được thiết kế 1 lớp</li>
          <li>- Kiểu cổ: Cổ lọ</li>
          <li>- Kiểu tay: Tay dài bo gấu</li>
          <li>- Điểm nổi bật: Thiết kế cổ lọ với phần cổ cao giúp giữ ấm cơ thể tối đa kết hợp với kết cấu bo gấu ở tay áo và thân dưới áo không chỉ tăng khả năng giữ nhiệt mùa lạnh mà còn tôn vóc dáng thon gọn cho người mặc.</li>
          <li>- Màu sắc: Ghi đá</li>
          <li>- Chất liệu: Len lông thỏ dày dặn, giữ ấm tốt</li>
        </ul>
        <p class="note"><strong>LƯU Ý:</strong> Do điều kiện ánh sáng khác nhau, màu sắc hiển thị của sản phẩm trên Website có thể chênh lệch từ 3-5% so với màu sắc thực tế.</p>
        
        <!-- Ảnh trong bài viết -->
        <div class="content-images">
           <img :src="productImages[0]" alt="Detail 1" />
           <img :src="productImages[1]" alt="Detail 2" />
        </div>
      </div>
    </div>

    <!-- PHẦN 3: ĐÁNH GIÁ & SẢN PHẨM LIÊN QUAN -->
    <div class="bottom-section container">
      
      <!-- Đánh giá -->
      <div class="reviews-wrapper">
        <h3>Đánh giá sản phẩm</h3>
        <p class="no-rating">0 đánh giá</p>
        
        <div class="rating-box">
          <div class="score-col">
            <span class="score">0.0 / 5</span>
            <div class="stars">★★★★★</div>
          </div>
          <div class="progress-col">
             <div class="bar-row" v-for="i in 5" :key="i">
               <span>{{ 6 - i }} sao</span>
               <div class="progress-bg"><div class="progress-fill" style="width: 0%"></div></div>
               <span>(0)</span>
             </div>
          </div>
          <div class="btn-col">
             <button class="btn-login-rate">Đăng nhập để đánh giá</button>
          </div>
        </div>
      </div>

      <!-- Sản phẩm xem cùng -->
      <div class="related-products">
        <h2 class="section-title">SẢN PHẨM XEM CÙNG</h2>
        <div class="product-grid">
           <div v-for="prod in relatedProducts" :key="prod.id" class="product-card">
              <div class="card-image">
                <img :src="prod.image" :alt="prod.name" />
                <button class="btn-cart-icon">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </button>
              </div>
              <div class="card-info">
                 <div class="brand">Orchid</div>
                 <h4 class="name">{{ prod.name }}</h4>
                 <div class="price">{{ formatCurrency(prod.price) }}</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 1. DATA ẢNH SẢN PHẨM
// Sử dụng ảnh mẫu từ file bạn cung cấp hoặc placeholder
const demoImg = "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741";
const productImages = ref([
  demoImg,
  demoImg, // Giả lập nhiều ảnh
  demoImg,
  demoImg
]);

const activeImage = ref(productImages.value[0]);

const nextImage = () => {
  const idx = productImages.value.indexOf(activeImage.value);
  const nextIdx = (idx + 1) % productImages.value.length;
  activeImage.value = productImages.value[nextIdx];
};

const prevImage = () => {
  const idx = productImages.value.indexOf(activeImage.value);
  const prevIdx = (idx - 1 + productImages.value.length) % productImages.value.length;
  activeImage.value = productImages.value[prevIdx];
};

// 2. DATA MUA HÀNG
const selectedSize = ref('S');
const quantity = ref(1);

// 3. DATA CỬA HÀNG
const stores = ref([
  "199 Quỳnh Phụ", "18 Cao Bằng", "49 Xuân Mai", "205 Thạch Thất", 
  "278 Đô Lương", "225 Thái Bình", "15 Chúc Sơn", "93 Quốc Oai"
]);

// 4. DATA SẢN PHẨM LIÊN QUAN
const relatedProducts = ref([
  { id: 1, name: "OD4B494 - Áo cotton", price: 595000, image: demoImg },
  { id: 2, name: "OD4B453 - Áo nhung the", price: 599000, image: demoImg },
  { id: 3, name: "OD4B507 - Len lông thỏ", price: 595000, image: demoImg },
  { id: 4, name: "OD4S438 - Áo len thừng", price: 639000, image: demoImg },
]);

// Helper
const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}
</script>

<style scoped>
/* Font & Reset */
.product-detail-container {
  font-family: Arial, sans-serif;
  color: #333;
  padding-bottom: 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* --- PHẦN 1: TOP SECTION --- */
.top-section {
  display: flex;
  gap: 40px;
  margin-top: 20px;
  margin-bottom: 40px;
}

/* Cột trái: Gallery */
.gallery-column {
  flex: 1;
  /* width khoảng 50-60% */
}

.main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  margin-bottom: 15px;
  border: 1px solid #eee;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.6);
  border: 1px solid #ccc;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
}
.prev { left: 10px; }
.next { right: 10px; }

.thumbnail-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.thumb-item {
  width: 80px;
  height: 100px;
  border: 1px solid transparent;
  cursor: pointer;
}
.thumb-item.active { border-color: #000; }
.thumb-item img { width: 100%; height: 100%; object-fit: cover; }

/* Cột phải: Info */
.info-column {
  flex: 1;
  padding-left: 20px;
}

.product-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 5px 0;
  text-transform: uppercase;
}

.sku {
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
}

.price {
  font-size: 24px;
  font-weight: 500;
  color: #000;
  margin-bottom: 20px;
}

.divider {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.option-group {
  margin-bottom: 20px;
}
.option-group label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
}

/* Color */
.color-box {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  cursor: pointer;
  position: relative;
}
.color-box.active::after {
  content: "✓";
  position: absolute;
  bottom: 0; right: 0;
  font-size: 10px;
  color: #fff;
  background: #000;
  padding: 1px;
}

/* Size */
.size-options button {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  background: #fff;
  margin-right: 10px;
  cursor: pointer;
}
.size-options button.active {
  border-color: #000;
  font-weight: bold;
}

/* Quantity */
.quantity-selector {
  display: flex;
  width: 120px;
  height: 35px;
  border: 1px solid #ddd;
}
.quantity-selector button {
  width: 35px;
  border: none;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
}
.quantity-selector input {
  flex: 1;
  border: none;
  text-align: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

/* Meta Info */
.meta-info p {
  font-size: 13px;
  color: #333;
  margin: 5px 0;
}

/* Actions */
.action-buttons {
  margin-top: 25px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-buy-now {
  background: #000;
  color: #fff;
  border: none;
  padding: 15px 40px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
}

.sub-links {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sub-links a {
  font-size: 12px;
  color: #333;
  text-decoration: underline;
}

/* Store Availability (Scroll bar đỏ) */
.store-availability {
  margin-top: 30px;
}
.store-availability h3 {
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.city-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.store-list-box {
  border: 1px solid #eee;
  height: 200px; /* Chiều cao cố định */
  position: relative;
  overflow: hidden; /* Ẩn scroll mặc định */
}

.store-items {
  list-style: none;
  padding: 10px;
  margin: 0;
  height: 100%;
  overflow-y: auto; /* Cho phép scroll */
  padding-right: 15px; /* Chừa chỗ cho scrollbar giả */
}

/* Ẩn scrollbar mặc định của trình duyệt để hiện cái đỏ giả lập */
.store-items::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.store-items li {
  font-size: 13px;
  padding: 8px 0;
  border-bottom: 1px solid #f9f9f9;
}
.store-items li .status {
  color: red;
  font-weight: bold;
  font-size: 11px;
}

/* Thanh cuộn đỏ giả lập (Static Visual) */
.custom-scrollbar-track {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  background: #f0f0f0;
}
.custom-scrollbar-thumb {
  width: 100%;
  height: 30px; /* Chiều cao thumb */
  background: red;
  position: absolute;
  top: 20px; /* Vị trí demo */
}

/* --- PHẦN 2: CHI TIẾT SẢN PHẨM --- */
.details-section {
  border-top: 1px solid #ddd;
  padding-top: 30px;
  margin-bottom: 40px;
}

.detail-tabs {
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}
.tab-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-bottom: none;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  top: 1px;
}
.tab-btn.active {
  border-top: 2px solid #000;
}

.detail-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
.detail-content ul {
  list-style: none;
  padding: 0;
}
.detail-content li { margin-bottom: 5px; }
.note { font-style: italic; margin-top: 15px; }

.content-images {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.content-images img {
  width: 48%; /* Chia đôi */
  height: auto;
}

/* --- PHẦN 3: ĐÁNH GIÁ & LIÊN QUAN --- */
.bottom-section {
  background: #f9f9f9;
  padding: 30px 15px;
  margin-top: 40px;
}

.reviews-wrapper {
  background: #fff;
  padding: 20px;
  margin-bottom: 40px;
  border: 1px solid #eee;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 30px;
  border: 1px solid #eee;
  padding: 20px;
  margin-top: 15px;
}
.score-col { text-align: center; }
.score { font-size: 24px; font-weight: bold; }
.stars { color: #ccc; letter-spacing: 2px; }

.progress-col { flex: 1; }
.bar-row {
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 10px;
  margin-bottom: 5px;
}
.progress-bg {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
}
.btn-login-rate {
  background: #d0011b; /* Màu đỏ */
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
}

/* Sản phẩm liên quan */
.section-title {
  text-align: center;
  font-size: 18px;
  text-transform: uppercase;
  margin-bottom: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.product-card {
  background: #fff;
  border: 1px solid #eee;
  padding-bottom: 15px;
}
.card-image {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}
.card-image img { width: 100%; height: 100%; object-fit: cover; }
.btn-cart-icon {
  position: absolute;
  bottom: 10px; right: 10px;
  background: #000;
  border: none;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.card-info { padding: 10px; }
.brand { font-size: 10px; color: #999; text-transform: uppercase; }
.name { font-size: 14px; margin: 5px 0; font-weight: bold; }
.price { font-weight: bold; font-size: 14px; }

/* Responsive */
@media (max-width: 768px) {
  .top-section { flex-direction: column; }
  .rating-box { flex-direction: column; align-items: flex-start; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .content-images { flex-direction: column; }
  .content-images img { width: 100%; }
}
</style>