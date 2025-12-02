<template>
  <div> <div class="hero-image">
      <img :src="heroImage" alt="Hero Image">
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
            <img :src="item.src" alt="Article content image">
          </div>

          <div v-else-if="item.type === 'image-pair'" class="grid-item-pair">
            <div class="pair-item">
              <img :src="item.srcLeft" alt="Article content image left">
            </div>
            <div class="pair-item">
              <img :src="item.srcRight" alt="Article content image right">
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
              <span>{{ link.url }}</span> </a>
          </li>
          </ul>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';


const heroImage = ref('https://pos.nvncdn.com/af3c03-152482/album/20251027_f1lAVaZF.jpeg?v=1761555358');
const title = ref('FLOW MOTION');

const description = ref('Giữa nhịp sống vội vã, nơi công việc, cảm xúc và những “deadline” đôi khi khiến ta quên mất đi được là chính mình. Bộ sưu tập “Flow Motion” ra đời như một khoảng dừng nhẹ, gửi gắm lời nhắn nhủ: chuyển động không chỉ để vận động, mà để lắng nghe cơ thể, làm mới năng lượng và tìm lại sự cân bằng bên trong.');
const footerQuote = ref('“Flow Motion” không dừng lại là thời trang thể thao, không đơn thuần là vận động, mà là cách nâng sống trọn trong từng chuyển động của mình.');

const articleContent = ref([
  {
    type: 'text',
    content: 'Lấy cảm hứng từ tinh thần thể thao hiện đại, BST “Flow Motion” mang đến hình ảnh người phụ nữ Orchid năng động mà tinh tế, khỏe khoắn mà đầy cảm xúc. Mỗi thiết kế là sự hòa quyện giữa tính ứng dụng cao và phong thái thời trang để nàng có thể tự do di chuyển giữa công việc - cuộc sống - bản thân mà không đánh mất phong cách riêng.'
  },
  {
    type: 'full-image',
    src: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_2Mkw2fgQ.jpg'
  },
  {
    type: 'image-pair',
    srcLeft: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_1xrjng4y.jpg',
    srcRight: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_Dcsj6i5q.jpg'
  },
  {
    type: 'image-pair',
    srcLeft: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_yzox7HIY.jpg',
    srcRight: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_ql8xSAZG.jpg' 
  },
  {
    type: 'image-pair',
    srcLeft: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_eNvrfcXn.jpg',
    srcRight: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_xnTd9FRo.jpg'
  },
  {
    type: 'full-image',
    src: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_jBLonuAP.jpg'
  },
  {
    type: 'text',
    content: 'Khai thác các chất liệu co giãn linh hoạt, giữ nhiệt nhẹ và thoáng như Umi Hàn, xốp gió, len gân, nhung the, từng thiết kế ôm trọn cơ thể nhưng vẫn cho nàng sự tự do trong từng chuyển động. Bảng màu trung tính pha điểm nhấn metallic khơi gợi năng lượng tích cực như ánh sáng len lỏi trong mùa đông, phản chiếu tinh thần sống chủ động và rực rỡ.'
  },
  {
    type: 'image-pair',
    srcLeft: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_2enOqjkY.jpg',
    srcRight: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_kH1exChW.jpg'
  },
  {
    type: 'image-pair',
    srcLeft: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_adWHNr1d.jpg',
    srcRight: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_PgQbugQL.jpg'
  },
  {
    type: 'full-image',
    src: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_iHrrlyKY.jpg'
  },
  {
    type: 'image-pair',
    srcLeft: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_SnxkCUhj.jpg',
    srcRight: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_EAePLw7h.jpg'
  },
  {
    type: 'text',
    content: 'Không dừng lại ở đó, kết cấu xử lý phom dáng tài tình, thể hiện rõ cá tính, đường cắt dứt khoát tạo nên nét khỏe khoắn tự nhiên, tôn vinh tinh thần #move_with_balance năng động, tự tin, và đầy sức sống.'
  },
  {
    type: 'full-image',
    src: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_Qcu7rQ56.jpg'
  },
  {
    type: 'full-image',
    src: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_gCI1tamg.jpg'
  },
  {
    type: 'full-image',
    src: 'https://pos.nvncdn.com/af3c03-152482/art/artCT/20251027_3hnChe4U.jpg'
  }
]);

const socialLinks = ref([
  { name: 'Fanpage', url: 'https://www.facebook.com/ThoiTrangOrchid/' },
  { name: 'Kênh thương mại điện tử', url: '' },
  { name: 'Lazada Mall', url: 'https://s.lazada.vn/s.2ArTZ?cc' },
  { name: 'Shopee Mall', url: 'https://s.shopee.vn/9UK45PLirC' },
  { name: 'Kênh giải trí', url: '' }, 
  { name: 'Youtube', url: 'https://www.youtube.com/channel/UC3rqZ2JMisKK6xnF55iPjkg' },
  { name: 'Tiktok', url: 'https://www.tiktok.com/@orchid_fashion' },
  { name: 'Instagram', url: 'https://www.instagram.com/orchidfashion.official/' }
]);

</script>

<style scoped>
:root {
  --text-color: #333;
  --link-color: #007bff;
  --footer-bg: #1a1a1a;
  --footer-text: #f0f0f0;
  --footer-link: #4a90e2; 
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