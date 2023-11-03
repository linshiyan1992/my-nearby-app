<script setup>
import { ref, onMounted } from 'vue'

import LayerToggle from '../widgets/LayerToggle.vue'
import ShowingPosition from '../widgets/ShowingPosition.vue'
import ShowGeocoding from '../widgets/ShowGeocoding.vue'

const mapDiv = ref(null)

import { initialize, addLayers } from '../data/map'

onMounted(async () => {
  await initialize(mapDiv.value)
  addLayers()
})
</script>
<template>
  <div id="mapDiv" ref="mapDiv"></div>
  <LayerToggle position="top-right" />
  <ShowingPosition position="top-right" />
  <ShowGeocoding />
</template>

<style scoped>
#mapDiv {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
