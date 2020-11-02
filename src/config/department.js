/**
 * 组织部门菜单按钮权限
 * @type {{addOrg: {menuId: number, menuName: string}, deleteOrg: {menuId: number, menuName: string}, viewOrgStaff: {menuId: number, menuName: string}, updateOrg: {menuId: number, menuName: string}}}
 */
const departButtonsConfig = {
    addOrg: {
        menuId: 110100001,
        menuName: '新增部门'
    },
    updateOrg: {
        menuId: 110100002,
        menuName: '编辑部门'
    },
    deleteOrg: {
        menuId: 110100003,
        menuName: '删除部门'
    },
    viewOrgStaff: {
        menuId: 110100004,
        menuName: '部门概览'
    }
}

/**
 * 费用类型配置
 * @type {string[]}
 */
const ExpenseTypeConfig = [
    '管理费用',
    '销售费用',
    '研发费用'
]

export {
    departButtonsConfig,
    ExpenseTypeConfig
}
