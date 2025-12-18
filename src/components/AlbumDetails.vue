<template>
  <div>
    <div v-if="isLoading" class="loading">Đang tải dữ liệu...</div>
    
    <div v-else-if="!album" class="empty-state">
      <p>Không tìm thấy album hoặc album đã bị xóa.</p>
      <router-link to="/album" class="back-link">← Quay lại trang Album</router-link>
    </div>
    
    <div v-else>
      <div class="hero-image">
        <img :src="heroImage" :alt="title">
      </div>

      <div class="article-page">
        <div class="content-block">
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
        </div>

        <div class="image-grid">
          <template v-for="(item, index) in articleContent" :key="index">
            
            <p v-if="item.type === 'text'" class="article-text">
              {{ item.content }}
            </p>

            <div v-else-if="item.type === 'full-image'" class="grid-item-full">
              <img :src="item.src" :alt="`Article image ${index + 1}`">
            </div>

            <div v-else-if="item.type === 'image-pair'" class="grid-item-pair">
              <div class="pair-item">
                <img :src="item.srcLeft" :alt="`Article image ${index + 1} left`">
              </div>
              <div class="pair-item">
                <img :src="item.srcRight" :alt="`Article image ${index + 1} right`">
              </div>
            </div>

          </template>
        </div>

        <footer class="article-footer">
          <p class="footer-quote">{{ footerQuote }}</p>
          <div class="footer-divider"></div>
          <h2>ORCHID - DẪN LỐI THỜI TRANG PHÁI ĐẸP</h2>
          <ul class="footer-links">
            <li>
              <span class="link-icon">■</span>
              <a href="tel:0972359666">
                <strong>Hotline:</strong>
                <span>0972.359.666</span>
              </a>
            </li>
            
            <li v-for="link in socialLinks" :key="link.name">
              <span class="link-icon">■</span>
              
              <span v-if="!link.url" class="group-title">
                <strong>{{ link.name }}:</strong>
              </span>

              <a v-else :href="link.url" target="_blank" rel="noopener noreferrer">
                <strong>{{ link.name }}:</strong>
                <span>{{ link.url }}</span>
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const heroImage = ref('');
const title = ref('');
const description = ref('');
const footerQuote = ref('');
const articleContent = ref([]);
const socialLinks = ref([]);
const album = ref(null);
const isLoading = ref(true);

// Lấy dữ liệu từ localStorage hoặc db.json
const loadAlbumData = () => {
  const albumId = route.query.id;
  
  if (!albumId) {
    isLoading.value = false;
    return;
  }

  // Thử lấy từ localStorage trước
  const collections = JSON.parse(localStorage.getItem('orchid_collections') || '[]');
  const foundAlbum = collections.find(item => item.id == albumId);
  
  if (foundAlbum) {
    album.value = foundAlbum;
    parseAlbumData(foundAlbum);
    isLoading.value = false;
  } else {
    // Nếu không có trong localStorage, thử lấy từ db.json mẫu
    fetch('/db.json')
      .then(response => response.json())
      .then(data => {
        const sampleAlbum = data.collection?.find(item => item.id == albumId);
        if (sampleAlbum) {
          album.value = sampleAlbum;
          parseAlbumData(sampleAlbum);
        }
        isLoading.value = false;
      })
      .catch(error => {
        console.error('Lỗi khi tải dữ liệu:', error);
        isLoading.value = false;
      });
  }
};

// Phân tích dữ liệu album
const parseAlbumData = (albumData) => {
  const detail = albumData.collection_detail?.[0] || {};
  
  // Hero image
  heroImage.value = albumData.image || '/default-hero.jpg';
  
  // Tiêu đề và mô tả
  title.value = detail.title || albumData.title || 'Không có tiêu đề';
  description.value = detail.content || albumData.description || 'Không có mô tả';
  footerQuote.value = detail.content5 || 'Không có trích dẫn';
  
  // Xây dựng nội dung bài viết từ dữ liệu
  articleContent.value = [];
  
  // Thêm nội dung text
  if (detail.content2) articleContent.value.push({ type: 'text', content: detail.content2 });
  if (detail.content3) articleContent.value.push({ type: 'text', content: detail.content3 });
  if (detail.content4) articleContent.value.push({ type: 'text', content: detail.content4 });
  
  // Thêm hình ảnh từ dữ liệu (nếu có)
  if (detail.image && detail.image.length > 0) {
    // Giả sử mỗi image là một full image
    detail.image.forEach((img, index) => {
      if (img.image_url) {
        articleContent.value.push({ 
          type: 'full-image', 
          src: img.image_url 
        });
      }
    });
  }
  
  // Liên kết xã hội
  socialLinks.value = [
    { name: 'Fanpage', url: 'https://www.facebook.com/ThoiTrangOrchid/' },
    { name: 'Kênh thương mại điện tử', url: '' },
    { name: 'Lazada Mall', url: detail.social_chanel?.[0]?.lazada_url || 'https://s.lazada.vn/s.2ArTZ?cc' },
    { name: 'Shopee Mall', url: detail.social_chanel?.[0]?.shopee_url || 'https://s.shopee.vn/9UK45PLirC' },
    { name: 'Kênh giải trí', url: '' }, 
    { name: 'Youtube', url: detail.entertainment_chanel?.[0]?.youtube_url || 'https://www.youtube.com/channel/UC3rqZ2JMisKK6xnF55iPjkg' },
    { name: 'Tiktok', url: detail.entertainment_chanel?.[0]?.tiktok_url || 'https://www.tiktok.com/@orchid_fashion' },
    { name: 'Instagram', url: 'https://www.instagram.com/orchidfashion.official/' }
  ];
};

onMounted(() => {
  loadAlbumData();
});
</script>

<style scoped>
:root {
  --text-color: #333;
  --link-color: #007bff;
  --footer-bg: #1a1a1a;
  --footer-text: #f0f0f0;
  --footer-link: #4a90e2; 
}

.loading {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.2rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #555;
}

.article-page {
  max-width: 900px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  color: var(--text-color);
  background-color: #fff;
}

.hero-image {
  width: 100%;
  margin-bottom: 20px;
}
.hero-image img {
  width: 100%;
  height: auto;
  display: block;
}

.content-block {
  padding: 0 15px;
  margin-bottom: 30px;
}
.content-block h1 {
  font-size: 2rem;
  font-weight: 600;
  text-align: left;
  margin-bottom: 15px;
}
.content-block p {
  font-size: 1rem;
  line-height: 1.6;
  text-align: justify;
}

.image-grid {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 10px; 
}

.article-text {
  font-size: 1rem;
  line-height: 1.6;
  text-align: justify;
  padding: 10px 5px; 
}

.grid-item-full img {
  width: 100%;
  height: auto;
  display: block;
}

.grid-item-pair {
  display: flex;
  flex-direction: row;
  gap: 10px; 
}
.pair-item {
  flex: 1; 
  min-width: 0; 
}
.pair-item img {
  width: 100%;
  height: auto;
  display: block;
}

.article-footer {
  background-color: var(--footer-bg);
  color: var(--footer-text);
  padding: 40px 20px;
  margin-top: 40px;
}
.footer-quote {
  font-style: italic;
  font-size: 1.1rem;
  text-align: left;
  margin-bottom: 20px;
}
.footer-divider {
  border-bottom: 1px dashed var(--footer-text);
  opacity: 0.5;
  margin-bottom: 20px;
}
.article-footer h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
}
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links li {
  margin-bottom: 12px;
  font-size: 1rem;
  display: flex;
  align-items: flex-start;
}
.link-icon {
  margin-right: 10px;
  color: var(--footer-text);
}

.footer-links a {
  color: inherit; 
  text-decoration: none;
  word-break: break-all;
}
.footer-links a:hover {
  text-decoration: underline;
}

.footer-links a strong {
  color: inherit; 
  margin-right: 5px;
}

.footer-links a span {
  color: var(--footer-link); 
}
.group-title strong {
  color: inherit;
  margin-right: 5px;
}
@media (max-width: 768px) {
  .content-block h1 {
    font-size: 1.5rem;
  }
  .content-block p,
  .article-text {
    font-size: 0.9rem;
  }
  
  .grid-item-pair {
    flex-direction: column;
  }
}
</style>