import request from '@/api/request'

export default {


    getVipPriceConfigPage: function (page, size, vipTtype,vipLevel, vipStatus) {
        return request({
            url: '/api/pyq/get/pyqManage/vip/priceConfig?page=' + page + '&rows=' + size
                + '&vipType=' + vipTtype + '&vipLevel=' + vipLevel
                + '&vipStatus=' + vipStatus,
            method: 'get'
        })
    },

    getVipStaticsPage: function (page, size, vipTtype, startStr,endStr) {
        return request({
            url: '/api/pyq/search/pyq/vipStatics?vipType=' + vipTtype
                + '&start=' + startStr + '&end=' + endStr + '&page=' + page + '&rows=' + size,
            method: 'get'
        })
    },

    getVipInfoPage: function (page, size, vipTtype,vuid) {
        return request({
            url: '/api/pyq/search/pyq/person/vipinfo?page=' + page + '&rows=' + size
                + '&vipType=' + vipTtype + '&vuid=' + vuid,
            method: 'get'
        })
    },

    refershVipInfo: function (vipTtype, vuidStr, vclubId) {
        return request({
            url: '/api/pyq/refersh/pyq/person/vipinfo?vipType=' + vipTtype + '&vuidStr=' + vuidStr
                + '&vclubId=' + vclubId,
            method: 'get'
        })
    },

    getVipRecordPage: function (page,rows,vipTtype, uid, clubId,startStr) {
        return request({
            url: '/api/pyq/search/pyq/person/vipinfo/record?page=' + page + '&rows=' + rows
                + '&tsclubid=' + clubId + '&start=' + startStr + '&tsuid=' + uid + '&vipTsType=' + vipTtype,
            method: 'get'
        })
    },

    addItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/add/pyqManage/vip/priceConfig',
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
                url: '/api/pyq/edit/pyqManage/vip/priceConfig',
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
