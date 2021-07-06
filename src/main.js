// main.js入口文件

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//导入axios
import axios from 'axios'
//把axios挂在在vue的原型对象上
//这样的话每一个vue的组件都可以通过vue实例访问到$http
//从而发去ajax请求
Vue.prototype.$http = axios

//为axios设置请求的根路径
//配置请求的根路径
// axios.defaults.baseURL = 'http://42.192.40.14:8889/api/private/v1/'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //在最后必须 return config
    return config
})
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
    //将富文本编辑器,注册全局可用的组件
Vue.use(VueQuillEditor)


// 全局事件过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + 1 + '').padStart(2, '0')
    const h = (dt.getHours() + 1 + '').padStart(2, '0')
    const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
    const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')

    return `${y}-${m}-${d} ${h}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')