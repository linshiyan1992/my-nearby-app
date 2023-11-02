<script setup>
import { ref, onMounted } from 'vue'

const mapDiv = ref(null)

import { initialize, addLayers } from '../data/map'

onMounted(() => {
  initialize(mapDiv.value).then(addLayers)
  // addLayers()
})
</script>
<template>
  <div id="mapDiv" ref="mapDiv"></div>
</template>

<style scoped>
#mapDiv {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
