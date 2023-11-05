<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { watch } from '@arcgis/core/core/reactiveUtils'
import Expand from '@arcgis/core/widgets/Expand'
import { view } from '../data/map'
import { DocumentCopy } from '@element-plus/icons-vue'

import { ElButton } from 'element-plus'

const props = defineProps({ position: String })

const center = ref({ x: null, y: null, zoom: null })

const locationDiv = ref(null)

watchEffect(() => {
  watch(
    () => view.center,
    (value) => {
      const { longitude, latitude } = value
      center.value.x = longitude
      center.value.y = latitude
      center.value.zoom = view.zoom
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

function saveToClipboard(content) {
  navigator.clipboard.writeText(content)
}

function saveLocation() {
  saveToClipboard(`[${center.value.x.toFixed(3)},${center.value.y.toFixed(3)}]`)
}

function saveZoom() {
  saveToClipboard(`${center.value.zoom}`)
}

onMounted(() => {
  addWidget()
})
</script>

<template>
  <div id="locationDiv" ref="locationDiv">
    <div id="location-title">当前坐标:</div>
    <div>X:{{ center.x?.toFixed(5) }}</div>
    <div>Y:{{ center.y?.toFixed(5) }}</div>
    <div>Zoom:{{ center.zoom }}</div>
    <div id="location-button-group">
      <el-button @click="saveLocation">复制屏幕坐标</el-button>
      <el-button @click="saveZoom">复制缩放级别</el-button>
    </div>
  </div>
</template>

<style scoped>
#locationDiv {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 30px;
  background-color: white;
  color: #666;
  border-radius: 5px;
}

#locationDiv > div {
  margin-bottom: 8px;
}

#location-button-group {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
