import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

//导入axios
import axios from 'axios'
//把axios挂在在vue的原型对象上
//这样的话每一个vue的组件都可以通过vue实例访问到$http
//从而发去ajax请求
Vue.prototype.$http = axios

//为axios设置请求的根路径
//配置请求的根路径
axios.defaults.baseURL = 'http://42.192.40.14:8889/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //在最后必须 return config
    return config
})
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')