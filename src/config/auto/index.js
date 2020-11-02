import _ from 'lodash'
const configList = require.context('@/config/auto', false, /\.js$/)
const moduleExports = {}

//  获取所所有配置文件, 并新增getKey方法(首次会设置缓存), 反转key和value
// 对所有的对象新增getKey方法
// getKey(value, defaultValue)

configList.keys().forEach(item => {
    const defaultExport = configList(item).default
    if (item.indexOf('index.js') === -1 && defaultExport) {

        const name = item.substring(item.lastIndexOf('/') + 1, item.lastIndexOf('.'))
        // 只处理Object类型 其他类型暂不处理
        if (_.isPlainObject(defaultExport)) {
            const cacheName = '__GET_KEY_BY_VALUE__'
            const notFoundResult = '-'
            defaultExport.getKey = function (value, d) {
                if (!this[cacheName]) {
                    // key和value反转
                    this[cacheName] = _.invert(this)
                }
                return this[cacheName][value] || d || notFoundResult
            }
            // 这里设置为不可遍历
            Object.defineProperty(defaultExport, 'getKey', { enumerable: false })
            // cache只有在有访问的时候才会生成, 这里定义为可写
            Object.defineProperty(defaultExport, cacheName, { enumerable: false, writable: true })
        } else {
            // 其他类型暂不处理
        }

        moduleExports[name] = defaultExport
    }
})
export default moduleExports
