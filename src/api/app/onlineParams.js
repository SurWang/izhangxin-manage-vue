import request from '@/api/request'

export default {
    getOnlineParamsPage: function (page, size, paramname) {
        return request({
            url: '/api/onlineparam/load/online/param?page=' + page + '&rows=' + size + '&paramname=' + paramname,
            method: 'get'
        })
    },

    executeParams: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/onlineparam/execute/online/param',
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
    deleteParams: function (opId) {
        return request({
            url: `/api/onlineparam/delete/online/param/${opId}`,
            method: 'delete'
        })
    },
}
