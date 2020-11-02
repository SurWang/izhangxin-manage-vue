import request from '@/api/request'

export default {


    getGooglepayPage: function (page, size, pn) {
        return request({
            url: '/api/pyq/select/googlepay/info/information?page=' + page + '&rows=' + size + '&pn=' + pn,
            method: 'get'
        })
    },

    putItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/insertOrupdate/googlepay/info/information',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    addItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/insertOrupdate/googlepay/info/information',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    refreshGooglepay: function () {
        return request({
            url: '/api/pyq/refresh/googlepay/info/redis',
            method: 'get'
        })
    },

    /**
     * 道具删除
     * @param tolId
     */
    deleteGooglepay: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/delete/googlepay/info/information',
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
