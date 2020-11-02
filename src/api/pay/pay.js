import request from '@/api/request'

export default {
    getPayLogPage: function (page, size, uid, beginDate, endDate, gameid, channel,pn,strSys,order,originalS,originalE,payMid,status) {
        return request({
            url: '/api/pay/log/page?page=' + page + '&size=' + size + '&uid=' + uid + '&beginStr=' + beginDate + '&endStr=' + endDate
                + '&gameid=' + gameid + '&channel=' + channel + '&pn=' + pn + '&strSys=' + strSys + '&order=' + order
                + '&originalS=' + originalS + '&originalE=' + originalE + '&payMid=' + payMid + '&status=' + status,
            method: 'get'
        })
    },

    /**
     * 转移Vip
     * @param data
     * @returns {Promise<unknown>}
     */
    budan:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/budan/update/order/admin/budan',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getPayMethodPage:function (page, size) {
        return request({
            url: '/api/pay/method?page=' + page + '&rows=' + size,
            method: 'get'
        })
    },

    addPayMethod:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pay/method/add',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    delPayMethod:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pay/method/delete',
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
