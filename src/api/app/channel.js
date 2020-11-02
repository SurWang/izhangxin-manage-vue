import request from '@/api/request'

export default {

    getChannelInfosPage: function (page,size, channelId) {
        return request({
            url: '/api/channel/page?page=' + page + '&size=' + size + '&channelId=' + channelId,
            method: 'get'
        })
    },
    /**
     * 获取所有渠道列表
     */
    getAllChannelInfos: function () {
        return request({
            url: '/api/channel',
            method: 'get'
        })
    },

    /**
     * 获取有效渠道列表
     */
    getChannelInfos: function () {
        return request({
            url: '/api/channel/valid',
            method: 'get'
        })
    },
    /**
     * 添加渠道
     * @param data {Object} {"roleName":"","groupId":1}
     */
    addChannel: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/add/channel',
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
     * 渠道删除
     * @param roleId {Number} 角色Id
     */
    deleteChannel: function (data) {
        return request({
            url: `/api/delete/channel`,
            method: 'delete',
            data
        })
    },
    /**
     * 修改渠道
     * @param data {"roleName":"111121","groupId":2,"roleId":2}
     * @return {Promise<any>}
     */
    putChannel: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/update/channel',
                method: 'put',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getChannels : function () {
        return request({
            url: '/api/menu/get/channel',
            method: 'get'
        })
    },

    /**
     * 获取有效渠道列表
     */
    getLimitChannels: function () {
        return request({
            url: '/api/menu/get/limit/channellist',
            method: 'get'
        })
    },

    getGameToChannel(gameId) {
        return request({
            url: '/api/get/gametochannel/channellist?gameId='+gameId,
            method: 'get'
        })
    }

}
