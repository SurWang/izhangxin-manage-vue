import Cookies from 'js-cookie'

const userIdKey = 'admin_user_id'
const UserTokenKey = 'admin_user_token'

/*
export function setUserInfo (userInfo) {
    return window.localStorage.setItem('userInfo', userInfo)
}

export function getUserInfo () {
    return window.localStorage.getItem('userInfo')
}
*/

export function getUserId () {
    return Cookies.get(userIdKey)
}

export function setUserId (userId) {
    Cookies.remove(UserTokenKey)
    return Cookies.set(userIdKey, userId)
}

export function getToken () {

    return Cookies.get(UserTokenKey)
}

export function setToken (token) {
    return Cookies.set(UserTokenKey, token)
}

export function removeToken () {
    return Cookies.remove(UserTokenKey)
}
