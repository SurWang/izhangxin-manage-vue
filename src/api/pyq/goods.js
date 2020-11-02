import request from '@/api/request'

export default {
    getItemPage: function (page, size, itemId) {
        return request({
            url: '/api/goods/load/game/goods/gain/item/config/page?page=' + page + '&size=' + size + '&gainItemIndex=' + itemId,
            method: 'get'
        })
    },

    getGoodsConfigsPage: function (page, size, goodsStatus, pn) {
        return request({
            url: '/api/goods/load/game/goods/exchange/config?page=' + page + '&rows=' + size + '&goodsStatus=' + goodsStatus
                + '&pn=' + pn,
            method: 'get'
        })
    },

    getItems: function () {
        return request({
            url: '/api/goods/load/game/goods/gain/item/config?page=',
            method: 'get'
        })
    },

    /**
     * 添加获得商品
     * @param data {Object} {"roleName":"","groupId":1}
     */
    addItem: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/goods/execute/game/goods/gain/item/config',
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
     * 修改
     * @param data {"roleName":"111121","groupId":2,"roleId":2}
     * @return {Promise<any>}
     */
    putItem: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/goods/execute/game/goods/gain/item/config',
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
     * 添加获得商品
     * @param data {Object} {"roleName":"","groupId":1}
     */
    configItem: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/goods/execute/game/goods/exchange/config',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getGoodsGain: function (goodsId) {
        return request({
            url: '/api/goods/load/game/goods/gain/itemNum/config?goodsId='+goodsId,
            method: 'get'
        })
    },

    getGoodsExchange: function (goodsId) {
        return request({
            url: '/api/goods/load/game/goods/exchange/itemNum/config?goodsId='+goodsId,
            method: 'get'
        })

    },
    getGoodsVip: function (goodsId) {
        return request({
            url: '/api/goods/load/game/goods/vip/config?goodsId='+goodsId,
            method: 'get'
        })

    },

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    configGainItem: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/goods/execute/game/goods/gain/itemnum/config',
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
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    configExchangeItem: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/goods/execute/game/goods/exchange/itemnum/config',
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
