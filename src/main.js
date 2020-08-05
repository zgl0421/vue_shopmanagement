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
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//导入NProgress包和相应样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//在request拦截器中，展示进度条
// 设置axios请求拦截器
axios.interceptors.request.use(config => {
    NProgress.start()
    // 在请求头中使用Authorization字段提供token令牌
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
//在response拦截器中，隐藏进度条
axios.interceptors.response.use(config=>{
    NProgress.done()
    return config
})

// 挂载到原生对象，这样就可以可以直接使用$http
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false
//注册为全局组件
Vue.component('tree-table', TreeTable)

//全局注册
Vue.use(VueQuillEditor)

//注册全局过滤器
Vue.filter('dataFormat',function(originVal){
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth()+1+'').padStart(2,'0')
    const d = (dt.getDate()+'').padStart(2,'0')

    const hh =  (dt.getHours()+'').padStart(2,'0')
    const mm =  (dt.getMinutes()+'').padStart(2,'0')
    const ss =  (dt.getSeconds()+'').padStart(2,'0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
