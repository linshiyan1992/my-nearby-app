<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { watch } from '@arcgis/core/core/reactiveUtils'
import Expand from '@arcgis/core/widgets/Expand'
import { view } from '../data/map'

const props = defineProps({ position: String })

const center = ref({ x: null, y: null })

const locationDiv = ref(null)

watchEffect(() => {
  watch(
    () => view.center,
    (value) => {
      const { longitude, latitude } = value
      center.value.x = longitude
      center.value.y = latitude
    }
  )
})

function addWidget() {
  const expand = new Expand({
    expandIcon: 'point',
    view,
    content: locationDiv.value
  })
  view.ui.add(expand, props.position)
}

onMounted(() => {
  addWidget()
})
</script>

<template>
  <div id="locationDiv" ref="locationDiv">
    <div id="location-title">当前坐标:</div>
    <div>X:{{ center.x?.toFixed(3) }}</div>
    <div>Y:{{ center.y?.toFixed(3) }}</div>
  </div>
</template>

<style scoped>
#locationDiv {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px 30px;
  background-color: white;
  color: #666;
  border-radius: 5px;
}
</style>
