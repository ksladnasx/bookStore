import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import './style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { i18n } from './i18n'
import vant from 'vant';
import 'element-plus/dist/index.css'; // 核心样式
import 'element-plus/theme-chalk/dark/css-vars.css'; // 深色主题支持 [8,9](@ref)


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(vant);
// 全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(i18n);
app.mount('#app')