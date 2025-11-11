<template>
  <div class="container my-5 form-container mx-auto">
    <div class="p-4 border rounded shadow-sm form-box position-relative">
      <button type="button" class="btn-close close-btn" aria-label="Close" @click="goBack"></button>

      <div class="text-center mb-4">
        <h2 class="fw-bold text-uppercase mb-0">ĐĂNG KÝ</h2>
      </div>

      <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <input type="text" v-model="fullName" class="form-control" placeholder="Họ và tên" required>
        </div>

        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Email" required>
        </div>

        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Mật khẩu (ít nhất 6 ký tự)" required>
        </div>

        <div class="mb-4">
          <input type="password" v-model="passwordConfirm" class="form-control" placeholder="Xác nhận mật khẩu" required>
        </div>

        <p class="text-center small text-muted mb-4">
          Đã có tài khoản?
          <router-link to="/login" class="text-primary fw-bold">Đăng nhập tại đây</router-link>
        </p>

        <button type="submit" class="btn btn-dark w-100 py-2 fw-bold" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : 'ĐĂNG KÝ' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// 1. Ref cho các trường đã rút gọn
const fullName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

// 2. Ref cho trạng thái (giống login)
const errorMsg = ref('');
const loading = ref(false);

const goBack = () => {
  router.back(); // Quay lại trang trước đó
}

// 3. Logic xử lý đăng ký (đã rút gọn)
const handleRegister = async () => {
  loading.value = true;
  errorMsg.value = '';

  // --- Validate cơ bản ---
  if (!fullName.value || !email.value || !password.value || !passwordConfirm.value) {
    errorMsg.value = 'Vui lòng điền đầy đủ thông tin.';
    loading.value = false;
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMsg.value = 'Email không đúng định dạng.';
    loading.value = false;
    return;
  }
  if (password.value.length < 6) {
    errorMsg.value = 'Mật khẩu phải có ít nhất 6 ký tự.';
    loading.value = false;
    return;
  }
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'Mật khẩu xác nhận không khớp.';
    loading.value = false;
    return;
  }

  // --- Xử lý API ---
  try {
    // Bước 1: Kiểm tra email tồn tại
    const { data } = await axios.get(
      `http://localhost:3000/users?email=${email.value}`
    );
    if (data.length > 0) {
      errorMsg.value = 'Email này đã tồn tại!';
      loading.value = false;
      return;
    }

    // Bước 2: Tạo object user (đã rút gọn)
    const userToPost = {
      fullname: fullName.value,
      email: email.value,
      password: password.value, // Lưu ý: Nên mã hóa mật khẩu ở backend
      role: 'user',
      status: 'active',
      create_At: new Date().toISOString(),
      // Đã loại bỏ phone, address, gender, birthday, avatar, cart...
    };

    // Bước 3: Gửi đăng ký
    await axios.post('http://localhost:3000/users', userToPost);

    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    router.push('/login');

  } catch (err) {
    console.error(err);
    errorMsg.value = 'Đã xảy ra lỗi. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* CSS giống hệt file Login.vue */
.form-container { max-width: 450px; }
.form-box { background-color: white; position: relative; padding-top: 30px !important; }
.close-btn { position: absolute; top: 15px; right: 15px; }
</style>