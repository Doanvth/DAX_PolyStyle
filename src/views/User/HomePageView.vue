<template>
    <div class="home-container">

        <!-- 1. HERO BANNER (SLIDER TỰ ĐỘNG) -->
        <section class="hero-banner">
            <div class="slider-container" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">

                <!-- Track chứa ảnh -->
                <div class="slider-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                    <div v-for="(banner, index) in banners" :key="index" class="slider-item">
                        <img :src="banner" alt="Banner Promotion" />
                    </div>
                </div>

                <!-- Nút điều hướng -->
                <button class="nav-btn prev" @click="prevSlide">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button class="nav-btn next" @click="nextSlide">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <!-- Dots chỉ dẫn -->
                <div class="dots-container">
                    <span v-for="(banner, index) in banners" :key="index" class="dot"
                        :class="{ active: currentIndex === index }" @click="goToSlide(index)"></span>
                </div>

            </div>
        </section>

        <!-- 2. SECTION: ÁO - ĐẦM - ÁO DÀI -->
        <section class="product-section container">

            <div class="section-header">
                <div class="tabs">
                    <button v-for="tab in tabsAo" :key="tab" :class="{ active: activeTabAo === tab }"
                        @click="activeTabAo = tab">
                        {{ tab }}
                    </button>
                </div>
                <a href="#" class="view-more">Xem thêm ></a>
            </div>

            <!-- Grid Sản Phẩm -->
            <router-link to="/ProductDetailPageView">
                <div class="product-grid">
                    <div v-for="product in productsAo" :key="product.id" class="product-card">
                        <div class="card-image">
                            <img :src="product.image" :alt="product.name" />
                            <!-- Đã bỏ hover-overlay "Xem nhanh" ở đây -->
                            <span class="tag-new">NEW</span>
                        </div>
                        <div class="card-info">
                            <div class="brand-logo">Orchid</div>
                            <h3 class="product-name">{{ product.name }}</h3>
                            <div class="price-row">
                                <span class="price">{{ formatCurrency(product.price) }}</span>
                                <button class="btn-add-cart">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </section>

        <!-- 3. SECTION: QUẦN - JUYP -->
        <section class="product-section container">
            <div class="section-header">
                <div class="tabs">
                    <button v-for="tab in tabsQuan" :key="tab" :class="{ active: activeTabQuan === tab }"
                        @click="activeTabQuan = tab">
                        {{ tab }}
                    </button>
                </div>
                <a href="#" class="view-more">Xem thêm ></a>
            </div>

            <div class="product-grid">
                <div v-for="product in productsQuan" :key="product.id" class="product-card">
                    <div class="card-image">
                        <img :src="product.image" :alt="product.name" />
                        <!-- Đã bỏ hover-overlay "Xem nhanh" ở đây -->
                    </div>
                    <div class="card-info">
                        <div class="brand-logo">Orchid</div>
                        <h3 class="product-name">{{ product.name }}</h3>
                        <div class="price-row">
                            <span class="price">{{ formatCurrency(product.price) }}</span>
                            <button class="btn-add-cart">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 4. SECTION: TIN TỨC -->
        <section class="news-section container">
            <div class="section-header no-border">
                <div class="tabs">
                    <button class="active">TIN TỨC</button>
                </div>
                <a href="#" class="view-more">Xem thêm ></a>
            </div>
            <div class="header-line"></div>

            <div class="news-layout">
                <!-- Tin lớn bên trái -->
                <div class="news-main">
                    <div class="news-img-wrapper">
                        <img :src="newsList[0].image" alt="Tin chính" />
                    </div>
                    <div class="news-content-main">
                        <h3>{{ newsList[0].title }}</h3>
                        <span class="date">{{ newsList[0].date }}</span>
                    </div>
                </div>

                <!-- List tin nhỏ bên phải -->
                <div class="news-list">
                    <div class="news-item" v-for="(news, idx) in newsList.slice(1)" :key="idx">
                        <img :src="news.image" alt="news thumb" />
                        <div class="news-text">
                            <h4>{{ news.title }}</h4>
                            <p>{{ news.desc }}</p>
                            <span class="date">{{ news.date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 5. SECTION: CỬA HÀNG -->
        <section class="store-section container">
            <h2 class="section-title">Tìm cửa hàng</h2>

            <div class="store-layout">
                <!-- Bản đồ -->
                <div class="map-area">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Hanoi_street_map.png"
                        alt="Map Demo" />
                    <button class="btn-map-large">Xem bản đồ lớn hơn</button>
                </div>

                <!-- Danh sách địa chỉ -->
                <div class="store-info">
                    <div class="dropdown-wrapper">
                        <label>Danh sách địa chỉ các cửa hàng</label>
                        <select>
                            <option>Cửa hàng</option>
                            <option>Hà Nội (12)</option>
                            <option>Hồ Chí Minh (5)</option>
                        </select>
                    </div>

                    <div class="store-list-scroll">
                        <div class="store-item">
                            <h3>Orchid Quang Trung CS2</h3>
                            <p><span>📍</span> Số 212A Quang Trung, phường Hà Đông, TP Hà Nội (ĐC cũ: Số 212A Quang
                                Trung, Q. Hà Đông, Hà Nội)</p>
                            <p><span>🕒</span> 9h00 - 22h00 (Kể cả chủ nhật và ngày lễ)</p>
                            <a href="#" class="directions">→ Chỉ đường</a>
                        </div>
                        <div class="store-item">
                            <h3>Orchid Quang Trung CS1</h3>
                            <p><span>📍</span> Số 504 Quang Trung, phường Dương Nội, TP Hà Nội</p>
                            <p><span>🕒</span> 9h00 - 22h00 (Kể cả chủ nhật và ngày lễ)</p>
                            <a href="#" class="directions">→ Chỉ đường</a>
                        </div>
                        <div class="store-item">
                            <h3>Orchid Phố Huế</h3>
                            <p><span>📍</span> 189 Phố Huế, Hai Bà Trưng, Hà Nội</p>
                            <p><span>🕒</span> 9h00 - 22h00 (Kể cả chủ nhật và ngày lễ)</p>
                            <a href="#" class="directions">→ Chỉ đường</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="spacer" style="height: 50px;"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- 1. SLIDER DATA & LOGIC ---
const banners = [
    "https://pos.nvncdn.com/af3c03-152482/bn/20251111_ZpQJ6M8Y.gif?v=1762835594",
    "https://pos.nvncdn.com/af3c03-152482/bn/20251027_yogb2yD2.gif?v=1761559786",
    "https://pos.nvncdn.com/af3c03-152482/bn/20250923_3cUU5tbu.gif?v=1758611925"
];

const currentIndex = ref(0);
let slideInterval = null;

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % banners.length;
};

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + banners.length) % banners.length;
};

const goToSlide = (index) => {
    currentIndex.value = index;
};

const startAutoPlay = () => {
    slideInterval = setInterval(nextSlide, 3000); // 3 giây chuyển 1 lần
};

const pauseAutoPlay = () => {
    if (slideInterval) clearInterval(slideInterval);
};

onMounted(() => startAutoPlay());
onUnmounted(() => pauseAutoPlay());

// --- 2. PRODUCT DATA ---
const tabsAo = ref(['ÁO', 'ĐẦM', 'ÁO DÀI']);
const activeTabAo = ref('ÁO');
const tabsQuan = ref(['QUẦN', 'JUYP']);
const activeTabQuan = ref('QUẦN');

// Ảnh demo chung
const demoImg = "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741";

const productsAo = ref([
    { id: 1, name: "OD4B494 - Áo cotton", price: 595000, image: demoImg },
    { id: 2, name: "OD4S439 - Áo len lông ghi", price: 659000, image: demoImg },
    { id: 3, name: "OD4B453 - Áo nhung the", price: 599000, image: demoImg },
    { id: 4, name: "OD4B507 - Len lông thỏ", price: 595000, image: demoImg },
]);

const productsQuan = ref([
    { id: 5, name: "OD7V294 - Quần len gân", price: 650000, image: demoImg },
    { id: 6, name: "OT7S089 - Quần trượt hàn", price: 650000, image: demoImg },
    { id: 7, name: "OT7S072 - Quần twill silk", price: 511200, image: demoImg },
    { id: 8, name: "OT7S016 - Quần chéo hàn", price: 440300, image: demoImg },
]);

// --- 3. NEWS DATA ---
const newsList = ref([
    {
        title: 'Dự báo thời tiết từ ngày 23 - 29/11: Không khí lạnh tràn về, gây rét và mưa to',
        desc: 'Tuần này, từ ngày 22 - 29/11, miền Bắc sẽ tiếp tục chịu ảnh hưởng của lốc không khí lạnh với lạnh...',
        date: '24-11-2025',
        image: "https://pos.nvncdn.com/af3c03-152482/art/20251124_oi4eDX4M.jpeg?v=1763957929"
    },
    {
        title: 'Bạn đã biết công thức "Đi bộ 6-6-6" với vô vàn lợi ích?',
        desc: 'Đi bộ 6-6-6 không phải là cuộc đua mà là hành trình...',
        date: '22-11-2025',
        image: "https://pos.nvncdn.com/af3c03-152482/art/20251122_FG6zAMZg.jpeg?v=1763779580"
    },
    {
        title: 'Giải mã hơi thở Retro qua dấu ấn biểu tượng thời trang',
        desc: 'Dù thời trang luôn thay đổi, retro vẫn giữ sức hút...',
        date: '21-11-2025',
        image: "https://pos.nvncdn.com/af3c03-152482/art/20251121_9ZJAaxeK.jpeg?v=1763694098"
    },
    {
        title: 'Chúc mừng Ngày Nhà giáo Việt Nam 20/11',
        desc: 'Nhân ngày nhà giáo VN 20/11, Orchid gửi lời tri ân...',
        date: '20-11-2025',
        image: demoImg
    }
]);

// Helper format tiền tệ
const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}
</script>

<style scoped>
/* --- GLOBAL STYLES --- */
.home-container {
    font-family: 'Arial', sans-serif;
    color: #333;
    background-color: #fff;
}

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 15px;
}

ul,
li {
    list-style: none;
    padding: 0;
    margin: 0;
}

a {
    text-decoration: none;
    color: inherit;
}

/* --- 1. HERO SLIDER CSS --- */
.hero-banner {
    width: 100%;
    margin-bottom: 50px;
    position: relative;
    overflow: hidden;
}

.slider-container {
    position: relative;
    width: 100%;
}

.slider-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
}

.slider-item {
    min-width: 100%;
    position: relative;
}

.slider-item img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
}

/* Nút Nav Prev/Next */
.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.4);
    color: #333;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    z-index: 10;
}

.nav-btn:hover {
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.prev {
    left: 20px;
}

.next {
    right: 20px;
}

/* Pagination Dots */
.dots-container {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
}

.dot {
    width: 10px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;
}

.dot.active {
    background-color: transparent;
    border-color: #fff;
    transform: scale(1.2);
}

/* --- 2 & 3. PRODUCT SECTIONS CSS --- */
.product-section {
    margin-bottom: 60px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.section-header.no-border {
    border-bottom: none;
    padding-bottom: 0;
}

.tabs button {
    background: none;
    border: none;
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
    margin-right: 30px;
    cursor: pointer;
    padding: 5px 0;
    color: #999;
    position: relative;
}

.tabs button.active {
    color: #000;
}

.tabs button.active::after {
    content: "";
    position: absolute;
    bottom: -11px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #333;
}

.view-more {
    font-size: 14px;
    color: #333;
    font-weight: bold;
}

/* Product Grid */
.product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.product-card {
    display: flex;
    flex-direction: column;
    transition: transform 0.3s;
}

.product-card:hover {
    transform: translateY(-5px);
}

.card-image {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
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
    transform: scale(1.05);
}

.tag-new {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #000;
    color: #fff;
    font-size: 10px;
    padding: 3px 6px;
    font-weight: bold;
}

/* Đã xóa .hover-overlay và .quick-view style */

.card-info {
    padding: 0 5px;
}

.brand-logo {
    font-size: 11px;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 5px;
    font-weight: bold;
}

.product-name {
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 10px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f0f0f0;
    padding-top: 10px;
}

.price {
    font-weight: bold;
    font-size: 15px;
    color: #000;
}

.btn-add-cart {
    background: #222;
    color: #fff;
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
}

.btn-add-cart:hover {
    background: #444;
}

/* --- 4. NEWS SECTION CSS --- */
.news-section {
    margin-bottom: 60px;
}

.header-line {
    border-top: 1px solid #000;
    margin-top: 5px;
    margin-bottom: 25px;
}

.news-layout {
    display: flex;
    gap: 30px;
}

.news-main {
    flex: 3;
    position: relative;
    overflow: hidden;
}

.news-img-wrapper {
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
}

.news-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.news-content-main {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 15px 20px;
}

.news-content-main h3 {
    margin: 0 0 5px 0;
    font-size: 18px;
    font-weight: bold;
}

.news-list {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.news-item {
    display: flex;
    gap: 15px;
}

.news-item img {
    width: 120px;
    height: 80px;
    object-fit: cover;
}

.news-text h4 {
    font-size: 14px;
    margin: 0 0 5px 0;
    line-height: 1.3;
}

.news-text p {
    font-size: 12px;
    color: #666;
    margin: 0 0 5px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.date {
    font-size: 11px;
    color: #999;
}

/* --- 5. STORE SECTION CSS --- */
.store-section {
    margin-bottom: 60px;
}

.section-title {
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 20px;
    border-left: 4px solid #000;
    padding-left: 10px;
}

.store-layout {
    display: flex;
    border: 1px solid #e5e5e5;
    height: 450px;
}

.map-area {
    flex: 2;
    position: relative;
    background-color: #f0f0f0;
    overflow: hidden;
}

.map-area img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.btn-map-large {
    position: absolute;
    top: 15px;
    left: 15px;
    background: #fff;
    border: 1px solid #ccc;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.store-info {
    flex: 1;
    padding: 25px;
    background: #fff;
    display: flex;
    flex-direction: column;
}

.dropdown-wrapper label {
    display: block;
    font-size: 13px;
    margin-bottom: 8px;
    color: #555;
    font-weight: bold;
}

.dropdown-wrapper select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
    outline: none;
}

.store-list-scroll {
    overflow-y: auto;
    flex: 1;
    padding-right: 5px;
}

/* Custom scrollbar */
.store-list-scroll::-webkit-scrollbar {
    width: 6px;
}

.store-list-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.store-list-scroll::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

.store-item {
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.store-item h3 {
    font-size: 15px;
    margin: 0 0 8px 0;
    color: #000;
    font-weight: bold;
}

.store-item p {
    font-size: 13px;
    color: #555;
    margin: 6px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;
}

.directions {
    font-size: 13px;
    color: #0088cc;
    font-weight: bold;
    display: inline-block;
    margin-top: 5px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .news-layout {
        flex-direction: column;
    }

    .store-layout {
        flex-direction: column;
        height: auto;
    }

    .map-area {
        height: 250px;
    }
}

@media (max-width: 480px) {
    .nav-btn {
        width: 30px;
        height: 30px;
    }

    .dots-container {
        bottom: 10px;
    }

    .tabs button {
        font-size: 14px;
        margin-right: 15px;
    }

    .section-title {
        font-size: 16px;
    }
}
</style>