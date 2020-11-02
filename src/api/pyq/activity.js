import request from '@/api/request'

export default {

    /**
     * 获取游戏列表
     */
    getActivityPage: function (page, size,searchStatus,searchName) {
        return request({
            url: '/api/pyq/select/pyqManage/activityList?page=' + page + '&size=' + size + '&activityStatus=' + searchStatus
                + '&activityName=' + searchName,
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
                url: '/api/pyq/add/pyqManage/activityList',
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
                url: '/api/pyq/update/pyqManage/activityList',
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
    deleteItem: function (listId) {
        return request({
            url: `/api/pyq/delete/pyqManage/activityList/${listId}`,
            method: 'delete'
        })
    }




}
