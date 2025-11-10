<template>
  <div>
    <Header></Header>
    <main style="padding: 20px">
      <router-view />
    </main>
    <Footer></Footer>
  </div>
</template>
<script setup>
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
</script>
