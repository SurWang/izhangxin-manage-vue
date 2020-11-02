import request from '@/api/request'

export default {

    addFolder : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/tencentcloud/create/apkfolder',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    isExist:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/tencentcloud/select/folder/isexist',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    uploadApkFile:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/tencentcloud/upload/apkfile',
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
