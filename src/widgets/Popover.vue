<script setup>
import { ref, watch, onMounted } from 'vue'
import { useFloating, autoUpdate, hide, flip, offset } from '@floating-ui/vue'
import { view } from '../data/map'
import Point from '@arcgis/core/geometry/Point'
import { landUseCode } from '../data/landUseCode'
import { ElButton, ElDescriptions, ElDescriptionsItem, ElIcon } from 'element-plus'
import { Close, ZoomIn } from '@element-plus/icons-vue'
import * as ReactiveUtils from '@arcgis/core/core/reactiveUtils'

const props = defineProps({
  boundary: HTMLElement
})

const floating = ref(null)
const reference = ref(null)
const middleware = ref([])
const featureLocation = ref({ longitude: null, latitude: null })
const featureInfo = ref(null)
const isVisible = ref(false)
const frameLeft = ref(null)
const frameTop = ref(null)
const events = ref([])
let zoningLayer

//UI
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

function updateReference(x, y) {
  reference.value = {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x,
        y,
        top: y,
        bottom: y,
        left: x,
        right: x
      }
    }
  }
}

// 如果用户关闭了微件，则取消所有的事件监听
watch(isVisible, () => {
  if (!isVisible.value) {
    removeEvents(events.value)
  }
})

//业务

async function handleQuery() {
  await registerClickEvent()
  registerUpdateEvent()
  changeCursorStyle(true)
}

async function registerClickEvent() {
  // eventHandle 的用途是用来移除事件，从这个微件而言，当用户选择了一个要素之后，事件就应该移除
  const eventHandle = view.on('click', async (event) => {
    // 需要注意，screenPoint指的是从地图左上角开始计算的坐标值，而mapPoint指的是世界坐标值
    const { screenPoint, mapPoint } = event
    const testResult = await view.hitTest(screenPoint, { include: zoningLayer })
    // 如果没有选中任何要素，用户大概率期待取消工具
    if (testResult.results.length === 0) {
      return false
    }

    // 更新弹窗依赖的虚拟元素,此处UI和业务逻辑耦合了
    const { x, y } = screenPoint
    const featureScreenX = x + frameLeft.value
    const featureScreenY = y + frameTop.value
    updateReference(featureScreenX, featureScreenY)

    // 保存当前要素的位置信息，目的是为了方便之后根据该元素的mapPoint实时计算screenPoint
    const { longitude, latitude } = mapPoint
    featureLocation.value.longitude = longitude
    featureLocation.value.latitude = latitude

    // Graphic 用来查询并且高亮要素
    const graphic = testResult.results[0].graphic
    const { name, layer } = graphic.attributes
    featureInfo.value = { name, layer }
    highlightFeature(graphic)

    isVisible.value = true

    // 选择结束，改变鼠标指针状态
    changeCursorStyle(false)
    eventHandle.remove()
    return true
  })
}

function registerUpdateEvent() {
  removeEvents(events.value)
  // 即用户拖拽和缩放事件
  const eventsName = ['drag', 'mouse-wheel']
  // handles 的用途同上
  const handles = eventsName.map((eventName) => {
    const handle = view.on(eventName, () => {
      const { longitude, latitude } = featureLocation.value
      const screenPoint = view.toScreen(
        new Point({
          longitude,
          latitude
        })
      )
      const { x, y } = screenPoint
      const featureScreenX = x + frameLeft.value
      const featureScreenY = y + frameTop.value
      updateReference(featureScreenX, featureScreenY)
    })
    return handle
  })
  events.value.push(...handles)
}

function removeEvents(handles) {
  handles.forEach((handle) => {
    handle.remove()
  })
}

function changeCursorStyle(isCustomPointer) {
  if (!isCustomPointer) {
    view.surface.style.cursor = 'default'
  } else {
    const cursorUrl = '../src/assets/locate.svg'
    view.surface.style.cursor = `url(${cursorUrl}) 16 30,auto`
  }
}

async function highlightFeature(graphic) {
  view.whenLayerView(zoningLayer).then((layerView) => {
    // Handle 的用途是用来移除高亮,从这个微件而言，当用户关掉弹窗之后，高亮就应该移除
    const highlightHandle = layerView.highlight(graphic)
    events.value.push(highlightHandle)
  })
}

function handleClose() {
  isVisible.value = false
}

function handleZoom() {
  const { longitude, latitude } = featureLocation.value
  const mapPoint = new Point({
    longitude,
    latitude
  })
  view.goTo({
    center: mapPoint,
    zoom: 18
  })
}

function getFrameRect(boundary) {
  const mapDivRect = boundary.getBoundingClientRect()
  const { left, top } = mapDivRect
  frameLeft.value = left
  frameTop.value = top
}

onMounted(() => {
  /**
   * 返回值为控规图层，目前可供查询的图层只有控规图层，未来可能还包括现状建筑等
   */
  ReactiveUtils.once(() => !view.updating).then(() => {
    zoningLayer = view.map.layers.filter((layer) => layer.title === '古城控规2').items[0]
    zoningLayer.outFields = ['*']
  })

  view.when().then(() => {
    const boundary = view.container
    middleware.value.push(
      offset(10),
      flip({ boundary }),
      flip({ boundary, crossAxis: true }),
      hide({ boundary })
    )
    getFrameRect(boundary)
    view.ui.add('queryBtn', 'top-right')
  })
})
</script>

<template>
  <div class="popover" ref="floating" :style="floatingStyles" v-if="isVisible">
    <div id="popover-functional">
      <div id="popover-functional-head">
        <el-button :icon="ZoomIn" size="small" circle @click="handleZoom"></el-button>
        <div id="popover-title">规划查询</div>
      </div>
      <el-button :icon="Close" circle @click="handleClose" size="small"></el-button>
    </div>
    <div id="popover-content">
      <el-descriptions :column="1" size="large" direction="horizontal" border>
        <el-descriptions-item label="类别代码">{{ featureInfo?.layer }}</el-descriptions-item>
        <el-descriptions-item label="用地性质">{{
          landUseCode[featureInfo?.layer?.split('-')[1]]
        }}</el-descriptions-item>
        <el-descriptions-item label="所属街道">{{ featureInfo?.name }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
  <div id="queryBtn" @click="handleQuery"></div>
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

#popover-functional-head {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

#popover-title {
  color: white;
}

#popover-content {
  border-radius: 0px 0px 10px 10px;
  padding: 10px;
  background-color: white;
}

#queryBtn {
  width: 25px;
  height: 25px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: white;
  background: center/55% no-repeat #fff url('../assets/urban-planning.png');
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

#queryBtn:hover {
  transform: scale(1.1);
}
</style>
