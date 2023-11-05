<script setup>
import { onMounted, ref } from 'vue'
import { view } from '../data/map'
import { coffeeShopLayer, barLayer } from '../data/layers'
import { useFloating, computePosition } from '@floating-ui/vue'

const feature = ref(null)
const reference = ref(null)
const floating = ref(null)
const { x, y, strategy } = useFloating(reference, floating)
const isVisible = ref(false)

function registerEvent() {
  view.when(() => {
    view.on('click', (event) => {
      view.hitTest(event, { include: coffeeShopLayer }).then((res) => {
        if (res.results.length > 0) {
          feature.value = res.results[0].graphic
          const xVal = res.screenPoint.x
          const yVal = res.screenPoint.y
          reference.value = {
            getBoundingClientRect() {
              return {
                width: 0,
                height: 0,
                x: xVal,
                y: yVal,
                top: yVal,
                left: xVal,
                right: xVal,
                bottom: yVal
              }
            }
          }
          computePosition(reference.value, floating.value).then(({ x, y }) => {
            Object.assign(floating.value.style, {
              left: `${x}px`,
              top: `${y}px`
            })
            isVisible.value = true
          })
        } else {
          isVisible.value = false
        }
      })
    })
  })
}

onMounted(() => {
  registerEvent()
})
</script>

<template>
  <div class="popover" ref="floating" v-show="isVisible">test</div>
</template>

<style>
.popover {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  padding: 5px 10px;
}
</style>
