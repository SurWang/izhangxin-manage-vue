import request from '@/api/request'

export default {


    getClubVipPage: function (page, size) {
        return request({
            url: '/api/pyq/select/pyqManage/priviConfig?page=' + page + '&size=' + size,
            method: 'get'
        })
    },

    getClubVipConfigPage: function (page, size, searchLevel) {
        return request({
            url: '/api/pyq/select/pyqManage/clubPriviConfig?page=' + page + '&size=' + size+ '&levelId=' + searchLevel,
            method: 'get'
        })
    },

    getClubVipList: function () {
        return request({
            url: '/api/pyq/select/pyqManage/priviConfig?type=1' ,
            method: 'get'
        })
    },

    putItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/pyqManage/priviConfig',
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
                url: '/api/pyq/add/pyqManage/priviConfig',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    addConfigItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/add/pyqManage/clubPriviConfig',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    putConfigItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/pyqManage/clubPriviConfig',
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
    deleteItem: function (autoId) {
        return request({
            url: `/api/pyq/delete/pyqManage/clubPriviConfig/${autoId}`,
            method: 'delete'
        })
    }
}
