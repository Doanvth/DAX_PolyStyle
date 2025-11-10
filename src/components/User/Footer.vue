<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Thông tin công ty -->
        <div class="footer-section">
          <h3>Thông tin công ty</h3>
          <div class="company-info">
            <p>
              <strong>CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI TUẤN TRANG</strong>
            </p>
            <p>
              Giấy chứng nhận đăng ký kinh doanh số 0106002077 do Sở kế hoạch và
              đầu tư Thành phố Hà Nội cấp ngày 17/12/2012
            </p>
            <p>
              <i class="bi bi-geo-alt"></i> Địa chỉ: Số 147 đường Thanh Lâm,
              Phường Phú Lương, Thành phố Hà Nội, Việt Nam
            </p>
            <p><i class="bi bi-telephone"></i> Điện thoại: 0972.359.666</p>
            <p>
              <i class="bi bi-envelope"></i> Email: thoitrangtuanchid@gmail.com
            </p>
            <p>Đại diện theo pháp luật: <strong>HÀ QUỐC VIỆT</strong></p>
            <div class="certified-logo">
              <img
                src="/src/assets/images/logo.png"
                alt="Đã thông báo Bộ Công Thương"
              />
            </div>
          </div>
        </div>

        <!-- Chính sách khách hàng -->
        <div class="footer-section">
          <h3>Chính sách khách hàng</h3>
          <ul>
            <li><a href="#">Chính sách thẻ VIP</a></li>
            <li><a href="#">Chính sách tích điểm - tiêu điểm</a></li>
            <li><a href="#">Chính sách ưu đãi sinh nhật</a></li>
            <li><a href="#">Chính sách hoạt động và quy định chung</a></li>
            <li><a href="#">Chính sách kiểm hàng</a></li>
            <li><a href="#">Chính sách vận chuyển</a></li>
            <li><a href="#">Thông tin về hình thức thanh toán</a></li>
            <li><a href="#">Thông tin về điều kiện giao dịch chung</a></li>
            <li><a href="#">Thông tin sản phẩm</a></li>
          </ul>
        </div>

        <!-- Hỗ trợ khách hàng -->
        <div class="footer-section">
          <h3>Hỗ trợ khách hàng</h3>
          <ul>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Chính sách bảo mật thông tin</a></li>
            <li><a href="#">Chính sách đổi trả hàng và hoàn tiền</a></li>
          </ul>
        </div>

        <!-- Đăng ký nhận ưu đãi -->
        <div class="footer-section">
          <h3>Đăng ký để nhận ưu đãi mới nhất</h3>
          <div class="newsletter-form">
            <input type="text" placeholder="Họ và tên" v-model="name" />
            <input type="tel" placeholder="Số điện thoại" v-model="phone" />
            <input type="email" placeholder="Email" v-model="email" />
            <button type="button" @click="registerNewsletter">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>

      <!-- Mạng xã hội -->
      <div class="social-links">
        <h4>Kết nối với chúng tôi</h4>
        <div class="social-icons">
          <a href="#"><i class="bi bi-facebook"></i></a>
          <a href="#"><i class="bi bi-tiktok"></i></a>
          <a href="#"><i class="bi bi-youtube"></i></a>
          <a href="#"><i class="bi bi-messenger"></i></a>
          <a href="#"><i class="bi bi-chat-dots"></i></a>
          <a href="#"><i class="bi bi-telephone-fill"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      name: "",
      phone: "",
      email: "",
    };
  },
  methods: {
    registerNewsletter() {
      console.log("Đăng ký nhận ưu đãi:", {
        name: this.name,
        phone: this.phone,
        email: this.email,
      });
      // Xử lý gửi dữ liệu newsletter ở đây
      alert("Cảm ơn bạn đã đăng ký!");
      this.name = "";
      this.phone = "";
      this.email = "";
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.footer {
  background-color: #f8f8f8;
  padding: 50px 0;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #007bff;
}

.company-info p {
  margin-bottom: 10px;
  color: #666;
  line-height: 1.6;
}

.social-links {
  margin-top: 30px;
  text-align: center;
}

.social-links h4 {
  margin-bottom: 15px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icons a {
  color: #333;
  font-size: 24px;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #007bff;
}

.newsletter-form {
  margin-top: 20px;
}

.newsletter-form input {
  padding: 8px;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.newsletter-form button {
  padding: 8px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.newsletter-form button:hover {
  background-color: #0056b3;
}

.certified-logo img {
  max-width: 150px;
  margin-top: 20px;
}
</style>
