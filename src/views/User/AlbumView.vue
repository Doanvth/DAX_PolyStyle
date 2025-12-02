<template>
  <div class="album-container">
    <h1 class="album-title">Album</h1>

    <div class="album-grid">
      <router-link 
        v-for="item in paginatedData" 
        :key="item.id"
        :to="`/albumDetail`" 
        class="album-item"
      >
        <div class="album-image">
          <img :src="item.imgSrc" :alt="item.title">
        </div>
        <div class="album-caption">
          <span class="album-caption-title">{{ item.title }}</span>
        </div>
      </router-link> </div>

    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const itemsPerPage = 9;

const currentPage = ref(1);

const albumData = ref([
  { id: 1, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20251027_f1lAVaZF.jpeg?v=1761555358", title: "FLOW MOTION" },
  { id: 2, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250923_8BaaYKMP.jpeg?v=1758611674", title: "GẤM HOA ĐẤT VIỆT" },
  { id: 3, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250731_jiKZTMZF.jpeg?v=1753926555", title: "FOREST REVERSE" },
  { id: 4, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250723_kF6cl03O.jpeg?v=1753242769", title: "URBAN SONATA" },
  { id: 5, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250523_hQmsmrRd.jpeg?v=1747966757", title: "APHRODITE" },
  { id: 6, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250410_1KWQux0g.jpeg?v=1744267332", title: "SUN-KISSED MEMORIES" },
  { id: 7, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250327_gItFU8Rg.jpeg?v=1743050963", title: "DYNAMIC-TEE" },
  { id: 8, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250218_Bz3XUh8H.jpeg?v=1739854604", title: "WORK-LIFE BALANCE" },
  { id: 9, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20250107_2icCv1VU.jpeg?v=1736225414", title: "SUMMER FEELING" },
  { id: 10, imgSrc: "https://pos.nvncdn.com/af3c03-152482/album/20241226_d9dPM5tB.jpeg?v=1735182164", title: "NEW COLLECTION" }
]);

const totalPages = computed(() => {
  return Math.ceil(albumData.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return albumData.value.slice(start, end);
});

function changePage(page) {
  currentPage.value = page;
}
</script>

<style scoped>
.album-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.album-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.album-item {
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.album-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.album-image {
  overflow: hidden;
  background-color: #eee;
}

.album-image img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.album-item:hover .album-image img {
  transform: scale(1.05);
}

.album-caption {
  background-color: #ffffff;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.album-caption-title {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #444;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.page-btn {
  font-size: 1rem;
  font-weight: 500;
  padding: 10px 15px;
  margin: 0 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #555;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.page-btn:hover {
  background-color: #f4f4f4;
}

.page-btn.active {
  background-color: #333;
  color: #fff;
  border-color: #333;
}

@media (max-width: 992px) {
  .album-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .album-grid {
    grid-template-columns: 1fr;
  }
  .album-title {
    font-size: 1.5rem;
  }
}
</style>