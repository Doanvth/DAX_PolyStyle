<template>
  <div class="container my-5 form-container mx-auto">
    <div class="p-4 border rounded shadow-sm form-box position-relative">
      <button type="button" class="btn-close close-btn" aria-label="Close" @click="goBack"></button>

      <div class="text-center mb-4">
        <h2 class="fw-bold text-uppercase mb-0">ĐĂNG NHẬP</h2>
      </div>

      <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Email" required>
        </div>

        <div class="mb-4">
          <input 
            type="password" 
            v-model="password" 
            class="form-control" 
            placeholder="Mật khẩu" 
            required
          >
        </div>
        <p class="text-center small text-muted mb-4">
          Chưa có tài khoản?
          <router-link to="/register" class="text-primary fw-bold">Đăng ký tại đây</router-link>
        </p>

        <button type="submit" class="btn btn-dark w-100 py-2 fw-bold" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Các ref cần thiết cho form
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);




const goBack = () => {
  console.log('Đã bấm nút quay lại/đóng.');
}
</script>

<style scoped>
.form-container { max-width: 450px; }
.form-box { background-color: white; position: relative; padding-top: 30px !important; }
.close-btn { position: absolute; top: 15px; right: 15px; }
</style>