import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'

// 引入全局样式
import './styles/index.scss'

// 创建应用实例
const app = createApp(App)

// 配置懒加载
app.use(VueLazyload, {
  preLoad: 1.3,
  error: '/images/error.svg',
  loading: '/images/loading.svg',
  attempt: 1,
  listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'],
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
})

// 使用插件
app.use(createPinia())
app.use(router)

// 挂载应用
app.mount('#app')

// 移除加载动画
const loading = document.querySelector('.loading')
if (loading) {
  loading.style.display = 'none'
}
