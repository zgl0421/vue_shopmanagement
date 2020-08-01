import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置axios请求拦截器
axios.interceptors.request.use(config => {
    // 在请求头中使用Authorization字段提供token令牌
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
// 挂载到原生对象，这样就可以可以直接使用$http
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false
//注册为全局组件
Vue.component('tree-table', TreeTable)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
