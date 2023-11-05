<script setup>
import { view } from '../data/map'
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import coordtransform from 'coordtransform'

const gaodeKey = import.meta.env.VITE_GAODE_KEY

const location = ref({
  name: null,
  address: null,
  longitude: null,
  latitude: null
})

const popOver = ref(null)

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

async function handleSearch(x, y) {
  const result = await queryGeocodingInfo(x, y)
  location.value.name = result.data.regeocode.aois[0]?.name || '无'
  location.value.address = result.data.regeocode.formatted_address
  location.value.longitude = x
  location.value.latitude = y
}

function setPopOver(mapPoint) {
  const popupDiv = popOver.value
  view.openPopup({
    title: `名称：${location.value.name}`,
    location: mapPoint,
    content: popupDiv
  })
}

async function setupWatchEvent() {
  view.when(() => {
    view.on('double-click', async (event) => {
      const mapPoint = event.mapPoint
      const { longitude, latitude } = mapPoint
      const transformResult = coordtransform.wgs84togcj02(longitude, latitude)
      await handleSearch(...transformResult)
      setPopOver(mapPoint)
    })
  })
}

onMounted(() => {
  setupWatchEvent()
})
</script>

<template>
  <div id="popOver" ref="popOver">地址：{{ location.address }}</div>
</template>

<style scoped></style>
