<template>
  <div class="admin-layout" :class="{ collapsed: isCollapsed }">
    <Sidebar :collapsed="isCollapsed" @toggle="toggleSidebar" />

    <div class="main-content">
      <Header />
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/admin/Sidebar.vue";
import Header from "@/components/admin/Header.vue";
import { ref } from "vue";

const isCollapsed = ref(false);
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 200;
}

.main-content {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9f9fb;
  left: 240px;
  transition: left 0.3s ease;
}

header.admin-header {
  height: 64px;
  background: #fff;
  z-index: 150;
  border-bottom: 1px solid #e4e6ef;
  width: 100%;
}

.admin-layout.collapsed .main-content {
  left: 80px;
}

.page-content {
  flex: 1;
  padding: 24px;
  padding-bottom: 80px;
  overflow-y: auto;
  background: #f5f7fb;

  height: 100%;
  padding-top: 24px;
}

</style>
