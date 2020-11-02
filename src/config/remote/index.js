import _ from 'lodash'
import request from '@/api/request'
const configList = require.context('@/config/remote', false, /\.js$/)
let moduleExports = {}


configList.keys().forEach(item => {

    if (item.indexOf('index.js') === -1 && configList(item).default) {
        const url = configList(item).default.url
        const name = item.substring(item.lastIndexOf('/') + 1, item.lastIndexOf('.'))
        // Object.defineProperty(moduleExports, name, {
        //      // get:  function () {
        //      //     console.log('test easy request' + url)
        //      //     return 1;
        //      //     // return await request.get(url)
        //      // }
        //     // set:function(newAge){
        //     //     console.log(this.name+'现在'+newAge+'岁')
        //     // },
        //
        //
        // } )

        // moduleExports[name] = defaultExport
        moduleExports[name] = () => {
            let f =  async () => {
                const r = await request.get(url)
                console.log(r)
                return r

            }
            const result = f()
            console.log(result)
            return result
        }
    }
})
export default moduleExports
