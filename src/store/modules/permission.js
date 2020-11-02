import { asyncRoutes, constantRoutes, routes404 } from '@/router'
import store from '../index'

/**
 * 判断用户是否有权限
 * @param permissionId
 * @returns {*}
 */
export function hasPermission (permissionId) {
    if (store.getters.roleId && store.getters.roleId == 30) {
        return true
    }
    // 用户所有拥有权限的ID
    const permissionSet = store.getters.userPermissionsSet
    return permissionSet && permissionSet.has(permissionId)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes) {

    const res = []
    // 循环所有动态的权限路由
    routes.forEach(route => {
        const tmp = { ...route }
        // 没有设置权限或有权限均可访问
        if (!tmp.meta.permissionId || hasPermission(tmp.meta.permissionId)) {

            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children)
            }
            res.push(tmp)
        }
    })
    return res
}

const state = {
    routes: constantRoutes,
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        // 最后追加404
        routes.push(routes404)
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes ({ commit }) {
        return new Promise(resolve => {
            const accessedRoutes = filterAsyncRoutes(asyncRoutes) || []

            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
