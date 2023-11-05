<script setup>
import { ref, onMounted } from 'vue'
import { ElLink, ElIcon, ElDropdown, ElDropdownItem } from 'element-plus'

const isScreenMode = ref(false)

window.addEventListener('resize', queryScreenSize)

function queryScreenSize() {
  let size = window.screen.width
  isScreenMode.value = size < 768 ? true : false
}
onMounted(() => {
  queryScreenSize()
})
</script>

<template>
  <div class="banner">
    <div class="banner-logo">
      <img src="../assets/logo.png" />
    </div>
    <div class="banner-title" v-if="!isScreenMode">
      <p>Demo App</p>
    </div>
    <div class="banner-nav" v-if="!isScreenMode">
      <el-link>页面一</el-link>
      <el-link>页面二</el-link>
      <el-link>页面三</el-link>
    </div>
    <div v-if="isScreenMode" class="dropdown">
      <el-dropdown size="large">
        <span class="el-dropdown-link">
          菜单 <el-icon class="el-icon--right"><arrow-down /></el-icon
        ></span>
        <template #dropdown>
          <el-dropdown-item>页面一</el-dropdown-item>
          <el-dropdown-item>页面二</el-dropdown-item>
          <el-dropdown-item>页面三</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style>
.banner {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.banner-title {
  font-size: 20px;
}
.banner-nav {
  display: flex;
  width: 200px;
  flex-direction: row;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .banner {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
