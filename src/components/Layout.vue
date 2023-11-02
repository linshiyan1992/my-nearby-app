<script setup>
import Header from './Header.vue'
import Webmap from './Webmap.vue'
</script>

<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <Webmap></Webmap>
    </el-main>
    <el-footer>footer</el-footer>
  </el-container>
</template>

<style scoped>
.el-header {
  padding: 20px 20px;
  height: 80px;
}

.el-container {
  width: 100%;
  height: 100%;
}
.el-footer {
  background-color: lightcyan;
}

.banner {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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

@media screen and (max-width: 768px) {
  .el-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
