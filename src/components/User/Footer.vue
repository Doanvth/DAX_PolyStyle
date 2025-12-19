<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4 class="title">Thông tin công ty</h4>
          <h5><strong>CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI TUẤN TRANG</strong></h5>
          <p>
            Giấy chứng nhận đăng ký kinh doanh số 0106062077 do Sở kế hoạch và đầu tư Thành phố Hà Nội cấp ngày 17/12/2012
          </p>
          <p>Địa chỉ: Số 147 đường Thanh Lâm, Phường Phú Lương, Thành phố Hà Nội, Việt Nam</p>
          <p>Điện thoại: 0972.359.666</p>
          <p>Email: thoitrangorchid@gmail.com</p>
          <p>Đại diện theo pháp luật: <strong>HÀ QUỐC VIỆT</strong></p>

          <img
            src="@/assets/images/dathongbaobocongthuong.png"
            alt="Đã thông báo Bộ Công Thương"
            class="gov-logo"
          />
        </div>
        <div class="footer-col">
          <h4 class="title">Chính sách khách hàng</h4>
          <ul>
            <li>Chính sách thẻ VIP</li>
            <li>Chính sách tích điểm - tiêu điểm</li>
            <li>Chính sách ưu đãi sinh nhật</li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="title">Hỗ trợ khách hàng</h4>
          <ul>
            <li>Chính sách bảo hành</li>
            <li>Chính sách bảo mật thông tin</li>
            <li>Chính sách đổi trả hàng và hoàn tiền</li>
            <li>Chính sách hoạt động và quy định chung</li>
            <li>Chính sách kiểm hàng</li>
            <li>Chính sách vận chuyển</li>
            <li>Thông tin về hình thức thanh toán</li>
            <li>Thông tin về điều kiện giao dịch chung</li>
            <li>Thông tin sản phẩm</li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="title">Đăng ký để nhận ưu đãi mới nhất</h4>
          <input type="text" placeholder="Họ và tên" v-model="name" />
          <input type="text" placeholder="Số điện thoại" v-model="phone" />
          <input type="email" placeholder="Email" v-model="email" />
          <button @click="registerNewsletter">Đăng ký ngay</button>
        </div>
      </div>

      <div class="footer-bottom ">
        <div class="connect">
          <span>Kết nối với chúng tôi</span>
          <div class="icons">
            <i class="bi bi-facebook"></i>
            <i class="bi bi-tiktok"></i>
            <i class="bi bi-youtube"></i>
            <i class="bi bi-chat-dots"></i>
            <i class="bi bi-telephone-fill"></i>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterSection",
  data() {
    return { name: "", phone: "", email: "" };
  },
  methods: {
    registerNewsletter() {
      alert(`Cảm ơn ${this.name} đã đăng ký nhận ưu đãi!`);
      this.name = this.phone = this.email = "";
    },
  },
};
</script>

<style scoped>
.footer {
  background-color: #fff;
  border-top: 1px solid #000;
  padding: 40px 0 0;
  font-family: Arial, sans-serif;
  color: #222;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  align-items: start;
  gap: 40px;
}


/* Tiêu đề */
.title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 12px;
}

/* Nội dung text */
.footer-col p {
  font-size: 14px;
  color: #222;
  line-height: 1.6;
  margin-bottom: 6px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  font-size: 14px;
  color: #222;
  margin-bottom: 8px;
}

/* 🔹 Logo Bộ Công Thương */
.gov-logo {
  width: 140px;
  margin-top: 15px;
}

/* Form đăng ký ưu đãi */
.footer-col input {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #eee;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 14px;
}

.footer-col button {
  width: 100%;
  padding: 8px;
  background-color: #4a90ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}
.footer-col button:hover {
  background-color: #2f73e0;
}

/* Phần cuối (Kết nối với chúng tôi) */
.footer-bottom {
  border-top: 1px solid #000;
  margin-top: 30px;
  padding: 10px 0;
  text-align: center;
}

.connect {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.connect span {
  font-size: 14px;
  color: #222;
}

.icons {
  display: flex;
  gap: 10px;
}

.icons i {
  font-size: 28px;
  background: #fff;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.icons i:hover {
  transform: scale(1.1);
}
</style>
