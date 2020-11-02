import request from '@/api/request'

export default {

    getAccountPage: function (page, size, s_aUid, s_aAccount, s_aNickName, s_status) {
        return request({
            url: '/api/account/page?page=' + page + '&size=' + size + '&s_aUid=' + s_aUid
                + '&s_aAccount=' + s_aAccount + '&s_aNickName=' + s_aNickName + '&s_status=' + s_status,
            method: 'get'
        })
    },

    getAccountDetail: function (uid) {
        return request({
            url: '/api/account/get/person/detail?aUid=' + uid,
            method: 'get'
        })
    },

    getCasinoitem: function (uid) {
        return request({
            url: '/api/account/get/casino/item/data?uid=' + uid,
            method: 'get'
        })
    },

    getAccountChangePage: function (page, size, pid, reason, gameid, serverid, type, wl, params, beginDate) {
        return request({
            url: '/api/account/change/page?page=' + page + '&size=' + size + '&beginDate=' + beginDate
                + '&pid='+pid + '&reason='+reason + '&gameid='+gameid + '&serverid='+serverid + '&type='+type
                + '&wl='+wl + '&params='+params,
            method: 'get'
        })
    },

    getNewAccountChangePage: function (page, size, pid, reason, gameid, serverid, type, startnum, endnum, params,paramnotlike, beginDate) {
        return request({
            url: '/api/account/newchange/page?page=' + page + '&size=' + size + '&beginDate=' + beginDate
                + '&pid='+pid + '&reason='+reason + '&gameid='+gameid + '&serverid='+serverid + '&type='+type
                + '&startnum='+ startnum + '&endnum='+endnum + '&params='+params + '&paramnotlike='+paramnotlike,
            method: 'get'
        })
    },

    updateIMEI:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/dubious/account/execute/forbid/Imei',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    editAccountForbid:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/dubious/account/execute/forbid/account',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    editSpeakForbid:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/dubious/account/execute/forbid/player/spreak',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    configSpread:function(data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/execute/spread',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    saveItem:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/execute/casino/item/data',
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
     * 特惠码查询
     * @param page
     * @param size
     * @param thm
     */
    getThmPage: function (page, size, thm) {
        return request({
            url: '/api/account/load/thm?page=' + page + '&size=' + size + '&thm=' + thm,
            method: 'get'
        })
    },

    /**
     * 绑定信息
     * @param page
     * @param size
     * @param aUid
     * @param aPhone
     * @param loadtype
     */
    getBindAccountPage: function (page, size, aUid, aPhone, loadtype) {
        return request({
            url: '/api/account/load/account?page=' + page + '&size=' + size + '&aUid=' + aUid
                + '&aPhone=' + aPhone + '&loadtype=' + loadtype,
            method: 'get'
        })
    },

    /**
     * 修改昵称
     * @param data
     * @returns {Promise<unknown>}
     */
    executeAccount:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/execute/account',
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
     * 删除特惠码
     * @param data
     * @returns {Promise<unknown>}
     */
    delCode:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/delete/account/tehuima',
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
     * 转移Vip
     * @param data
     * @returns {Promise<unknown>}
     */
    executeVip:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/execute/vip',
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
     * 转移Vip
     * @param data
     * @returns {Promise<unknown>}
     */
    updAccountBind:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/update/account/bind',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    updateAccountSafe:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/update/accountsafe',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    sendAccountSafePassword:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/account/send/safepassword',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getSearchReasons:function () {
        return request({
            url: '/api/menu/get/reason',
            method: 'get'
        })
    }

}
