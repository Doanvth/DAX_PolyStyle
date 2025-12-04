<template>
  <div class="admin-container">
    <div class="dashboard-header">
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon"><i class="bi bi-newspaper"></i></div>
          <div class="info">
            <h3>{{ stats.total }}</h3>
            <p>Tổng bài viết</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="icon"><i class="bi bi-check-circle"></i></div>
          <div class="info">
            <h3>{{ stats.active }}</h3>
            <p>Đã xuất bản</p>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="icon"><i class="bi bi-eye"></i></div>
          <div class="info">
            <h3>{{ formatNumber(stats.totalViews) }}</h3>
            <p>Tổng lượt xem</p>
          </div>
        </div>
        <div class="stat-card gray">
          <div class="icon"><i class="bi bi-pencil"></i></div>
          <div class="info">
            <h3>{{ stats.draft }}</h3>
            <p>Nháp / Đang ẩn</p>
          </div>
        </div>
      </div>
    </div>

    <div class="status-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value" 
        class="tab-btn" 
        :class="{ active: currentTab === tab.value }"
        @click="setFilter(tab.value)"
      >
        {{ tab.label }}
        <span class="count-badge">{{ getCountByTab(tab.value) }}</span>
      </button>
    </div>

    <div class="toolbar-top">
      <div class="left-actions">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" type="text" placeholder="Tìm tiêu đề, tác giả..." />
        </div>
        <select v-model="selectedCategory" class="filter-select">
            <option value="">Tất cả danh mục</option>
            <option value="1">Khuyến mãi</option>
            <option value="2">Khai trương</option>
            <option value="3">Bộ sưu tập</option>
            <option value="4">Xu hướng</option>
        </select>
      </div>
      
      <div class="right-actions">
        <router-link to="/admin/addposts" class="btn-primary-custom">
          <i class="bi bi-plus-lg"></i> Viết bài mới
        </router-link>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="5%">ID</th>
            <th width="35%">Bài viết</th>
            <th width="15%">Danh mục</th>
            <th width="15%">Tác giả</th>
            <th width="10%">Tương tác</th>
            <th width="10%">Trạng thái</th>
            <th width="10%" class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in paginatedPosts" :key="post.id">
            <td class="text-muted text-xs">#{{ post.id }}</td>
            
            <td>
              <div class="post-info-row">
                <img :src="post.img" class="post-thumb" alt="img" 
                     @error="e => e.target.src = 'https://placehold.co/80x50?text=No+Img'"/>
                <div class="info-text">
                  <span class="post-title" :title="post.title">{{ post.title }}</span>
                  <span class="post-date text-xs text-muted">
                    <i class="bi bi-calendar3"></i> {{ post.create_At }}
                  </span>
                </div>
              </div>
            </td>

            <td>
                <span class="category-badge" :class="getCategoryClass(post.categories_news_id)">
                    {{ getCategoryName(post.categories_news_id) }}
                </span>
            </td>

            <td>
                <div class="author-info">
                    <img :src="post.authorAvatar" class="avatar-circle">
                    <span>{{ post.author }}</span>
                </div>
            </td>

            <td>
                <div class="stats-mini">
                    <span title="Lượt xem"><i class="bi bi-eye"></i> {{ formatNumber(post.views) }}</span>
                    </div>
            </td>

            <td>
              <div class="status-toggle" @click="toggleStatus(post)">
                <span class="dot" :class="post.status === 'active' ? 'bg-success' : 'bg-gray'"></span>
                {{ post.status === 'active' ? 'Hiển thị' : 'Ẩn' }}
              </div>
            </td>

            <td class="text-center">
              <button class="btn-icon" title="Xem chi tiết" @click="openModal(post)">
                <i class="bi bi-pencil-square text-blue"></i>
              </button>
              <button class="btn-icon delete" title="Xóa" @click="deletePost(post.id)">
                <i class="bi bi-trash text-red"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredPosts.length === 0" class="empty-state">
        <i class="bi bi-journal-x"></i>
        <p>Không tìm thấy bài viết nào.</p>
      </div>
    </div>

    <div class="pagination-footer" v-if="filteredPosts.length > 0">
      <div class="page-info">
        Hiển thị <b>{{ (currentPage - 1) * itemsPerPage + 1 }}</b> - 
        <b>{{ Math.min(currentPage * itemsPerPage, filteredPosts.length) }}</b> 
        trong tổng <b>{{ filteredPosts.length }}</b> bài viết
      </div>
      <div class="page-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="current-page">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3>Chi tiết bài viết #{{ selectedPost.id }}</h3>
            <span class="status-badge-modal" :class="selectedPost.status">
              {{ selectedPost.status === 'active' ? 'Đang hiển thị' : 'Đang ẩn' }}
            </span>
          </div>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="modal-cover-wrapper">
             <img :src="selectedPost.img" alt="Cover">
          </div>

          <div class="modal-content-padding">
            <h2 class="preview-title">{{ selectedPost.title }}</h2>
            
            <div class="preview-meta">
                <span><i class="bi bi-folder"></i> {{ getCategoryName(selectedPost.categories_news_id) }}</span>
                <span><i class="bi bi-person"></i> {{ selectedPost.author }}</span>
                <span><i class="bi bi-calendar"></i> {{ selectedPost.create_At }}</span>
            </div>

            <div class="preview-summary">
                <strong>Mô tả ngắn:</strong>
                <p>{{ selectedPost.summary }}</p>
            </div>
            
            <div class="preview-stats">
                <div class="stat-box">
                    <span>Lượt xem</span>
                    <b>{{ formatNumber(selectedPost.views) }}</b>
                </div>
                <div class="stat-box">
                    <span>Chia sẻ</span>
                    <b>{{ Math.floor(Math.random() * 100) }}</b>
                </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline-custom" @click="closeModal">Đóng</button>
          <button class="btn-primary-custom">Chỉnh sửa nội dung</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const generatePosts = () => {
  const data = [];
  const categories = [1, 2, 3, 4]; 
  const authors = ['Admin Team', 'Lan Hương', 'Minh Tuấn', 'Content Editor'];
  
  for (let i = 1; i <= 35; i++) {
    const catId = categories[Math.floor(Math.random() * categories.length)];
    const viewCount = Math.floor(Math.random() * 5000) + 100;
    
    data.push({
      id: i,
      title: `Bài viết demo số ${i} - Xu hướng thời trang ${2025}`,
      img: `https://placehold.co/600x350?text=News+${i}`,
      categories_news_id: catId,
      create_At: `${Math.floor(Math.random() * 28) + 1}/11/2025`,
      author: authors[Math.floor(Math.random() * authors.length)],
      authorAvatar: `https://placehold.co/30x30?text=${authors[Math.floor(Math.random() * authors.length)].charAt(0)}`,
      status: Math.random() > 0.2 ? 'active' : 'hidden',
      views: viewCount,
      summary: 'Đây là đoạn mô tả ngắn (Sapo) của bài viết. Nó tóm tắt nội dung chính để thu hút người đọc bấm vào xem chi tiết...'
    });
  }

  return data.reverse();
};

const posts = ref(generatePosts());

const searchQuery = ref("");
const selectedCategory = ref("");
const currentTab = ref("all");
const currentPage = ref(1);
const itemsPerPage = 7; 
const showModal = ref(false);
const selectedPost = ref({});

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đã xuất bản', value: 'active' },
  { label: 'Nháp / Ẩn', value: 'hidden' }
];

const filteredPosts = computed(() => {
  let result = posts.value;

  if (currentTab.value !== 'all') {
    result = result.filter(p => p.status === currentTab.value);
  }

  if (selectedCategory.value) {
    result = result.filter(p => p.categories_news_id == selectedCategory.value);
  }

  if (searchQuery.value) {
    const key = searchQuery.value.toLowerCase();
    result = result.filter(p => 
      p.title.toLowerCase().includes(key) || 
      p.author.toLowerCase().includes(key)
    );
  }
  return result;
});

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPosts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage) || 1);

const stats = computed(() => {
  return {
    total: posts.value.length,
    active: posts.value.filter(p => p.status === 'active').length,
    draft: posts.value.filter(p => p.status === 'hidden').length,
    totalViews: posts.value.reduce((sum, p) => sum + p.views, 0)
  };
});

const setFilter = (tab) => {
  currentTab.value = tab;
  currentPage.value = 1;
};

const getCountByTab = (tab) => {
  if (tab === 'all') return posts.value.length;
  return posts.value.filter(p => p.status === tab).length;
};

const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

const getCategoryName = (id) => {
    const map = { 1: "Khuyến mại", 2: "Khai trương", 3: "Bộ sưu tập", 4: "Xu hướng" };
    return map[id] || "Khác";
};

const getCategoryClass = (id) => {
    const map = { 1: 'badge-red', 2: 'badge-green', 3: 'badge-purple', 4: 'badge-blue' };
    return map[id] || 'badge-gray';
};

const toggleStatus = (post) => {
    post.status = post.status === 'active' ? 'hidden' : 'active';
};

const deletePost = (id) => {
    if(confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        posts.value = posts.value.filter(p => p.id !== id);
    }
};

const openModal = (post) => {
    selectedPost.value = post;
    showModal.value = true;
};
const closeModal = () => showModal.value = false;

</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
  font-size: 13px;
}

.dashboard-header { margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }

.stat-card {
  background: white; padding: 15px; border-radius: 8px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02);
}
.stat-card .icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.stat-card h3 { margin: 0; font-size: 20px; font-weight: 700; color: #111; }
.stat-card p { margin: 0; color: #6b7280; font-size: 12px; }

.blue .icon { background: #eff6ff; color: #3b82f6; }
.green .icon { background: #ecfdf5; color: #10b981; }
.orange .icon { background: #fff7ed; color: #f97316; }
.gray .icon { background: #f3f4f6; color: #6b7280; }

.status-tabs { display: flex; gap: 8px; margin-bottom: 15px; }
.tab-btn {
  background: white; border: 1px solid #e5e7eb; padding: 6px 12px;
  border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;
  display: flex; align-items: center; gap: 6px; color: #6b7280; transition: all 0.2s;
}
.tab-btn:hover { background: #f9fafb; }
.tab-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
.count-badge { background: #f3f4f6; padding: 1px 6px; border-radius: 10px; font-size: 11px; color: #4b5563; }
.tab-btn.active .count-badge { background: rgba(255,255,255,0.2); color: white; }

.toolbar-top { display: flex; justify-content: space-between; margin-bottom: 12px; }
.left-actions, .right-actions { display: flex; gap: 10px; }
.search-box { position: relative; width: 300px; }
.search-box input {
  width: 100%; padding: 7px 10px 7px 30px; border: 1px solid #d1d5db;
  border-radius: 6px; outline: none; font-size: 13px;
}
.search-box i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

.filter-select {
    padding: 0 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #374151; cursor: pointer; background: white;
}

.btn-primary-custom {
  background: #2563eb; color: white; border: none; padding: 7px 14px;
  border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 13px; text-decoration: none;
}
.btn-outline-custom {
  background: white; border: 1px solid #d1d5db; color: #374151; padding: 7px 14px;
  border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 13px;
}

.table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th { background: #f9fafb; padding: 10px 12px; text-align: left; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
tr:hover td { background-color: #f9fafb; }

.post-info-row { display: flex; gap: 12px; align-items: flex-start; }
.post-thumb { width: 70px; height: 45px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
.info-text { display: flex; flex-direction: column; justify-content: center; }
.post-title { font-weight: 600; color: #111; font-size: 13px; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.category-badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.badge-red { background: #fee2e2; color: #ef4444; }
.badge-green { background: #dcfce7; color: #166534; }
.badge-purple { background: #f3e8ff; color: #a855f7; }
.badge-blue { background: #dbeafe; color: #1e40af; }
.badge-gray { background: #f3f4f6; color: #4b5563; }

.author-info { display: flex; align-items: center; gap: 6px; font-weight: 500; }
.avatar-circle { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }

.stats-mini { display: flex; flex-direction: column; gap: 2px; font-size: 11px; color: #6b7280; }

.status-toggle { cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 12px; width: fit-content; }
.status-toggle .dot { width: 8px; height: 8px; border-radius: 50%; }
.bg-success { background: #10b981; }
.bg-gray { background: #9ca3af; }

.btn-icon { background: none; border: none; cursor: pointer; color: #6b7280; font-size: 15px; margin-right: 5px; }
.btn-icon:hover i { transform: scale(1.1); }
.text-red { color: #ef4444; }
.text-blue { color: #2563eb; }
.text-muted { color: #9ca3af; }
.text-xs { font-size: 11px; }

.pagination-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-top: 1px solid #f3f4f6; }
.page-info { color: #6b7280; font-size: 13px; }
.page-controls { display: flex; align-items: center; gap: 8px; }
.page-btn { width: 28px; height: 28px; border: 1px solid #d1d5db; background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.page-btn:hover:not(:disabled) { background: #f3f4f6; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.current-page { font-weight: 600; color: #374151; font-size: 13px; }
.empty-state { text-align: center; padding: 40px; color: #9ca3af; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; }
.modal-content { background: white; width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideDown 0.2s ease-out; }

.modal-header { padding: 15px 20px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
.modal-title-group h3 { margin: 0; font-size: 16px; font-weight: 700; color: #111; display: inline-block; margin-right: 10px; }
.status-badge-modal { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
.status-badge-modal.active { background: #dcfce7; color: #166534; }
.status-badge-modal.hidden { background: #f3f4f6; color: #4b5563; }
.close-btn { background: none; border: none; font-size: 18px; color: #9ca3af; cursor: pointer; }

.modal-body { padding: 0; }
.modal-cover-wrapper { width: 100%; height: 200px; background: #eee; }
.modal-cover-wrapper img { width: 100%; height: 100%; object-fit: cover; }

.modal-content-padding { padding: 20px; }
.preview-title { font-size: 18px; font-weight: 700; color: #111; margin-bottom: 10px; line-height: 1.4; }
.preview-meta { display: flex; gap: 15px; font-size: 12px; color: #6b7280; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px; }
.preview-meta i { margin-right: 4px; }

.preview-summary strong { display: block; margin-bottom: 5px; font-size: 13px; color: #374151; }
.preview-summary p { margin: 0; font-size: 14px; color: #555; line-height: 1.6; }

.preview-stats { display: flex; gap: 20px; margin-top: 20px; background: #f9fafb; padding: 10px; border-radius: 6px; }
.stat-box { display: flex; flex-direction: column; align-items: center; flex: 1; }
.stat-box span { font-size: 11px; color: #6b7280; text-transform: uppercase; }
.stat-box b { font-size: 16px; color: #2563eb; }

.modal-footer { padding: 15px 20px; background: #f9fafb; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #f3f4f6; }

@keyframes slideDown { from { transform: translateY(-15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>