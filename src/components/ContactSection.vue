<template>
  <div class="contact-section wide-container py-5">
    <h2 class="section-title">LIÊN HỆ</h2>

    <div class="row mt-3">
      <!-- FORM LIÊN HỆ -->
      <div class="col-lg-8">
        <h5 class="form-title">
          <i class="bi bi-envelope-fill me-2"></i>
          Để lại lời nhắn cho chúng tôi
        </h5>
        <hr class="divider" />

        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-6">
              <div class="input-group mb-2">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input type="text" class="form-control" placeholder="Họ và tên" required />
              </div>

              <div class="input-group mb-2">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input type="email" class="form-control" placeholder="Email" required />
              </div>

              <div class="input-group mb-2">
                <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                <input type="tel" class="form-control" placeholder="Số điện thoại" required />
              </div>

              <div class="input-group mb-3">
                <span class="input-group-text"><i class="bi bi-house"></i></span>
                <input type="text" class="form-control" placeholder="Địa chỉ" />
              </div>
            </div>

            <div class="col-md-6">
              <textarea
                class="form-control message-box"
                placeholder="Viết lời nhắn"
              ></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-submit mt-2">
            GỬI LỜI NHẮN
          </button>
        </form>
      </div>

      <!-- THÔNG TIN LIÊN HỆ -->
      <div class="col-lg-4 mt-5 mt-lg-0">
        <p class="tagline fw-bold">
          Thời trang Orchid đẹp và phong cách hơn mỗi ngày.
        </p>

        <ul class="contact-info list-unstyled mt-3">
          <li>
            <i class="bi bi-telephone-fill me-2"></i>0972359666
          </li>
          <li>
            <i class="bi bi-telephone text-primary me-2"></i>
            <a href="tel:0972359666" class="text-primary">0972359666</a>
          </li>
          <li>
            <i class="bi bi-geo-alt-fill me-2"></i>147 Thanh Lâm, P. Phú Lương, TP. Hà Nội.
          </li>
          <li>
            <i class="bi bi-envelope-fill me-2"></i>
            <a href="mailto:thoitrangorchid@gmail.com">thoitrangorchid@gmail.com</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleSubmit = () => {
  alert("Form đã gửi!");
};
</script>

<style scoped>
/* ====== KHUNG NGOÀI ====== */
.wide-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 60px;
}

/* ====== TIÊU ĐỀ CHÍNH ====== */
.section-title {
  font-weight: bold;
  font-size: 24px;
  color: #222;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

/* ====== FORM ====== */
.form-title {
  font-size: 16px;
  color: #222;
  font-weight: 600;
}

.divider {
  border-top: 1px dotted #999;
  margin: 8px 0 20px;
}

/* Input fields */
.input-group-text {
  background-color: #fff;
  border-right: 0;
  color: #333;
  font-size: 15px;
}
.form-control {
  border-left: 0;
  font-size: 14px;
  padding: 8px;
  color: #333;
}
.form-control:focus {
  box-shadow: none;
  border-color: #bbb;
}

/* Textarea */
.message-box {
  height: 205px;
  font-size: 14px;
  resize: none;
}

/* Nút gửi */
.btn-submit {
  background-color: #333;
  color: #fff;
  font-weight: 600;
  padding: 10px 25px;
  font-size: 13px;
  border-radius: 2px;
  border: none;
}
.btn-submit:hover {
  background-color: #000;
}

/* ====== PHẦN BÊN PHẢI ====== */
.tagline {
  font-size: 15px;
  color: #222;
}

.contact-info li {
  font-size: 15px;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.5;
  display: flex;
  align-items: center;
}

.contact-info i {
  color: #000;
  font-size: 16px;
}

.contact-info a {
  text-decoration: none;
  color: #333;
}

.contact-info a:hover {
  text-decoration: underline;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap; 
}

</style>
