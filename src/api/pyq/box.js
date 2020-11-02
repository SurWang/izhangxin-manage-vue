import request from '@/api/request'

export default {


    getBoxConfigsPage: function (page, size, pn, boxtype, boxsp,boxfirstdouble, boxstatus) {
        return request({
            url: '/api/box/box/config/list?page=' + page + '&size=' + size + '&pn='+pn  + '&boxtype='+boxtype
                + '&boxsp='+boxsp + '&boxfirstdouble='+boxfirstdouble + '&boxstatus='+boxstatus,
            method: 'get'
        })
    },

    /**
     *
     * @param boxId
     */
    deleteItem: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/delete/box/config',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    moveUpAndDown: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/box/move/updown',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getBoxItems:function () {
        return request({
            url: '/api/box/box/item/load/byxml',
            method: 'get'
        })
    },

    getPayMethod:function () {
        return request({
            url: '/api/menu/pay/method/show',
            method: 'get'
        })
    },

    getBoxConfig:function (boxId) {
        return request({
            url: '/api/box/box/config/get?id='+boxId,
            method: 'get'
        })
    },


    /**
     * 添加商品
     * @param data {Object} {"roleName":"","groupId":1}
     */
    executeBoxConfig: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/box/config/execute',
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
     * 修改角色
     * @param data {"roleName":"111121","groupId":2,"roleId":2}
     * @return {Promise<any>}
     */
    updateBox: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/update/box/config',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    delSerialno:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/box/del/serial',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    uptSerialno:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/box/upt/serialnew',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    uploadImage:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/upload/save',
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    refreshCache:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/refresh/memcache/do/refresh/cache',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getBoxConfigList:function (appid) {
        return request({
            url: '/api/box/box/config/alllist?appid=' + appid,
            method: 'get'
        })
    },

    getBoxPayMethodList:function (boxid) {
        return request({
            url: '/api/box/box/get/paymethod?boxid=' + boxid,
            method: 'get'
        })
    },

    executeBoxDetail:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/box/detail/execute',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    updateBoxDetail: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/box/detail/upt',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    delBoxDetail: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/box/box/detail/del',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    copyBox: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/import/box/config/copy',
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
