<template>
  <div class="album-container">
    <h1 class="album-title">Album</h1>

    <div v-if="isLoading" class="loading">Đang tải dữ liệu...</div>
    
    <div v-else>
      <div v-if="albumData.length === 0" class="empty-state">
        <p>Chưa có album nào. Hãy thêm album mới từ trang quản trị.</p>
      </div>

      <div v-else>
        <div class="album-grid">
          <router-link 
            v-for="item in paginatedData" 
            :key="item.id"
            :to="`/albumDetail?id=${item.id}`" 
            class="album-item"
          >
            <div class="album-image">
              <img :src="item.image || '/default-album.jpg'" :alt="item.title">
            </div>
            <div class="album-caption">
              <span class="album-caption-title">{{ item.title }}</span>
            </div>
          </router-link>
        </div>

        <div v-if="totalPages > 1" class="pagination">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const itemsPerPage = 9;
const currentPage = ref(1);
const albumData = ref([]);
const isLoading = ref(true);

// Lấy dữ liệu album từ localStorage
const loadAlbumData = () => {
  isLoading.value = true;
  
  // Lấy từ collection trong db.json mô phỏng
  const collections = JSON.parse(localStorage.getItem('orchid_collections') || '[]');
  
  if (collections.length === 0) {
    // Nếu chưa có dữ liệu, lấy từ db.json mẫu
    fetch('/db.json')
      .then(response => response.json())
      .then(data => {
        if (data.collection && data.collection.length > 0) {
          albumData.value = data.collection.map(item => ({
            id: item.id || 'default-id',
            imgSrc: item.image || '/default-album.jpg',
            title: item.collection_detail?.[0]?.title || 'Không có tiêu đề'
          }));
        }
        isLoading.value = false;
      })
      .catch(error => {
        console.error('Lỗi khi tải dữ liệu:', error);
        isLoading.value = false;
      });
  } else {
    // Lấy từ localStorage
    albumData.value = collections.map(item => ({
      id: item.id || Date.now().toString(),
      imgSrc: item.image || '/default-album.jpg',
      title: item.collection_detail?.[0]?.title || item.title || 'Không có tiêu đề'
    }));
    isLoading.value = false;
  }
};

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

onMounted(() => {
  loadAlbumData();
});
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

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
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