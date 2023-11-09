// import './assets/index.scss'
import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import esriConfig from '@arcgis/core/config'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

esriConfig.portalUrl = 'https://172.168.120.244/geoscene'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
