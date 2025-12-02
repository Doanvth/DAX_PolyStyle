<template>
  <div class="container">
    <div class="filter-bar">
      <div class="dropdown">
        <span>KHOẢNG GIÁ</span>
        <i class="arrow-down"></i>
      </div>
      <div class="dropdown">
        <span>SIZE SỐ</span>
        <i class="arrow-down"></i>
      </div>
      <div class="dropdown">
        <span>MÀU SẮC</span>
        <i class="arrow-down"></i>
      </div>
    </div>

    <div class="product-grid">
      <div 
        v-for="product in paginatedProducts" 
        :key="product.id" 
        class="product-card"
      >
        <div class="card-image">
          <img :src="product.image" :alt="product.name" />
          <span v-if="product.id % 3 === 0" class="tag-new">NEW</span>
        </div>

        <div class="card-info">
          <div class="brand-row">
            <span class="brand-name">Orchid</span>
            <span class="product-code">{{ product.code }}</span>
          </div>
          
          <h3 class="product-name">{{ product.name }}</h3>
          
          <div class="price-action-row">
            <span class="price">{{ formatCurrency(product.price) }}</span>
            <button class="btn-cart" @click="addToCart(product)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button 
        class="page-btn prev" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        &lt;
      </button>

      <button 
        v-for="page in totalPages" 
        :key="page"
        class="page-btn"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button 
        class="page-btn next" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// --- 1. DATA GIẢ LẬP ---
const allProducts = ref([]);

// Hàm tạo dữ liệu giả (40 sản phẩm)
const generateData = () => {
  const sampleNames = [
    "Bộ tweed gạo hàn", "Juyp text hàn", "Bộ len gân", "Dạ tweed kẻ", 
    "Đầm nhung the", "Áo sơ mi lụa", "Quần âu ống suông", "Áo khoác măng tô"
  ];
  const sampleImage = "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741"; // Ảnh mẫu

  const data = [];
  for (let i = 1; i <= 40; i++) {
    // Chọn ngẫu nhiên tên và giá
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomPrice = Math.floor(Math.random() * (2000000 - 500000) + 500000); // 500k - 2tr
    
    data.push({
      id: i,
      code: `OD${100 + i}AB${500 + i}`, // Mã SP giả: OD101AB501
      name: `${randomName} - Mã ${i}`,
      price: randomPrice,
      image: sampleImage
    });
  }
  allProducts.value = data;
};

// Gọi hàm tạo data khi component load
onMounted(() => {
  generateData();
});

// --- 2. LOGIC PHÂN TRANG ---
const currentPage = ref(1);
const itemsPerPage = 8; // Số sản phẩm mỗi trang (4 cột x 2 hàng)

const totalPages = computed(() => {
  return Math.ceil(allProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allProducts.value.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Cuộn lên đầu trang khi bấm chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// --- 3. HELPER FUNCTION ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const addToCart = (product) => {
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
};
</script>

<style scoped>
/* Reset cơ bản */
* { box-sizing: border-box; }
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

/* --- FILTER BAR --- */
.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.dropdown {
  border: 1px solid #ddd;
  padding: 10px 15px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  transition: border-color 0.3s;
}

.dropdown:hover {
  border-color: #000;
}

.arrow-down {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #333;
}

/* --- PRODUCT GRID --- */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 cột giống ảnh */
  gap: 30px;
  margin-bottom: 50px;
}

.product-card {
  display: flex;
  flex-direction: column;
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3; /* Tỷ lệ ảnh dọc */
  overflow: hidden;
  margin-bottom: 12px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .card-image img {
  transform: scale(1.05); /* Hiệu ứng zoom nhẹ khi hover */
}

.tag-new {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #000;
  color: #fff;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
}

/* INFO AREA */
.card-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.brand-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.brand-name {
  font-family: serif; /* Font chữ kiểu logo Orchid */
  font-weight: bold;
  font-size: 14px;
}

.product-code {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 15px 0;
  line-height: 1.4;
  height: 40px; /* Cố định chiều cao tên để thẳng hàng */
  overflow: hidden;
}

.price-action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  border-top: 1px solid #eee; /* Đường kẻ mờ phía trên giá giống ảnh */
  padding-top: 10px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #000;
}

.btn-cart {
  background-color: #000;
  border: none;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px; /* Bo góc nhẹ giống ảnh */
  transition: background 0.3s;
}

.btn-cart:hover {
  background-color: #444;
}

/* --- PAGINATION --- */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #000;
  color: #000;
}

.page-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.page-btn:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .filter-bar { overflow-x: auto; padding-bottom: 10px; }
}
</style>