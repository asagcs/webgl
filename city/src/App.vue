<template>
  <canvas id="webgl">浏览器不支持canvas， 请切换浏览器</canvas>
  <div class="buttonGroup">
    <div class="buttonItem" @click="toSnow">下雪</div>
    <div class="buttonItem" @click="toRain">下雨</div>
    <div class="buttonItem" @click="toSmoke">烟雾预警</div>
    <div class="buttonItem" @click="toInsertDom">插入元素</div>
  </div>
  <div class="left_content">
    <div class="left_content_item">
      <div>
        我点的是{{ objname }}
      </div>
    </div>
    <div class="left_content_item" ref="chartsWrapper">

    </div>
    <div class="left_content_item">

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { initCity } from './enter/index';
import { initCharts } from './utils/creatCharts';

let cityAll = null;

const objname = ref('');
const chartsWrapper = ref();

function changeName (name) {
  objname.value = name;
}

function toInsertDom () {
  cityAll.loadTemperature();
}

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
  cityAll = initCity(changeName);
  initCharts(chartsWrapper.value)
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

.left_content {
  position: absolute;
  top: 70px;
  left: 0;
  width: 22vw;
  height: calc(100vh - 70px);
  z-index: 20;
  display: flex;
  flex-direction: column;
  background-color: #3300ff99;
  color: #fff;
}

.left_content_item {
  flex: 1;
}
</style>
