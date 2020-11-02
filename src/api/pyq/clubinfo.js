import request from '@/api/request'

export default {

    /**
     * 获取游戏列表
     */
    getClubInfoPage: function (page, size,searchStatus,searchName,searchClunId, searchUid) {
        return request({
            url: '/api/pyq/select/paiyouquanManage/clubInfo?page=' + page + '&size=' + size
                + '&clubName=' + searchName + '&clubStatus=' + searchStatus
                + '&clubId=' + searchClunId + '&uid=' + searchUid,
            method: 'get'
        })
    },

    updateStatus: function (clubId, clubStatus) {
        return request({
            url: '/api/pyq/update/paiyouquanManage/updateClubStatus?clubId=' + clubId + '&clubStatus=' + clubStatus,
            method: 'get'
        })
    },


    updateClub : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/paiyouquanManage/clubInfo',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
