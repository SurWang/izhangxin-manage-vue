import request from '@/api/request'

export default {


    getXingePushPage: function (page, size, pushStatus, uid, pushType) {
        return request({
            url: '/api/pyq/select/pyqManage/xingePush?page=' + page + '&size=' + size
                + '&pushStatus=' + pushStatus + '&uid=' + uid + '&pushType=' + pushType,
            method: 'get'
        })
    },
    getSysMsgPage: function (page, size, messageType) {
        return request({
            url: '/api/pyq/select/pyqManage/messageRecord?page=' + page + '&size=' + size
                + '&messageType=' + messageType,
            method: 'get'
        })
    },

    addItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/add/pyqManage/xingePush',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    addMsgItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/add/pyqManage/messageRecord',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getXingeAppConfigPage: function (page, size, game, pn) {
        return request({
            url: '/api/xinge/get/xinge/app/config?page=' + page + '&rows=' + size
                + '&appGameid=' + game + '&appPn=' + pn,
            method: 'get'
        })
    },

    getXingePushConfigPage: function (page, size, pn, type, matchId) {
        return request({
            url: '/api/xinge/get/xinge/push/config?page=' + page + '&size=' + size
                + '&appPn=' + pn + '&pushType=' + type + '&matchTypeId=' + matchId,
            method: 'get'
        })
    },

    executeAppConfig: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/xinge/execute/xinge/app/config',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    deleteXingePush: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/xinge/delete/xinge/push',
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
