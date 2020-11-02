import request from '@/api/request'

export default {


    getUserVipPage: function (page, size) {
        return request({
            url: '/api/pyq/select/paiyouquanManage/userVipConfig?page=' + page + '&size=' + size,
            method: 'get'
        })
    },

    putItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/paiyouquanManage/userVipConfig',
                method: 'put',
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
                url: '/api/pyq/add/paiyouquanManage/userVipConfig',
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
            url: `/api/pyq/delete/paiyouquanManage/userVipConfig/${autoId}`,
            method: 'delete'
        })
    }
}
