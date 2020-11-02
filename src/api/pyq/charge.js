import request from '@/api/request'

export default {


    getChargePage: function () {
        return request({
            url: '/api/pyq/select/pyqManage/chargeFunction',
            method: 'get'
        })
    },

    putItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/pyq/update/pyqManage/chargeFunction',
                method: 'post',
                 headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
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
                url: '/api/pyq/add/pyqManage/chargeFunction',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
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
            url: `/api/pyq/delete/pyqManage/chargeFunction/${autoId}`,
            method: 'delete'
        })
    }
}
