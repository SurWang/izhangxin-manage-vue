import request from '@/api/request'

export default {


    getUpiBankPage: function (page, size) {
        return request({
            url: '/api/pyq//select/upi/bank?page=' + page + '&rows=' + size,
            method: 'get'
        })
    },

    updatePyqUpiBank : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/upi/bank',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    addPyqUpiBank : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/add/upi/bank',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    deletePyqUpiBank: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/delete/upi/bank',
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
