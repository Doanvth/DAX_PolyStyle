<template>
  <div class="profile-sidebar">
    <div class="user-info">
      <div class="user-text">
        <span>Xin chào,</span>
        <strong>{{ userName || '...' }}</strong>
      </div>
    </div>
    
    <nav class="navigation">
      <ul>
        <li>
          <router-link to="/profile">Hồ sơ cá nhân</router-link>
        </li>
        <li>
          <router-link to="/profile/addresses">Sổ địa chỉ</router-link>
        </li>
        <li>
          <router-link to="/profile/orders">Đơn hàng của tôi</router-link>
        </li>
        <li>
          <router-link to="/profile/vouchers">Ví voucher</router-link>
        </li>
        <li>
          <a style="background-color: red; color: white;" href="#" @click.prevent="logout">Đăng xuất</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  userName: String,
  avatar: String
});

const logout = () => {
  alert('Đã đăng xuất!');
}
</script>

<style scoped>
.profile-sidebar {
  display: flex;
  flex-direction: column;
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #f0f0f0; 
}
.user-text {
  display: flex;
  flex-direction: column;
}
.user-text span {
  font-size: 0.9em;
  color: #555;
}
.user-text strong {
  font-size: 1.1em;
  color: #000;
}
.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.navigation li {
  margin-bottom: 10px;
}
.navigation a {
  text-decoration: none;
  color: #333;
  font-size: 1em;
  padding: 8px 10px;
  display: block;
  border-radius: 5px;
}
.navigation a:hover,
.navigation a.router-link-active {
  background-color: #f0f0f0;
  color: #000;
  font-weight: bold;
}
</style>