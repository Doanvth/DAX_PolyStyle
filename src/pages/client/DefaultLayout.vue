<script setup>
import Header from '../../components/Head.vue';
import Footer from '../../components/Footer.vue';
</script>

<template>
  <Header></Header>
  <div class="container">
    <RouterView></RouterView>
  </div>
  <Footer></Footer>
</template>