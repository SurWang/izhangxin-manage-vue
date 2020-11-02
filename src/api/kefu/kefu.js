import request from '@/api/request'

export default {
    /**
     * 添加
     * @param data {Object} {"roleName":"","groupId":1}
     */
    addGift: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/gift/add',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getGiftPage: function (page, size, gpId) {
        return request({
            url: '/api/gift/page?page=' + page + '&size=' + size + '&gpId=' + gpId ,
            method: 'get'
        })
    },

    getGiftKeyPage : function (page, size, searchGpId, searchKey, searchStatus) {
        return request({
            url: '/api/gift/key/page?page=' + page + '&size=' + size + '&gpId=' +
                searchGpId + '&gpStatus=' + searchStatus + '&gpKey=' + searchKey,
            method: 'get'
        })
    },

    getAllGift :function () {
        return request({
            url: '/api/gift/list',
            method: 'get'
        })
    },

    /**
     * 角色删除
     * @param roleId {Number} 角色Id
     */
    deleteGift: function (gpId) {
        return request({
            url: `/api/gift/${gpId}`,
            method: 'delete'
        })
    },

    deleteGiftKey: function (gpKey) {
        return request({
            url: `/api/gift/key/${gpKey}`,
            method: 'delete'
        })
    },

    sortGoods:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/goods/sort',
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
