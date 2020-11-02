import request from '@/api/request'

export default {
    /**
     * 获取配置信息
     * @param configType 配置类型 1: 岗位 2: 公司
     * @return {*}
     */
    getConfigInfo: function (configType) {
        return request.get('/api/hr/config/info', {
            params: {
                configType: configType
            }
        })
    },

    /**
     * 获取员工信息列表“列”字段显示配置
     * @returns {*}
     */
    getColumnConfig: function () {
        return request.get('/api/hr/page/column/config')
    },

    /**
     * 新增员工信息列表“列”字段显示配置
     * @param params
     * @returns {*}
     */
    addColumnConfig: function (params) {
        return request.post('/api/hr/page/column/config', params)
    },

    /**
     * 修改员工信息列表“列”字段显示配置
     * @param params
     * @returns {AxiosPromise<any> | IDBRequest<IDBValidKey> | Promise<void>}
     */
    updateColumnConfig: function (params) {
        return request.post('/api/hr/page/column/config', params)
    }
}
