import { createApp } from 'vue'
import App from './App.vue'
import {setupElementPlus} from './plugins/element-plus'
import router from './router'
import { createPinia } from 'pinia'
import './styles/index.scss'
import { permission } from './utils/permission'

const app = createApp(App)
const pinia = createPinia()

// 注册全局权限指令
app.directive('permission', permission)
setupElementPlus(app)

app.use(router)
app.use(pinia)
app.mount('#app')