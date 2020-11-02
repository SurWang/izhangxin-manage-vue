import request from '@/api/request'

export default {


    getWithdrawConfigPage: function (page, size, pn) {
        return request({
            url: '/api/pyq/select/withdraw/config?page=' + page + '&rows=' + size + '&pn=' + pn,
            method: 'get'
        })
    },

    updateWithDrawConfig : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/withdraw/config',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    insertWithDrawConfig : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/insert/withdraw/config',
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
     * 道具删除
     * @param tolId
     */
    deleteWithdrawConfig: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/delete/withdraw/config',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
