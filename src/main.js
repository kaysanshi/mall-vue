// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 按需导入可以这里直接导入到全部了
import ElementUI, { Message } from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
import ZKTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入NProgress 
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"

// 配置拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  // 在 request 拦截器中，展示进度条 NProgress.start()

  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem("token")
  // 在最后要return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// axios组件挂载到vue
Vue.prototype.$http = axios
// message组件需要挂载到vue 原型组件中
Vue.prototype.$message = Message
// y引入 elementui
Vue.use(ElementUI, { locale })
// 这里是自动注册的
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
// 使用手动注册的方式 全局注册
Vue.component('tree-table',ZKTable)
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
