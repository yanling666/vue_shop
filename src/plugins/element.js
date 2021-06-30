import Vue from 'vue'
// 引入登录弹出框提示
import { Button, Message, Form, FormItem, input } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(input)

Vue.prototype.$message = Message