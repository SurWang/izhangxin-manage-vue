import { login, logout, getInfo } from '@/api/login/user'
import { removeToken, setToken, setUserId } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
    userId: '',
    userName: '',
    realName: '',
    headImgUrl: '',
    lastLoginDate: '',
    lastLoginIp: '',
    permissionsIds: [],
    userRole: undefined
}

const mutations = {
    SET_USERID: (state, userId) => {
        state.userId = userId
    },
    SET_USER_NAME: (state, userName) => {
        state.userName = userName
    },
    SET_REAL_NAME: (state, realName) => {
        state.realName = realName
    },
    SET_HEAD_IMG_URL: (state, headImgUrl) => {
        state.headImgUrl = headImgUrl
    },
    SET_LAST_LOGIN_DATE: (state, lastLoginDate) => {
        state.lastLoginDate = lastLoginDate
    },
    SET_LAST_LOGINIP: (state, lastLoginIp) => {
        state.lastLoginIp = lastLoginIp
    },
    SET_PERMISSIONS_IDS: (state, permissionsIds) => {
        state.permissionsIds = permissionsIds
    },
    SET_USER_ROLE: (state, userRole) => {
        state.userRole = userRole
    }
}

const actions = {
    // user login
    login ({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                setUserId(data.user.userId)
                setToken(data.user.userToken)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get user info
    getInfo ({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo().then(response => {
                const { data } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                commit('SET_USERID', data.userId)
                commit('SET_USER_NAME', data.userName)
                commit('SET_REAL_NAME', data.realName)
                commit('SET_HEAD_IMG_URL', data.headImgUrl)
                commit('SET_LAST_LOGIN_DATE', data.lastLoginDate)
                commit('SET_LAST_LOGINIP', data.lastLoginIp)
                commit('SET_PERMISSIONS_IDS', data.permissionsIds)
                commit('SET_USER_ROLE', data.roleId)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout ({ commit, state }) {
        commit('SET_USERID', '')
        removeToken()
        resetRouter()
    },

    // remove token
    resetToken ({ commit }) {
        return new Promise(resolve => {
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

