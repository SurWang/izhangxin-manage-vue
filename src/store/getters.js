const getters = {
    // user
    sidebar: state => state.app.sidebar,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    device: state => state.app.device,
    userId: state => state.user.userId,
    avatar: state => state.user.headImgUrl,
    userName: state => state.user.userName,
    roleId: state => state.user.userRole,
    permissionsIds: state => state.user.permissionsIds,
    permissionRoutes: state => state.permission.routes,
    userPermissionsSet: state => {
        const permissionSet = new Set()
        const permissionList = state.user.permissionsIds
        if (!permissionList || permissionList.length === 0) {
            return permissionSet
        }
        for (const item of permissionList) {
            permissionSet.add(item)
        }
        return permissionSet
    },
    /*// organization
    userInfoMap: state => {
        const roleInfoMap = new Map()
        const tempList = state.organization.organizationUsers
        if (!tempList || tempList.length === 0) {
            return roleInfoMap
        }
        for (const item of tempList) {
            roleInfoMap.set(item.openId, item)
        }
        return roleInfoMap
    },*/

    // config
    columnConfig: state => state.config.columnConfig
}
export default getters
