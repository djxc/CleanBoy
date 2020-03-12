import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import echarts from 'echarts'
import 'echarts-gl'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
// 给Vue添加原型，可以在其他组件中直接使用this.$echarts，不过引用太多。
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
