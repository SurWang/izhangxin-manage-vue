import request from '@/api/request'

export default {

    getAppInfosPage: function (page, size, gameId, appChannel, pn) {
        return request({
            url: '/api/app/page?page=' + page + '&size=' + size + '&gameId=' + gameId + '&appChannel=' + appChannel
            + '&pn=' + pn,
            method: 'get'
        })
    },
    getAppInfos: function () {
        return request({
            url: '/api/app',
            method: 'get'
        })
    },

    addApp:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/add/app',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    addSubApp:function (mchannel, mpn,subchannel,subPn,subAppName,status) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/add/sub/app?mchannel=' + mchannel + '&mpn=' + mpn + '&subchannel=' + subchannel + '&subPn=' + subPn + '&subAppName=' + subAppName + '&status=' + status,
                method: 'get',
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
    putApp: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/update/app',
                method: 'put',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**
     * 删除
     * @param roleId {Number} 角色Id
     */
    deleteApp: function (appId) {
        return request({
            url: `/api/delete/app/${appId}`,
            method: 'delete'
        })
    },

    getApps: function (gameId, channelId) {
        return request({
            url: '/api/menu/get/all/app?gameId='+gameId+'&channelId='+channelId,
            method: 'get'
        })
    },

    getTotalApps: function (gameId, channelId) {
        return request({
            url: '/api/menu/get/total/app?gameid='+gameId+'&channelid='+channelId,
            method: 'get'
        })
    },

    refreshCacheByPn:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/refresh/memcache/refresh/cache/bypn',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })

    },

    loadCacheByPn:function (pn) {
        return request({
            url: '/api/refresh/memcache/load/cache/bypn?pn='+pn,
            method: 'get'
        })

    }
}
