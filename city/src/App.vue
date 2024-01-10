<template>
  <canvas id="webgl">浏览器不支持canvas， 请切换浏览器</canvas>
  <div class="buttonGroup">
    <div class="buttonItem" @click="toSnow">下雪</div>
    <div class="buttonItem" @click="toRain">下雨</div>
    <div class="buttonItem" @click="toSmoke">烟雾预警</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { initCity } from './enter/index';

let cityAll = null;

function toSnow () {
  cityAll.startOrStopSnow();
}

function toRain () {
  cityAll.startOrStopRain();
}

function toSmoke () {
  cityAll.startOrStopSmoke();
}

onMounted(() => {
  cityAll = initCity();
});
</script>

<style scoped>
.buttonGroup {
  position: absolute;
  right: 0;
  top: 40px;
  width: 120px;
  min-height: 100px;
  background-color: #fff;
  cursor: pointer;
}

.buttonItem {
  width: 100%;
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  text-align: center;
  border-bottom: 1px solid #3300ff;
}
</style>
