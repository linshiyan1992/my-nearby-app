<script setup>
import { view } from '../data/map'
import { ref, onMounted, onUnmounted } from 'vue'
import { watch } from '@arcgis/core/core/reactiveUtils'
import axios from 'axios'

const gaodeKey = import.meta.env.VITE_GAODE_KEY

const location = ref(null)

async function queryGeocodingInfo(x, y) {
  const url = 'https://restapi.amap.com/v3/geocode/regeo?parameters'
  const params = {
    key: gaodeKey,
    location: `${x},${y}`,
    extensions: 'all'
  }
  const result = await axios.get(url, { params })
  return result
}

function handleSearch(x, y) {
  const result = queryGeocodingInfo(x, y)
  result.then((res) => console.log(res))
}

function setupWatchEvent() {
  console.log('...setting up watch event')
  view.on('double-click', (event) => {
    const { x, y } = event
    console.log(x, y)
    handleSearch(x, y)
  })
}

onMounted(() => {
  setupWatchEvent()
})
</script>

<template>
  <div id="PopupMenu"></div>
</template>

<style scoped></style>
