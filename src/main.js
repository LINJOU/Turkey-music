// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引用fastclick组件(处理点击延迟3秒)
import fastclick from 'fastclick'
// 引用图片懒加载
import VuelazyLoad from 'vue-lazyload'

// 引用store
import store from './store'

// 在整个dom下click事件都没有延迟
fastclick.attach(document.body)

Vue.use(VuelazyLoad, {
  loading: require('common/image/default.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
