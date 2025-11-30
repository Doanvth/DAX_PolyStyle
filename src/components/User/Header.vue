<template>
  <header>
    <div class="top-header">
      <div class="container">
        <div class="top-header-content">
          <div class="contact-info">
            <div class="phone">
              <a href="tel:0972359666">
                <i class="bi bi-telephone"></i> 0972359666
              </a>
            </div>
            <div class="showroom-info">
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
                <i class="bi bi-search"></i>
              </button>
            </div>

            <div  class="auth-links">
              <i class="bi bi-cart"></i>
              <span><router-link to="/shoppingCart">Giỏ hàng</router-link></span>
              <span class="cart-count">{{ cartCount }}</span>
            </div>

            <div class="auth-links">
              <router-link to="/login">Đăng nhập</router-link>
              <span>/</span>
              <router-link to="/register">Đăng ký</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-header">
      <div class="container header-flex">
        <div class="logo">
          <img src="/src/assets/images/logo.png" alt="Logo" />
        </div>

        <nav class="navigation">
          <ul class="nav-list">
            <li><router-link to="/">Trang chủ</router-link></li>
            <li><router-link to="/album">Bộ sưu tập</router-link></li>
            <li><router-link to="/ProductPageView">Mua sắm</router-link></li>
            <li><a href="#">Khuyến mãi</a></li>
            <li><router-link to="/franchise">Nhượng quyền</router-link></li>
            <li><router-link to="/NewsPageView">Tin tức</router-link></li>
            <li><router-link to="/contact">Liên hệ</router-link></li>
            <li><router-link to="/profile">Profile</router-link></li>
          </ul>
        </nav>
      </div>
    </div>
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

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 10px;
}

.top-header {
  background-color: #f8f8f8;
  padding: 10px 0;
  font-size: 14px; 
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
.phone a:hover {
  color: #f00;
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
  color: #555;
}

.cart {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  text-decoration: none;
}
.cart:hover {
  color: #f00;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.auth-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.auth-links a:hover {
  color: #f00;
}

.auth-links span {
  color: #ccc;
  font-size: 12px;
}

.main-header {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-flex {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 50px;
}

.logo img {
  max-height: 50px;
  width: auto;
  display: block;
}

.navigation {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  padding: 0;
  margin: 0;
}

.nav-list {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 30px;
}

.nav-list a {
  color: #333;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 0;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.nav-list a.router-link-exact-active {
  color: #f00;
}

.nav-list a:hover {
  color: #f00;
}
</style>