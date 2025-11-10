<script setup>
import Header from "./components/Header.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
main {
  min-height: 100vh;
}
</style>
