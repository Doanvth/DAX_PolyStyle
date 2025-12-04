<template>
  <div class="sidebar d-flex flex-column" :class="{ collapsed: isCollapsed }">
    <!-- Header -->
    <div class="sidebar-header d-flex align-items-center justify-content-between">
      <div class="sidebar-logo d-flex align-items-center justify-content-center gap-2">
        <!-- Icon Logo -->
        <i class="bi bi-box-seam-fill logo-icon" v-if="isCollapsed"></i> 
        <span class="logo-text" v-if="!isCollapsed">ADMIN POLY</span>
      </div>
      <button class="toggle-btn" @click="toggleSidebar">
        <i :class="isCollapsed ? 'bi bi-chevron-double-right' : 'bi bi-chevron-double-left'"></i>
      </button>
    </div>


    <ul class="list-unstyled sidebar-menu flex-grow-1 mt-3">
      

      <router-link to="/admin" class="menu-item" active-class="active" exact>
        <i class="bi bi-speedometer2"></i>
        <span v-if="!isCollapsed">Bảng điều khiển</span>
      </router-link>


      <router-link to="/admin/products" class="menu-item" active-class="active">
        <i class="bi bi-box-seam"></i>
        <span v-if="!isCollapsed">Sản phẩm</span>
      </router-link>

 
      <router-link to="/admin/category" class="menu-item" active-class="active">
        <i class="bi bi-tags"></i>
        <span v-if="!isCollapsed">Danh mục</span>
      </router-link>

      <router-link to="/admin/order" class="menu-item" active-class="active">
        <i class="bi bi-receipt"></i>
        <span v-if="!isCollapsed">Đơn hàng</span>
      </router-link>

      <router-link to="/admin/user" class="menu-item" active-class="active">
        <i class="bi bi-people"></i>
        <span v-if="!isCollapsed">Khách hàng</span>
      </router-link>

      <router-link to="/admin/discountManagers" class="menu-item" active-class="active">
        <i class="bi bi-ticket-perforated"></i>
        <span v-if="!isCollapsed">Khuyến mãi</span>
      </router-link>

      <router-link to="/admin/store" class="menu-item" active-class="active">
        <i class="bi bi-shop"></i>
        <span v-if="!isCollapsed">Cửa hàng</span>
      </router-link>

      <router-link to="/admin/collection" class="menu-item" active-class="active">
        <i class="bi bi-collection"></i>
        <span v-if="!isCollapsed">Bộ sưu tập</span>
      </router-link>

      <router-link to="/admin/post" class="menu-item" active-class="active">
        <i class="bi bi-journal-text"></i>
        <span v-if="!isCollapsed">Bài viết</span>
      </router-link>

      <router-link to="/admin/banner" class="menu-item" active-class="active">
        <i class="bi bi-badge-ad"></i>
        <span v-if="!isCollapsed">Biểu ngữ</span>
      </router-link>

      <router-link to="/admin/revenue" class="menu-item" active-class="active">
        <i class="bi bi-bar-chart"></i>
        <span v-if="!isCollapsed">Doanh thu</span>
      </router-link>

    </ul>

    <div class="sidebar-logout mt-auto">
      <button class="logout-btn d-flex align-items-center justify-content-center gap-2 w-100">
        <i class="bi bi-box-arrow-right"></i>
        <span v-if="!isCollapsed">Đăng xuất</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

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

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #495057;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6c757d;
}

.sidebar {
  width: 260px; 
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1e1e2d; 
  color: #a2a3b7;
  padding: 20px 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: width 0.3s ease;
  font-family: "Inter", sans-serif;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;

  &.collapsed {
    width: 80px;
    padding: 20px 10px;

    .logo-text,
    .logout-btn span,
    .menu-item span {
      display: none;
    }

    .menu-item {
      justify-content: center;
      padding: 12px;
      
      i { margin-right: 0; font-size: 20px; }
    }
    
    .sidebar-header {
        justify-content: center;
        .toggle-btn { position: absolute; right: -12px; top: 25px; width: 24px; height: 24px; background: #3699ff; color: white; display: flex; align-items: center; justify-content: center; i { font-size: 12px; } }
        .sidebar-logo { display: none; }
    }
  }

  .sidebar-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    margin-bottom: 10px;
    position: relative;

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;

      .logo-icon {
        font-size: 24px;
        color: #3699ff;
      }

      .logo-text {
        font-weight: 700;
        font-size: 20px;
        color: #ffffff;
        letter-spacing: 0.5px;
      }
    }

    .toggle-btn {
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: #a2a3b7;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: #3699ff;
        color: #fff;
      }
    }
  }

  .sidebar-menu {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 5px; 

    .menu-item {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      border-radius: 8px;
      font-size: 14px;
      color: #a2a3b7;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none !important;
      transition: all 0.25s ease;
      margin-bottom: 5px;

      i {
        font-size: 18px;
        margin-right: 12px;
        color: #5e6278; 
        transition: color 0.2s;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.03);
        color: #ffffff;
        i { color: #3699ff; }
      }

      &.active {
        background: #1b1b29; 
        color: #ffffff;
        background: rgba(54, 153, 255, 0.1);
        
        i {
          color: #3699ff; 
        }
        
        font-weight: 600;
      }
    }
  }

  .sidebar-logout {
    flex-shrink: 0;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);

    .logout-btn {
      background: rgba(246, 78, 96, 0.1);
      color: #f64e60; 
      border: none;
      padding: 12px;
      border-radius: 8px;
      width: 100%;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: #f64e60;
        color: #fff;
      }

      i {
        font-size: 18px;
      }
    }
  }
}
</style>