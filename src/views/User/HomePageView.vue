<template>
    <div class="home-container">

        <section class="hero-banner" v-if="banners.length > 0">
            <div class="slider-container" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">

                <div class="slider-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                    <div v-for="(banner, index) in banners" :key="index" class="slider-item">
                        <a :href="banner.link" target="_blank" class="banner-link">
                            <img :src="banner.url" :alt="banner.title" />
                        </a>
                    </div>
                </div>

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

                <div class="dots-container">
                    <span v-for="(banner, index) in banners" :key="index" class="dot"
                        :class="{ active: currentIndex === index }" @click="goToSlide(index)"></span>
                </div>

            </div>
        </section>

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

            <div class="product-grid">
                <div v-for="product in productsAo" :key="product.id" class="product-card">
                    <router-link :to="`/product/${product.id}`">
                        <div class="card-image">
                            <img :src="product.image" :alt="product.name" />
                            <span class="tag-new">NEW</span>
                        </div>
                    </router-link>

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

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// --- 1. BANNER & SLIDER LOGIC ---
const banners = ref([]);
const currentIndex = ref(0);
let slideInterval = null;
const API_URL = 'http://localhost:3000/carousel';

const fetchBanners = async () => {
    try {
        const response = await axios.get(API_URL);

        // Lọc banner theo position và status
        const activeBanners = response.data.filter(item =>
            item.status === 'active' &&
            (item.position === 'home_main' || item.position === 'Home Slider')
        );

        // Sắp xếp theo order
        activeBanners.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

        // FIX: Trích xuất cả URL ảnh và LINK từ dữ liệu mẫu bạn gửi
        banners.value = activeBanners.map(item => {
            let imageUrl = '';
            if (Array.isArray(item.image)) {
                imageUrl = item.image[0]?.image_url || item.image[0] || '';
            } else {
                imageUrl = item.image || '';
            }
            return {
                url: imageUrl,
                link: item.link || '#', // Lấy link từ db.json
                title: item.title || ''
            };
        }).filter(b => b.url && b.url.trim() !== "");

    } catch (error) {
        console.error("Lỗi khi tải banner:", error);
    }
};

const nextSlide = () => {
    if (banners.value.length > 0) {
        currentIndex.value = (currentIndex.value + 1) % banners.value.length;
    }
};

const prevSlide = () => {
    if (banners.value.length > 0) {
        currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length;
    }
};

const goToSlide = (index) => { currentIndex.value = index; };
const startAutoPlay = () => { stopAutoPlay(); slideInterval = setInterval(nextSlide, 5000); };
const stopAutoPlay = () => { if (slideInterval) clearInterval(slideInterval); };
const pauseAutoPlay = () => stopAutoPlay();

// --- 2. DỮ LIỆU MẪU (KHÔI PHỤC LẠI) ---
const tabsAo = ref(['ÁO', 'ĐẦM', 'ÁO DÀI']);
const activeTabAo = ref('ÁO');
const demoImg = "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741";

const productsAo = ref([
    { id: 1, name: "OD4B494 - Áo cotton phối nơ", price: 595000, image: demoImg },
    { id: 2, name: "OD4S439 - Áo len lông ghi", price: 659000, image: demoImg },
    { id: 3, name: "OD4B453 - Áo nhung the cao cấp", price: 599000, image: demoImg },
    { id: 4, name: "OD4B507 - Áo len lông thỏ", price: 595000, image: demoImg },
]);

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

onMounted(async () => { await fetchBanners(); startAutoPlay(); });
onUnmounted(() => stopAutoPlay());
</script>

<style scoped>
/* GIỮ NGUYÊN CSS CỦA BẠN - KHÔNG THAY ĐỔI */
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

.view-more {
    font-size: 14px;
    color: #333;
    font-weight: bold;
}

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
}

/* Thêm bổ sung để banner-link không làm hỏng layout */
.banner-link {
    display: block;
    width: 100%;
    height: 100%;
}
</style>