<template>
  <div class="sidebar d-flex flex-column" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header d-flex align-items-center justify-content-between">
      <div class="sidebar-logo d-flex align-items-center justify-content-center gap-2">
        <i class="bi bi-box-seam-fill logo-icon" v-if="isCollapsed"></i>
        <span class="logo-text" v-if="!isCollapsed">ADMIN POLY</span>
      </div>
      <button class="toggle-btn" @click="toggleSidebar">
        <i :class="isCollapsed ? 'bi bi-chevron-double-right' : 'bi bi-chevron-double-left'"></i>
      </button>
    </div>

    <ul class="list-unstyled sidebar-menu flex-grow-1 mt-3">
      <li v-for="item in menuItems" :key="item.path">
        <router-link :to="item.path" class="menu-item" :class="{ active: isActive(item.path) }"
          :title="isCollapsed ? item.label : ''">
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </li>
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
import { useRoute } from "vue-router";

const props = defineProps({ collapsed: Boolean });
const emit = defineEmits(["toggle"]);
const route = useRoute();

const isCollapsed = ref(props.collapsed);

const menuItems = [
  { path: '/admin', icon: 'bi bi-speedometer2', label: 'Bảng điều khiển' },
  { path: '/admin/products', icon: 'bi bi-box-seam', label: 'Sản phẩm' },
  { path: '/admin/category', icon: 'bi bi-tags', label: 'Danh mục SP' },
  { path: '/admin/order', icon: 'bi bi-receipt', label: 'Đơn hàng' },
  { path: '/admin/user', icon: 'bi bi-people', label: 'Khách hàng' },
  { path: '/admin/discountManagers', icon: 'bi bi-ticket-perforated', label: 'Khuyến mãi' },
  { path: '/admin/store', icon: 'bi bi-shop', label: 'Cửa hàng' },
  { path: '/admin/collection', icon: 'bi bi-collection', label: 'Bộ sưu tập' },

  { path: '/admin/article-category', icon: 'bi bi-bookmark', label: 'Danh mục bài viết' },

  { path: '/admin/post', icon: 'bi bi-journal-text', label: 'Bài viết' },
  { path: '/admin/banner', icon: 'bi bi-badge-ad', label: 'Biểu ngữ' },
  { path: '/admin/revenue', icon: 'bi bi-bar-chart', label: 'Doanh thu' },
];

watch(
  () => props.collapsed,
  (val) => (isCollapsed.value = val)
);

const toggleSidebar = () => {
  emit("toggle");
};

const isActive = (menuPath) => {
  const currentPath = route.path.toLowerCase();
  const targetPath = menuPath.toLowerCase();

  if (targetPath === '/admin') {
    return currentPath === '/admin';
  }

  const mappings = {
    '/admin/products': ['/admin/addproducts', '/admin/product', '/admin/products'],
    '/admin/discountmanagers': ['/admin/adddiscounts', '/admin/discountmanagers', '/admin/discounts'],
    '/admin/post': ['/admin/addposts', '/admin/posts', '/admin/post'],
    '/admin/banner': ['/admin/addbanners', '/admin/banner'],
    '/admin/store': ['/admin/store', '/admin/addstore'],
    '/admin/category': ['/admin/category', '/admin/addcategory'], 
    '/admin/collection': ['/admin/collection', '/admin/addcollection'],

    '/admin/article-category': ['/admin/article-category', '/admin/article-category/add']
  };

  if (mappings[targetPath]) {
    const isMatch = mappings[targetPath].some(alias => currentPath.startsWith(alias.toLowerCase()));
    if (isMatch) return true;
  }

  return currentPath.startsWith(targetPath);
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

      i {
        margin-right: 0;
        font-size: 20px;
      }
    }

    .sidebar-header {
      justify-content: center;

      .toggle-btn {
        position: absolute;
        right: -12px;
        top: 25px;
        width: 24px;
        height: 24px;
        background: #3699ff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        i {
          font-size: 12px;
        }
      }

      .sidebar-logo {
        display: none;
      }
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

    li {
      margin-bottom: 5px;
    }

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

      i {
        font-size: 18px;
        margin-right: 12px;
        color: #5e6278;
        transition: color 0.2s;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.03);
        color: #ffffff;

        i {
          color: #3699ff;
        }
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