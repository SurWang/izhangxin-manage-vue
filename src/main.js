import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/styles/index.scss' // global css

import '@/components/X/index.scss'

import App from './App'
import store from './store'
import router from './router'
import util from './utils/util'
import permission from '@/directive/permission/index.js'
import { hasPermission } from '@/store/modules/permission.js'
import { getToken, getUserId } from '@/utils/auth.js'
import '@/icons' // icon
import '@/router/eachs' // permission control
import request from '@/api/request'
import Viewer from 'v-viewer'
import _ from 'lodash'
import 'viewerjs/dist/viewer.css'
import autoConfig from './config/auto'
import remoteConfig from './config/remote'
import echarts from 'echarts'
import exportExcel from '@/utils/excelUtil'

/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

// set ElementUI lang to EN

Vue.use(ElementUI)
Vue.use(iView)
Vue.use(MintUI)
// Vue.use(htmlToPdf)
Vue.use(Viewer)
Vue.use(permission)

Vue.prototype.$echarts = echarts
Vue.prototype.$ajax = request
Vue.prototype.$_ = _
Vue.prototype.$util = util
Vue.prototype.$permission = hasPermission
Vue.prototype.$config = autoConfig
Vue.prototype.$remoteConfig = remoteConfig
    Vue.prototype.$authInfo = { // 上传头像headers参数
    userId: getUserId(),
    userToken: getToken()
}
Vue.prototype.$console = window.console
Vue.prototype.$dev = process.env.NODE_ENV === 'development'
Vue.config.productionTip = false
// 添加全局变量是否为移动端
Vue.prototype.$isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
Vue.prototype.$excel = exportExcel

window.instance = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
