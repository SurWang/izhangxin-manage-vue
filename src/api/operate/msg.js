import request from '@/api/request'

export default {

    getMsgInfo : function (uid) {
        return request({
            url: '/api/msg/page?uid=' + uid,
            method: 'get'
        })
    },

    addMsg: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/msg/add',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    deleteMsg: function (gpid) {
        return request({
            url: `/api/msg/${gpid}`,
            method: 'delete'
        })
    },

    parseTmmsg: function (gpid) {
        return request({
            url: `/api/msg/parse/${gpid}`,
            method: 'get'
        })
    },

    resumeTmmsg: function (gpid) {
        return request({
            url: `/api/msg/resume/${gpid}`,
            method: 'get'
        })
    }
}
