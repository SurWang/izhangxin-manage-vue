import request from '@/api/request'

export default {
    /**
     * 获取角色列表
     */
    getRoles: function () {
        return request({
            url: '/api/role',
            method: 'get'
        })
    },
    /**
     * 添加角色
     * @param data {Object} {"roleName":"" ,"groupId":1}
     */
    addRole: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/role/add',
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
     * 角色删除
     * @param roleId {Number} 角色Id
     */
    deleteRole: function (roleId) {
        return request({
            url: `/api/role/${roleId}`,
            method: 'delete'
        })
    },
    /**
     * 修改角色
     * @param data {"roleName":"111121","groupId":2,"roleId":2}
     * @return {Promise<any>}
     */
    putRole: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/role/update',
                method: 'put',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getUsers: function (page, size, name, roleName) {
        return request({
            url: '/api/user/page?page=' + page + '&size=' + size + '&userName=' + name + '&roleName=' + roleName,
            method: 'get'
        })
    },

    addUser:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/user/add',
                method: 'post',
                dataType: 'json',
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
     * 修改角色
     * @param data {"roleName":"111121","groupId":2,"roleId":2}
     * @return {Promise<any>}
     */
    putUser: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/user/edit',
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
     * 角色删除
     * @param roleId {Number} 角色Id
     */
    deleteUser: function (userId) {
        return request({
            url: `/api/user/${userId}`,
            method: 'delete'
        })
    },

    getLoginLog: function (page, size, name) {
        return request({
            url: '/api/loginLog?page=' + page + '&size=' + size + '&userName=' + name,
            method: 'get'
        })
    },

    /**
     * 获取角色所有权限
     * @param roleId
     * @return {Promise<any>}
     */
    getRolePermission: function (roleId) {
        return new Promise((resolve, reject) => {
            request({
                url: `/api/role/permission/${roleId}`,
                method: 'get'
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    batchRolePermission: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/role/permission/batch',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getPlatformInfos:function () {
        return request({
            url: '/api/menu/get/platform',
            method: 'get'
        })
    }
}
