<template>
  <div class="sidebar d-flex flex-column" :class="{ collapsed: isCollapsed }">
    <div
      class="sidebar-header d-flex align-items-center justify-content-between"
    >
      <div
        class="sidebar-logo d-flex align-items-center justify-content-center gap-2"
      >
        <span class="logo-text" v-if="!isCollapsed">Poly-Smartshop</span>
      </div>
      <button class="toggle-btn" @click="toggleSidebar">
        <i
          :class="
            isCollapsed
              ? 'bi bi-chevron-double-right'
              : 'bi bi-chevron-double-left'
          "
        ></i>
      </button>
    </div>

    <ul class="list-unstyled sidebar-menu flex-grow-1 mt-3">
      <router-link to="/admin" class="menu-item" exact-active-class="active">
        <i class="bi bi-speedometer2"></i>
        <span v-if="!isCollapsed">Bảng điều khiển</span>
      </router-link>

      <router-link
        to="/admin/user"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-people"></i>
        <span v-if="!isCollapsed">Khách hàng</span>
      </router-link>

      <router-link
        to="/admin/category"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-tags"></i>
        <span v-if="!isCollapsed">Danh mục</span>
      </router-link>

      <router-link
        to="/admin/products"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-box-seam"></i>
        <span v-if="!isCollapsed">Sản phẩm</span>
      </router-link>

      <router-link
        to="/admin/order"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-receipt"></i>
        <span v-if="!isCollapsed">Đơn hàng</span>
      </router-link>

      <router-link
        to="/admin/store"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-shop"></i>
        <span v-if="!isCollapsed">Cửa hàng</span>
      </router-link>

      <router-link
        to="/admin/collection"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-collection"></i>
        <span v-if="!isCollapsed">Bộ sưu tập</span>
      </router-link>

      <router-link
        to="/admin/post"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-journal-text"></i>
        <span v-if="!isCollapsed">Bài viết</span>
      </router-link>

      <router-link
        to="/admin/banner"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-badge-ad"></i>
        <span v-if="!isCollapsed">Biểu ngữ</span>
      </router-link>

      <router-link
        to="/admin/revenue"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-bar-chart"></i>
        <span v-if="!isCollapsed">Doanh thu</span>
      </router-link>
    </ul>

    <!-- Logout -->
    <div class="sidebar-logout mt-auto">
      <button
        class="logout-btn d-flex align-items-center justify-content-center gap-2 w-100"
      >
        <i class="bi bi-box-arrow-right"></i>
        <span v-if="!isCollapsed">Đăng xuất</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";

const props = defineProps({ collapsed: Boolean });
const emit = defineEmits(["toggle"]);

const isCollapsed = ref(props.collapsed);

watch(
  () => props.collapsed,
  (val) => (isCollapsed.value = val)
);

const toggleSidebar = () => {
  emit("toggle");
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.sidebar {
  width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #212529; 
  color: #f8f9fa;
  padding: 16px;
  border-right: 1px solid #495057; 
  transition: width 0.3s ease;
  font-family: "Inter", sans-serif;

  &.collapsed {
    width: 80px;

    .logo-text,
    .logout-btn span,
    .menu-item span {
      display: none;
    }

    .menu-item {
      justify-content: center;
    }
  }

  .sidebar-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 8px;

      .logo-icon {
        font-size: 26px;
        color: #ffc107;
        transition: transform 0.3s ease;
      }

      &:hover .logo-icon {
        transform: rotate(10deg) scale(1.1);
      }

      .logo-text {
        font-weight: 700;
        font-size: 19px;
        color: #ffc107; 
      }
    }

    .toggle-btn {
      background: rgba(255, 193, 7, 0.15); 
      border: none;
      color: #ffc107; 
      border-radius: 50%;
      width: 34px;
      height: 34px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 193, 7, 0.3);
        color: #fff;
      }
    }
  }

  .sidebar-menu {
    flex: 1;
    overflow-y: auto;
    margin-top: 16px;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 18px 16px;
      border-radius: 10px;
      font-size: 15px;
      color: #f8f9fa;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none !important;
      transition: all 0.25s ease;

      i {
        font-size: 18px;
        opacity: 0.85;
        color: #fdb813; 
      }

      &:hover {
        background: rgba(255, 193, 7, 0.1);
        color: #ffc107;

        i {
          color: #ffc107; 
        }
      }
    }

    .menu-item.active {
     
      color: #ffc107;

      i {
        color: #dbb117;
        opacity: 1;
      }
    }
  }

  .sidebar-logout {
    flex-shrink: 0;

    .logout-btn {
      background: rgba(255, 193, 7, 0.15);
      color: #ffc107;
      border: none;
      padding: 10px;
      border-radius: 8px;
      width: 100%;
      transition: all 0.3s ease;

      &:hover {
        color: #ffc107;
      }

      i {
        font-size: 16px;
        color: #fdb813;
      }
    }
  }
}
</style>