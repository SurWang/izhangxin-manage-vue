import request from '@/api/request'

export function login(data) {
    return request({
        url: '/api/login',
        method: 'get',
        data
    })
}


export function getInfo () {
return request({
    url: '/api/userInfo',
    method: 'get'
})
}

export function logout () {
    return request({
        url: '/api/user/logout',
        method: 'delete'
    })
}

export function updatePass (data) {
    return request({
        url: '/api/update/pass',
        method: 'get',
        data
    })
}

