<script setup>
import HeaderAdmin from '../../components/HeaderAdmin.vue'
import FooterAdmin from '../../components/FooterAdmin.vue'
</script>

<template>
  <div class="admin-layout d-flex flex-column min-vh-100">
    <HeaderAdmin />
    
    <main class="flex-grow-1">
      <RouterView />
    </main>
    
    <FooterAdmin />
  </div>
</template>

<style scoped>
.admin-layout {
  background-color: #f8f9fa;
}

.min-vh-100 {
  min-height: 100vh;
}
</style>
