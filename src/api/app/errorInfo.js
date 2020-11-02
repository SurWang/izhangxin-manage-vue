import request from '@/api/request'

export default {
    getErrorInfoPage: function (page, size, searchId, searchType) {
        return request({
            url: '/api/select/error/information/info?page=' + page + '&rows=' + size + '&autoId=' + searchId + '&typeId=' + searchType,
            method: 'get'
        })
    },

    executeErrorInfo: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/insertOrupdate/error/information/info',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    refreshErrorInfo: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/refresh/errorCode/redis/info',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**
     *
     * @param opId
     */
    getPriorityInfo: function () {
        return request({
            url: '/api/select/error/priority/info',
            method: 'get'
        })
    },


    getTypeInfo: function () {
        return request({
            url: '/api/select/error/type/info',
            method: 'get'
        })
    },
}
