import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './views/store'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
// 引用组件
Vue.use(ElementUI)

Vue.prototype.Bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

