<template>
  <div class="container">
    <h1 class="page-title">TIN TỨC</h1>

    <div class="news-grid">
      <div 
        v-for="item in paginatedNews" 
        :key="item.id" 
        class="news-card"
      >
        <div class="card-image">
          <img :src="item.image" :alt="item.title" />
        </div>

        <div class="card-body">
          <h3 class="news-title">{{ item.title }}</h3>
          <p class="news-date">{{ item.date }}</p>
          <p class="news-desc">{{ item.desc }}</p>
        </div>

        <div class="card-footer">
          <button class="btn-share">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Chia sẻ
          </button>
          
          <a href="#" class="btn-detail">Chi tiết</a>
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
        v-for="page in visiblePages" 
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

// --- 1. DỮ LIỆU ---
const newsList = ref([]);
const itemsPerPage = 9; // Hiển thị 9 tin (3 hàng x 3 cột) mỗi trang
const currentPage = ref(1);

// Các link ảnh bạn cung cấp
const images = [
  "https://pos.nvncdn.com/af3c03-152482/art/20251124_oi4eDX4M.jpeg?v=1763957929", // Ảnh xe máy mưa
  "https://pos.nvncdn.com/af3c03-152482/art/20251122_FG6zAMZg.jpeg?v=1763779580", // Ảnh đi bộ
  "https://pos.nvncdn.com/af3c03-152482/art/20251121_9ZJAaxeK.jpeg?v=1763694098"  // Ảnh retro
];

// Hàm tạo dữ liệu giả lập giống ảnh
const generateData = () => {
  const titles = [
    "Dự báo thời tiết từ ngày 22 - 29/11: Không khí lạnh về, gây rét",
    "Bạn đã biết công thức 'Đi bộ 6-6-6' với vô vàn lợi ích cho sức khỏe?",
    "Giải mã hơi thở Retro qua dấu ấn của bốn biểu tượng thời trang",
    "Chúc mừng Ngày Nhà giáo Việt Nam 20/11 - Tri ân thầy cô",
    "Black Friday - Mua tới đâu giảm sâu tới đó: Ưu đãi 50%",
    "Hoa nở trong sương giá cùng BST Thu Đông mới nhất",
    "Dẫn lối cá tính qua các bộ sưu tập Tuần Lễ Thời Trang 2025"
  ];

  const descriptions = [
    "Tuần này, từ ngày 22 - 29/11, miền Bắc sẽ tiếp tục chịu ảnh hưởng của lốc không khí lạnh với lạnh. Trong khi đó, miền Trung có khả năng mưa lớn...",
    "Đi bộ 6-6-6 không phải là cuộc đua mà là hành trình nuôi dưỡng sức khỏe, phục hồi tinh thần và tạo nên một lối sống lành mạnh, lâu dài...",
    "Dù thời trang luôn thay đổi, retro vẫn giữ sức hút bởi một điều chính đơn giản cho phép mỗi người tìm lại bản sắc của chính mình...",
    "Giáo dục không chỉ là lớp, nghĩa giáo là hành trình gieo mầm vì những mầm xanh... chính là chúng ta.",
  ];

  const data = [];
  for (let i = 1; i <= 45; i++) { // Tạo 45 bài tin tức
    const randTitle = titles[i % titles.length];
    const randDesc = descriptions[i % descriptions.length];
    const randImg = images[i % images.length];

    data.push({
      id: i,
      title: randTitle,
      date: `2${i % 9}-11-2025`, // Giả lập ngày tháng 11/2025
      desc: randDesc,
      image: randImg
    });
  }
  newsList.value = data;
};

onMounted(() => {
  generateData();
});

// --- 2. LOGIC PHÂN TRANG ---
const totalPages = computed(() => Math.ceil(newsList.value.length / itemsPerPage));

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return newsList.value.slice(start, end);
});

// Logic hiển thị nút phân trang (nếu quá nhiều trang thì chỉ hiện một số)
const visiblePages = computed(() => {
  let pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages; // Ở đây mình return hết, nếu muốn rút gọn (1,2...5,6) cần logic phức tạp hơn chút
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<style scoped>
/* Google Font tương tự */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 15px;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

.page-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 40px;
  letter-spacing: 1px;
}

/* --- GRID LAYOUT --- */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cột */
  gap: 30px;
  margin-bottom: 50px;
}

/* --- CARD STYLE --- */
.news-card {
  border: 1px solid #eee; /* Viền mờ bao quanh */
  display: flex;
  flex-direction: column;
  background: #fff;
  transition: box-shadow 0.3s;
}

.news-card:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.card-image {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .card-image img {
  transform: scale(1.05);
}

.card-body {
  padding: 20px;
  flex: 1; /* Để đẩy footer xuống đáy */
}

.news-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.4;
  /* Giới hạn 2 dòng tiêu đề */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.news-desc {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
  margin: 0;
  /* Giới hạn 3 dòng mô tả */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- FOOTER CARD --- */
.card-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-share {
  background: none;
  border: none;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-share svg {
  color: #777;
}

.btn-share:hover {
  color: #000;
}

.btn-detail {
  font-size: 12px;
  color: #777;
  text-decoration: none;
}

.btn-detail:hover {
  text-decoration: underline;
  color: #000;
}

/* --- PAGINATION --- */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.page-btn {
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: #555;
}

.page-btn:hover:not(:disabled) {
  border-color: #333;
  color: #000;
}

.page-btn.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

.page-btn:disabled {
  background: #f9f9f9;
  color: #ccc;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 992px) {
  .news-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .news-grid { grid-template-columns: 1fr; }
}
</style>