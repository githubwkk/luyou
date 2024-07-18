import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' //element-plus
import 'element-plus/dist/index.css'
import './assets/style/element-variables.scss'
import i18n from '@/i18n' // 国际化
import * as ICONS from '@element-plus/icons-vue' // 全局注册图标element-plus/icons-vue
import router from './router' // 引入路由
import pinia from './pinia' // 引入pinia
import './permission' // 权限控制JS
import 'virtual:svg-icons-register' // 引入svg图标注册脚本
import * as Components from './global-components' // 注册全局组件
import * as Directives from '@/directive' // 注册自定义指令
import useErrorHandler from './error-log'
import { BaiduMap, BmlMarkerClusterer } from 'vue-baidu-map-3x' // 错误日志
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

Object.entries(ICONS).forEach(([key, component]) => {
  // app.component(key === 'PieChart' ? 'PieChartIcon' : key, component)
  app.component(key, component)
})

Object.entries(Components).forEach(([key, component]) => {
  app.component(key, component)
})

Object.values(Directives).forEach(fn => fn(app))

pinia.use(piniaPluginPersistedstate)
useErrorHandler(app)
app
  .use(BaiduMap, {
    ak: 'bsg8hJwdNIUn2i2FTuCX9fe89B2LHcB9',
    v: '3.0',
    type: 'API'
  })
  .use(i18n)
  .use(ElementPlus)
  .use(pinia)
  .use(router)
  .mount('#app')

app.config.globalProperties.$baseUrl = 'http://localhost:8888'
