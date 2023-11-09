<script setup>
import { ref, onMounted, watch } from 'vue'
import { barLayer, coffeeShopLayer } from '../data/layers'
import Expand from '@arcgis/core/widgets/Expand'
import { view } from '../data/map'
import * as ReactiveUtils from '@arcgis/core/core/reactiveUtils'
import { ElTable, ElTableColumn, ElSwitch, ElSlider } from 'element-plus'

const props = defineProps({
  position: String
})

const layersToggleUI = ref(null)
const allLayersLoaded = ref(false)
const layerList = [barLayer, coffeeShopLayer]
const layerData = []

onMounted(() => {
  // 当图层全部加载完毕时，让图层列表可见
  ReactiveUtils.once(() => !view.updating).then(() => {
    // 因为图层全部从WebMap中加载, 图层是组合在一起的，需要将图层提取出来
    const layers = view.map.layers
      .flatten((item) => {
        return item.sublayers
      })
      .filter((layer) => layer.sublayers === null)
    // 将图层添加到作用域为组件的layerList中，方便模板调用
    layerList.push(...layers)
    layerData.push(
      ...layerList.map((layer) => ({
        title: layer.title,
        // 图层的开关状态
        isVisible: ref(true),
        // 图层的透明度状态
        opacity: ref(100)
      }))
    )
    // 注意：因为使用v-model来绑定图层的状态，当图层加载完毕时监听LayerData中每个图层的引用变量
    layerData.forEach((layer, index) => {
      const { isVisible, opacity } = layer
      watch(isVisible, () => {
        const layerObject = layerList[index]
        layerObject.visible = isVisible.value
      })
      watch(opacity, () => {
        const layerObject = layerList[index]
        layerObject.opacity = opacity.value
      })
    })
    // 此时加载图层列表，图层列表根据layersList的数据渲染
    allLayersLoaded.value = true
  })

  const expand = new Expand({
    expandIcon: 'layers',
    view,
    content: layersToggleUI.value
  })
  view.ui.add(expand, props.position)
})
</script>

<template>
  <span id="layerList" ref="layersToggleUI">
    <div id="layerList-title">图层列表</div>
    <div id="wrapper" v-if="allLayersLoaded">
      <el-table :data="layerData">
        <el-table-column label="图层开关">
          <template #default="scope">
            <el-switch v-model="scope.row.isVisible"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="图层名"></el-table-column>
        <el-table-column label="透明度" :width="100">
          <template #default="scope">
            <el-slider
              v-model="scope.row.opacity"
              :min="0"
              :max="1"
              :step="0.01"
              size="small"
            ></el-slider>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </span>
</template>

<style scoped>
#layerList {
}

#wrapper {
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
  width: 500px;
}

#layerList-title {
  height: 35px;
  border-radius: 20px 20px 0 0;
  background-color: #ad0026;
  color: white;
  font-size: 18px;
  padding: 10px 20px;
}
</style>
