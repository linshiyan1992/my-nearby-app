<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useFloating, autoUpdate, hide, flip, offset } from '@floating-ui/vue'
import { view } from '../data/map'
import Point from '@arcgis/core/geometry/Point'
import { barLayer, coffeeShopLayer } from '../data/layers'
import { ElButton } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  boundary: HTMLElement
})

const floating = ref(null)
const reference = ref(null)
const middleware = ref([])
const featureLocation = ref({ x: null, y: null })
const featureInfo = ref(null)
const isVisible = ref(false)
const frameLeft = ref(null)
const frameTop = ref(null)

const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  placement: 'top',
  whileElementsMounted: autoUpdate,
  middleware
})

watch(middlewareData, () => {
  if (middlewareData.value === null) return
  const { referenceHidden } = middlewareData.value.hide
  Object.assign(floating.value.style, {
    visibility: referenceHidden ? 'hidden' : 'visible'
  })
})

async function queryFeature(graphic) {
  const layerView = await view.whenLayerView(coffeeShopLayer)
  const featureSet = await layerView.queryFeatures({
    geometry: graphic.geometry,
    returnGeometry: true
  })
  const attributes = featureSet.features[0].attributes
  const { name, address } = attributes
  featureInfo.value = { name, address }
}

function updateReference() {
  if (isVisible.value === false) return
  const { longitude, latitude } = featureLocation.value
  const screenPoint = view.toScreen(
    new Point({
      longitude,
      latitude
    })
  )
  const featureScreenLocationX = screenPoint.x + frameLeft.value
  const featureScreenLocationY = screenPoint.y + frameTop.value
  reference.value = {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x: featureScreenLocationX,
        y: featureScreenLocationY,
        top: featureScreenLocationY,
        bottom: featureScreenLocationY,
        left: featureScreenLocationX,
        right: featureScreenLocationX
      }
    }
  }
}

watch(isVisible, () => {
  if (isVisible.value === false) document.body.style.cursor = ''
})

function handleQuery() {
  console.log('change cursor style')
  const cursorUrl = '../src/assets/locate.svg'
  document.body.style.cursor = `url(${cursorUrl}) 16 16,auto`
}

onMounted(async () => {
  const { coffeeShopLayer, barLayer } = await import('../data/layers')

  middleware.value.push(
    offset(10),
    flip({ boundary: props.boundary }),
    flip({ boundary: props.boundary, crossAxis: true }),
    hide({ boundary: props.boundary })
  )

  const mapDivRect = props.boundary.getBoundingClientRect()
  const { left, top } = mapDivRect
  frameLeft.value = left
  frameTop.value = top

  view.on('click', async (event) => {
    const { screenPoint, mapPoint } = event
    const testResults = await view.hitTest(screenPoint, { include: [coffeeShopLayer, barLayer] })
    if (testResults.results.length === 0) {
      isVisible.value = false
    } else {
      const graphic = testResults.results[0].graphic
      const { longitude, latitude } = mapPoint
      featureLocation.value.longitude = longitude
      featureLocation.value.latitude = latitude
      const featureScreenLocationX = screenPoint.x + left
      const featureScreenLocationY = screenPoint.y + top
      reference.value = {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: featureScreenLocationX,
            y: featureScreenLocationY,
            top: featureScreenLocationY,
            bottom: featureScreenLocationY,
            left: featureScreenLocationX,
            right: featureScreenLocationX
          }
        }
      }
      await queryFeature(graphic)
      isVisible.value = true
    }
  })
  const events = ['drag', 'mouse-wheel']
  events.forEach((event) => {
    view.on(event, updateReference)
  })
})
</script>

<template>
  <div class="popover" ref="floating" :style="floatingStyles" v-if="isVisible">
    <div id="popover-functional">
      <div id="popover-title">规划查询</div>
      <el-button :icon="Close" circle @click="isVisible = false" size="small"></el-button>
    </div>
    <div id="popover-content">
      <div id="info-title">店名:{{ featureInfo.name }}</div>
      <div id="info-address">地址:{{ featureInfo.address }}</div>
    </div>
  </div>
  <button @click="handleQuery">查询</button>
</template>

<style>
.popover {
  position: absolute;
  padding: 10px;
  top: 0;
  left: 0;
  width: 300px;
}

#popover-functional {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 10px 10px 0px 0px;
  padding: 5px 10px;
  background-color: #ad0026;
}

#popover-title {
  color: white;
}

#popover-content {
  border-radius: 0px 0px 10px 10px;
  padding: 10px;
  background-color: white;
}
</style>
