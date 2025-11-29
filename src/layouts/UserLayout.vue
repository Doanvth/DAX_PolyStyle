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
import Header from "@/components/User/Header.vue";
import Footer from "@/components/User/Footer.vue";
</script>
