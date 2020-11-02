import request from '@/api/request'

export default {


    getSpreadBindPage: function (page, size, spreadUid,spreadCode) {
        return request({
            url: '/api/spread/load/user/spread/binding?page=' + page + '&rows=' + size
                + '&spreadUid=' + spreadUid + '&spreadCode=' + spreadCode,
            method: 'get'
        })
    },

    getSpreadBoundPage: function (page, size, spreadUid,spreadCode) {
        return request({
            url: '/api/spread/load/user/spread/bound?page=' + page + '&rows=' + size
                + '&spreadUid=' + spreadUid + '&spreadCode=' + spreadCode,
            method: 'get'
        })
    },

    getSpreadRebatePage: function (page, size, spreadUid,spreadCode) {
        return request({
            url: '/api/spread/load/user/spread/rebate?page=' + page + '&rows=' + size
                + '&spreadUid=' + spreadUid + '&spreadCode=' + spreadCode,
            method: 'get'
        })
    },

    getSpreadReceivePage: function (page, size, spreadUid,spreadCode) {
        return request({
            url: '/api/spread/load/user/spread/receive?page=' + page + '&rows=' + size
                + '&spreadUid=' + spreadUid + '&spreadCode=' + spreadCode,
            method: 'get'
        })
    },

    getSpreadRechargePage: function (page, size, spreadUid,spreadCode) {
        return request({
            url: '/api/spread/load/user/spread/recharge?page=' + page + '&rows=' + size
                + '&spreadUid=' + spreadUid + '&spreadCode=' + spreadCode,
            method: 'get'
        })
    },


    bund : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/spread/relieve/user/spread/bund',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getRebateRatePage:function (page, size, searchStatus) {
        return request({
            url: '/api/pyq/get/pyqManage/spread/scaleConfig?page=' + page + '&rows=' + size+ '&sStatus=' + searchStatus,
            method: 'get'
        })
    },

    addRebateRate : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/add/pyqManage/spread/scaleConfig',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    editRebateRate : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/edit/pyqManage/spread/scaleConfig',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
}
