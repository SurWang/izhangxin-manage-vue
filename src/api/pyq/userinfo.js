import request from '@/api/request'

export default {

    /**
     * 获取游戏列表
     */
    getUserInfoPage: function (page, size,searchId) {
        return request({
            url: '/api/pyq/select/paiyouquanManage/userInfo?page=' + page + '&size=' + size
                + '&uid=' + searchId,
            method: 'get'
        })
    },

    findClubInfo: function (uid) {
        return request({
            url: '/api/pyq/select/paiyouquanManage/userClubInfo?uid=' + uid,
            method: 'get'
        })
    },


    putItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/paiyouquanManage/userInfo',
                method: 'put',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
