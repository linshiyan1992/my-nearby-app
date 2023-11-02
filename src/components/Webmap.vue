<script setup>
import { ref, onMounted } from 'vue'

import LayerToggle from '../widgets/LayerToggle.vue'

const mapDiv = ref(null)

import { initialize, addLayers } from '../data/map'

onMounted(async () => {
  const view = await initialize(mapDiv.value)
  addLayers()
  view.ui.add('layerToggle', 'top-right')
})
</script>
<template>
  <div id="mapDiv" ref="mapDiv"></div>
  <LayerToggle></LayerToggle>
</template>

<style scoped>
#mapDiv {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
