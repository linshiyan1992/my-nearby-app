<script setup>
import { ref, onMounted } from 'vue'
import { barLayer, coffeeShopLayer, foodStallLayer } from '../data/layers'
import Expand from '@arcgis/core/widgets/Expand'
import { view } from '../data/map'

const props = defineProps({
  position: String
})

const layersToggleUI = ref(null)
const layersToggle = ref([])
const layerList = [barLayer, coffeeShopLayer, foodStallLayer]

function handleLayerToggle(layer) {
  const targetName = layer.title
  let targetToggle
  for (let toggle of layersToggle.value) {
    if (toggle.id === targetName) {
      targetToggle = toggle
      break
    }
  }
  if (targetToggle) {
    layer.visible = targetToggle.checked
  }
}

onMounted(() => {
  const expand = new Expand({
    expandIcon: 'layers',
    view,
    content: layersToggleUI.value
  })
  view.ui.add(expand, props.position)
})
</script>

<template>
  <span id="layerToggle" class="esri-widget" ref="layersToggleUI">
    <div id="layerToggle-title">图层列表</div>
    <div id="layerToggle-item" v-for="layer in layerList" :key="layer.id">
      <input
        type="checkbox"
        :id="layer.title"
        ref="layersToggle"
        @click="handleLayerToggle(layer)"
        checked
      />
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
  border-radius: 20px;
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
  accent-color: green;
}
</style>
