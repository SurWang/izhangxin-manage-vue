import axios from 'axios'
import { getToken, getUserId } from '@/utils/auth'
import { ResultCode } from './ResultCode'
import router from '@/router'
import Element from 'element-ui'
// create an axios instance
const service = axios.create({
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 100000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        config.headers.userId = getUserId()
        config.headers.userToken = getToken()
        let url = config.url
        // get参数编码
        if (config.method === 'get' && config.data) {
            url += '?'
            const keys = Object.keys(config.data)
            for (const key of keys) {
                if (config.data[key] !== undefined && config.data[key] !== null
                    && config.data[key] !== 'null' && config.data[key] !== 'undefined') {
                    let value = encodeURIComponent(config.data[key])
                    // 当数组内没有任何有效值也不传
                    if (Array.isArray(config.data[key]) && value == encodeURIComponent(",")) {
                        continue;
                    }
                    url += `${key}=${value}&`;
                }
            }
            url = url.substring(0, url.length - 1)
            config.data = {}
            //
            // url += qs.stringify(config.params, { arrayFormat: 'indices' })
            // config.params = {}
        }
        config.url = url
        return config
    },
    error => {
    // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
    /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
    function (response) {
        if (response.headers && response.headers['content-type'] && response.headers['content-type'].toLocaleLowerCase().indexOf('application/json') !== -1) {
            if (ResultCode.USER_LOGIN_VALID.code === response.data.code) {
                // 登陆失效-需要跳转到登陆界面-登陆回来后的离线缓存里的值来定位
                router.push({ name: 'index', params: { errorMsg: ResultCode.USER_LOGIN_VALID.message }})
                return Promise.reject(response.data)
            } else if (ResultCode.SUCCESS.code === response.data.code) {
                // 请求成功
                return response.data
            } else {
                const res = response.data
                Element.Message.error(res.message)

                // iView.Message.error(res.message)
                // 请求失败-业务的失败
                return Promise.reject(res)
            }
        } else {
            // 自定义response
            if (response.status == 404) {
                router.push({ name: 'index', params: { errorMsg: ResultCode.USER_LOGIN_VALID.message }})
            }
            return response
        }
    },
    error => {
        // 请求出现了错误
        console.log('axios request error:', error)
        const result = { code: ResultCode.IO_ERROR.code, message: ResultCode.IO_ERROR.message }
        return Promise.reject(result)
    }
)

export default service
