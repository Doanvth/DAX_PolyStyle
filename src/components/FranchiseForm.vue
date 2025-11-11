<template>
  <div class="form-widget mt-5">
    <div class="form-title text-white text-center text-uppercase p-3">
      <h5 class="mb-0 fw-bold">
        {{ title }}
      </h5>
    </div>

    <div class="form-body bg-white p-4 p-md-5">
      <form action="#" method="POST">
        <div class="mb-3">
          <input type="text" class="form-control form-control-lg" placeholder="Họ và tên" required>
        </div>
        <div class="mb-3">
          <input type="email" class="form-control form-control-lg" placeholder="Email" required>
        </div>
        <div class="mb-3">
          <input type="tel" class="form-control form-control-lg" placeholder="Số điện thoại" required>
        </div>
        <div class="mb-3">
          <input type="text" class="form-control form-control-lg" placeholder="Số vốn dự kiến">
        </div>
        <p class="fw-bold mb-2 mt-4">
          Vui lòng chọn Khu vực bạn muốn mở showroom nhượng quyền
        </p>
        <div class="row g-3">
          <div class="col-md-4">
            <select class="form-select form-select-lg">
              <option value="">Tỉnh/Thành phố</option>
              <option value="hn">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select form-select-lg" disabled>
              <option value="">Quận/Huyện</option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select form-select-lg" disabled>
              <option value="">Phường/Xã</option>
            </select>
          </div>
        </div>
        <div class="d-grid mt-4">
          <button type="submit" class="btn btn-danger btn-lg text-uppercase fw-bold">
            Gửi đăng ký làm đại lý
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Import 'defineProps' để nhận prop từ component cha
import { defineProps } from 'vue';

// Định nghĩa prop 'title'
defineProps({
  title: {
    type: String,
    required: true,
    // Cung cấp giá trị mặc định nếu cần
    default: 'CƠ HỘI KHỞI NGHIỆP AN TOÀN - BỀN VỮNG - SINH LỜI CAO!'
  }
});
</script>

<style scoped>
/* Copy CSS của form vào đây để component độc lập */
.form-widget {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
  box-shadow: none;
}

.form-title {
  background-color: #0d1a3e;
}

.form-title h5 {
  font-size: 1.1rem;
  line-height: 1.5;
}

.form-control-lg,
.form-select-lg {
  padding: 0.75rem 1rem;
}

.btn-danger {
  background-color: #e2001a;
  border-color: #e2001a;
  padding: 0.75rem;
}

.btn-danger:hover {
  background-color: #c00;
  border-color: #c00;
}

.form-select:disabled {
  background-color: #e9ecef;
}
</style>