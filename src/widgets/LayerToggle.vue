<script setup>
import { ref } from 'vue'
import { barLayer, coffeeShopLayer, foodStallLayer } from '../data/layers'

const checkbox = ref(null)
const layerList = [barLayer, coffeeShopLayer, foodStallLayer]

function handleLayerToggle(layer) {
  layer.visible = value.checked
}
</script>

<template>
  <span id="layerToggle" class="esri-widget">
    <div id="layerToggle-title">图层列表</div>
    <div id="layerToggle-item" v-for="layer in layerList" :key="layer.title">
      <input type="checkbox" :id="layer.title" @click="handleLayerToggle(layer)" />
      <label for="layer.title">{{ layer.title }}</label>
    </div>
  </span>
</template>

<style scoped>
#layerToggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  width: 200px;
  height: 200px;
  padding: 10px 20px;
}

#layerToggle-title {
  font-size: 20px;
  margin-bottom: 20px;
}

#layerToggle-item {
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 10px;
  font-size: 18px;
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
}
</style>
