import request from '@/api/request'

export default {

    getPhoneCodePage : function (page, size, uid, phone, startTime, endTime) {
        return request({
            url: '/api/common/phone/code?page=' + page + '&size=' + size + '&uid=' + uid
                + '&phone=' + phone + '&startTime=' + startTime + '&endTime=' + endTime,
            method: 'get'
        })
    },

}
