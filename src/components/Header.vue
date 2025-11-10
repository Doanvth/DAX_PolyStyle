<template>
  <header class="border-b border-gray-200">
    <!-- Top bar -->
    <div
      class="flex justify-between items-center bg-gray-50 px-10 py-2 text-sm text-gray-700"
    >
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-phone text-black"></i>
          <span>0972359666</span>
        </div>
        <a href="#" class="hover:text-black">Hệ thống showroom</a>
      </div>

      <div class="flex items-center space-x-2 w-1/3">
        <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          class="flex-1 border-b border-gray-300 outline-none bg-transparent focus:border-gray-500"
        />
      </div>

      <div class="flex items-center space-x-6">
        <a href="#" class="hover:text-black">Tra cứu đơn hàng</a>
        <div class="relative flex items-center space-x-2">
          <i class="fa-solid fa-cart-shopping text-black"></i>
          <span>Giỏ hàng</span>
          <span
            class="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >1</span
          >
        </div>
      </div>
    </div>

    <!-- Main navigation -->
    <div class="flex justify-between items-center px-10 py-3">
      <div class="flex items-center space-x-2">
        <img
          src="/src/assets/images/logo.png"
          alt="Orchid Logo"
          class="h-12 object-contain"
        />
        <p class="text-xs text-gray-600 italic">Dẫn Lối Thời Trang Phái Đẹp</p>
      </div>

      <nav>
        <ul class="flex space-x-10 text-base font-semibold">
          <li><a href="#" class="hover:text-black">TRANG CHỦ</a></li>
          <li><a href="#" class="hover:text-black">BỘ SƯU TẬP</a></li>
          <li><a href="#" class="hover:text-black">MUA SẮM</a></li>
          <li><a href="#" class="hover:text-black">KHUYẾN MẠI</a></li>
          <li><a href="#" class="hover:text-black">NHƯỢNG QUYỀN</a></li>
          <li><a href="#" class="hover:text-black">TIN TỨC</a></li>
          <li><a href="#" class="hover:text-black">LIÊN HỆ</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
// Không cần logic phức tạp cho header này
</script>

<style scoped>
header {
  font-family: "Helvetica Neue", sans-serif;
}
input::placeholder {
  color: #999;
}
</style>
