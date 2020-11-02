import request from '@/api/request'

export default {

    getRegLimitPage : function (page, size,gameid, channel, status ) {
        return request({
            url: '/api/common/izhangxin/reglimit?page=' + page + '&size=' + size + '&gameid=' + gameid
                + '&channel=' + channel + '&status=' + status,
            method: 'get'
        })
    },

    addLimit: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/common/add/izhangxin/reglimit',
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
     * 修改
     * @param data
     * @returns {Promise<unknown>}
     */
    putLimit: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/common/update/izhangxin/reglimit',
                method: 'put',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
