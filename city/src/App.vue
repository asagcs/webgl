<template>
  <canvas id="webgl">浏览器不支持canvas， 请切换浏览器</canvas>
</template>

<script setup>
import { onMounted } from 'vue';
import { initCity } from './enter/index';


onMounted(() => {
  initCity();
});
</script>

<style scoped>
</style>
