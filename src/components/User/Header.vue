<template>
  <header>
    <!-- Top Header -->
    <div class="top-header">
      <div class="container">
        <div class="top-header-content">
          <div class="contact-info">
            <div class="phone">
              <a href="tel:0972359666">
                <!-- Điện thoại -->
                <i class="bi bi-telephone"></i> 0972359666
              </a>
            </div>
            <div class="showroom-info">
              <!-- Showroom -->
              <i class="bi bi-geo-alt"></i> Hệ thống showroom
            </div>
          </div>
          <div class="search-cart">
            <div class="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                v-model="searchQuery"
              />
              <button type="button" @click="onSearch">
                <!-- Tìm kiếm -->
                <i class="bi bi-search"></i>
              </button>
            </div>
            <a href="#" class="cart">
              <!-- Giỏ hàng -->
              <i class="bi bi-cart"></i>
              <span>Giỏ hàng</span>
              <span class="cart-count">{{ cartCount }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="main-header">
      <div class="container">
        <div class="logo">
          <img src="/src/assets/images/logo.png" alt="Logo" />
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="navigation">
      <div class="container">
        <ul class="nav-list">
          <li><a href="#">Trang chủ</a></li>
          <li><a href="#">Bộ sưu tập</a></li>
          <li><a href="#">Mua sắm</a></li>
          <li><a href="#">Khuyến mãi</a></li>
          <li><a href="#">Nhượng quyền</a></li>
          <li><a href="#">Tin tức</a></li>
          <li><a href="#">Liên hệ</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      searchQuery: "",
      cartCount: 0,
    };
  },
  methods: {
    onSearch() {
      console.log("Searching for:", this.searchQuery);
      // Xử lý tìm kiếm ở đây
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

.top-header {
  background-color: #f8f8f8;
  padding: 10px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.top-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.phone a {
  color: #333;
  text-decoration: none;
}

.showroom-info {
  color: #333;
}

.search-cart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 8px 35px 8px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 250px;
}

.search-box button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.cart {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  text-decoration: none;
}

.main-header {
  padding: 20px 0;
}

.logo img {
  max-height: 60px;
}

.navigation {
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 30px;
}

.nav-list a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
}

.nav-list a:hover {
  color: #f00;
}
</style>

<!-- Link Font Awesome trong index.html hoặc main.js -->
