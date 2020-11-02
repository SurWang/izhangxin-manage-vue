import router from './index'
import store from '../store/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import routers, { resetRouter } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist


console.log('eachs ..' ,store)
router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()
    async function setPermissionRouters () {
        // 获取到权限后-计算左侧菜单栏
        resetRouter()
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes')

        // dynamically add accessible routes
        routers.addRoutes(accessRoutes)
    }

    // 在白名单不再检查登录
    if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
        return
    }

    if (hasToken) {
        const userId = store.getters.userId
        if (userId && userId > 0) {
            next()
        } else {
            try {
                // get user info
                await store.dispatch('user/getInfo')
                // 设置有权限的路由
                await setPermissionRouters()
                next(to)
            } catch (error) {
                // remove token and go to login page to re-login
                await store.dispatch('user/resetToken')
                next({ name: 'login', params: { errorMsg: error.message }})
                NProgress.done()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            // 跳登录页
            next()
        } else {
            // 当前登录失效,记录一下当前的路径, 登录成功时将删除该记录
            localStorage.setItem('loginInvalidPath', to.fullPath)
            // other pages that do not have permission to access are redirected to the login page.
            next({ path: '/login', params: { errorMsg: '登录失效，请重新登录' }})
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
