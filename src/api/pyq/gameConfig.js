import request from '@/api/request'

export default {

    /**
     * 获取游戏列表
     */
    getGameConfigPage: function (page, size,searchGameId,searchChannel,searchType) {
        return request({
            url: '/api/pyq/select/dyqManage/gameConfig?page=' + page + '&size=' + size + '&smallGameId=' + searchGameId
                + '&channelid=' + searchChannel + '&type=' + searchType,
            method: 'get'
        })
    },

    getGameItemPage: function (page, size, searchGameid) {
        return request({
            url: '/api/game/item/page?page=' + page + '&size=' + size + '&gameid=' + searchGameid,
            method: 'get'
        })
    },

    addItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/add/dyqManage/gameConfig',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    putItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/dyqManage/gameConfig',
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
     * 道具删除
     * @param tolId
     */
    deleteItem: function (autoId) {
        return request({
            url: `/api/pyq/delete/dyqManage/gameConfig/${autoId}`,
            method: 'delete'
        })
    },

    createFolder : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/tencentcloud/usercreate/folder',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    uploadFile:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/tencentcloud/dyq/upload/file',
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

    getGameFolder: function (gameid) {
        return request({
            url: '/api/tencentcloud/folder/exists?gameid='+gameid,
            method: 'get'
        })

    },

    ifExistGameConfig: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/search/dyqManage/ifExistGameConfig',
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
