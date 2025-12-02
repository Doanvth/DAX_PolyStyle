<template>
  <div class="profile-container">
    <aside class="sidebar">
      <ProfileSidebar 
        :user-name="currentUser?.fullname" 
      />
    </aside>

    <main class="content-panel">
      <div v-if="isLoading" class="loading-container">
        <p>Đang tải dữ liệu...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>Đã xảy ra lỗi khi tải dữ liệu:</p>
        <pre>{{ error.message }}</pre>
      </div>

      <router-view 
        v-else
        :user="currentUser" 
        :lookup-data="lookupData" 
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProfileSidebar from '@/components/ProfileSidebar.vue';

const currentUser = ref(null);
const lookupData = ref({
  places: [],
  products: [],
  vouchers: []
});
const isLoading = ref(true);
const error = ref(null);

const API_URL = 'http://localhost:3000';

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const userRes = await fetch(`${API_URL}/users/1`); 
    if (!userRes.ok) throw new Error('Không thể tải thông tin user (ID: 1)');
    currentUser.value = await userRes.json();

    const [placesRes, productsRes, vouchersRes] = await Promise.all([
      fetch(`${API_URL}/place`),
      fetch(`${API_URL}/products`),
      fetch(`${API_URL}/voucher`)
    ]);

    lookupData.value.places = await placesRes.json();
    lookupData.value.products = await productsRes.json();
    lookupData.value.vouchers = await vouchersRes.json();

  } catch (err) {
    console.error('Lỗi khi fetch dữ liệu:', err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.profile-container {
  display: flex;
  max-width: 1400px;
  margin: 20px auto;
  gap: 20px;
  font-family: Arial, sans-serif;
}
.sidebar {
  flex: 0 0 250px;
  border-right: 1px solid #eee;
  padding-right: 20px;
}
.content-panel {
  flex: 1;
}
.loading-container, .error-container {
  padding: 20px;
  text-align: center;
  color: #555;
}
.error-container {
  color: red;
}
</style>