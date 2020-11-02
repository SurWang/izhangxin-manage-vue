import request from '@/api/request'

export default {

    addAdInfo: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/adConfig',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getAdInfoPage: function (page, size) {
        return request({
            url: '/api/adConfig/page?page=' + page + '&size=' + size,
            method: 'get'
        })
    },

    getAllAdInfo: function () {
        return request({
            url: '/api/adConfig/list',
            method: 'get'
        })
    },

    putAdInfo: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/adConfig',
                method: 'put',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    deleteAdInfo: function (caId) {
        return request({
            url: `/api/adConfig/${caId}`,
            method: 'delete'
        })
    },

    addAdTemplate: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/adAward',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getAdTemplatePage: function (page, size) {
        return request({
            url: '/api/adAward/page?page=' + page + '&size=' + size,
            method: 'get'
        })
    },

    getAwards:function() {
        return request({
            url: '/api/adAward/list',
            method: 'get'
        })
    },

    putAdTemplate: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/adAward',
                method: 'put',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    deleteAdTemplate: function (caAutoId) {
        return request({
            url: `/api/adAward/${caAutoId}`,
            method: 'delete'
        })
    },

    getUserAdRecordPage : function (page, size) {
        return request({
            url: '/api/user/ad/record/page?page=' + page + '&size=' + size,
            method: 'get'
        })
    }
}
