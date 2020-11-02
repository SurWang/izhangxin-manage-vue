<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="handleFilter"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="角色名称">
                        <el-input size="small"
                                  v-model="filterRoleName"
                                  placeholder="角色名称"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="handleFilter">
                        </el-input>
                    </el-form-item>
                </el-form>
            </template>
        </filter-container>

        <operate-container>
            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-md-person-add"
                @click="handleAddRole">
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEditRole">
                编辑
            </el-button>

            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelRole">
                删除
            </el-button>
        </operate-container>

        <div class="manage-main">
            <div class="manage-main-body">
                <el-table
                    ref="table"
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    v-loading="listLoading"
                    border
                    fit
                    highlight-current-row
                    :data="filterRolesList"
                    @row-click="handleSelectChange"
                >
                    <el-table-column align="center" label="角色ID" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.roleId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="角色名称" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.roleName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="角色描述" width="220">
                        <template slot-scope="scope">
                            {{ scope.row.roleRemark }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="可操作金币" width="220">
                        <template slot-scope="scope">
                            {{ scope.row.roleMoney }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="roleDialogVisible"
            :title="currentDialogType===dialogType.EDIT?'编辑角色':'新增角色'"
            width="600px"
            :before-close="handleBeforeCloseEditRole">
            <el-form :model="role" label-width="80px" label-position="left">
                <el-form-item label="名称">
                    <el-input v-model="role.roleName" placeholder="角色名称"/>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="role.roleRemark" placeholder="角色描述"/>
                </el-form-item>
                <el-form-item label="金币上限">
                    <el-input v-model="role.roleMoney" placeholder="操作金币上限"/>
                </el-form-item>
                <el-form-item label="权限">
                    <el-tree
                        ref="tree"
                        :check-strictly="checkStrictly"
                        :data="routesData"
                        :props="defaultProps"
                        show-checkbox
                        node-key="permissionId"
                        @check="handleTreeCheck"
                        class="permission-tree"
                    />
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="roleDialogVisible=false">取消</el-button>
                <el-button type="primary" :disabled="isConfirmDisabled" @click="confirmRole">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'

    import { deepClone } from '@/utils'
    import role from '@/api/system/role'
    import { RolePermissionConfig } from '@/config/role'
    import waves from '@/directive/waves' // waves directive
    import _ from 'lodash'

    const defaultFilterQuery = {
        roleName: '' // 手机号 真实姓名 或者 证件号 模糊查询
    }

    const defaultRole = {
        roleId: 0,
        roleName: '',
        roleRemark:'',
        roleMoney:0,
        permissionIds:[],
        routes: []
    }

    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }

    export default {
        directives: { waves },
        components: {
            FilterContainer,
            OperateContainer
        },
        data () {
            return {
                listLoading: false,
                isUpdateRole: false,
                isUpdatePermission: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,

                filterQuery: Object.assign({}, defaultFilterQuery),
                filterRoleName: '',
                role: Object.assign({}, defaultRole),
                rolesList: [],
                roleDialogVisible: false,
                roleUsersDialogVisible: false,
                roleUsersList: [], // 角色下的用户列表
                checkStrictly: false,
                dialogType: DialogType,
                defaultProps: {
                    children: 'children',
                    label: 'permissionName'
                },
                currentDialogType: DialogType.NEW,
                currentRolePermissions: [], // 当前角色权限
                currentRole: Object.assign({}, defaultRole) // 当前选中的角色信息
            }
        },
        computed: {
            isConfirmDisabled () {
                if (this.role.roleName && this.role.roleName.trim().length > 0) {
                    // 角色名称不为空的时候，在判断用户名是否修改或者是否修改了角色信息
                    return !(this.isUpdateRole || this.isUpdatePermission)
                } else {
                    // 角色必须要有名称，不可以为空
                    return true
                }
            },
            routesData () {
                return RolePermissionConfig
            },

            currentRolePermissionKeys () {
                const tempList = []
                if (this.currentDialogType === this.dialogType.EDIT && this.currentRolePermissions && this.currentRolePermissions.length > 0) {
                    for (const item of this.currentRolePermissions) {
                        tempList.push(item.permissionId)
                    }
                }
                return tempList
            },

            filterRolesList () {
                let tempList = []
                if (this.rolesList && this.rolesList.length > 0) {
                    tempList = this.rolesList.filter(item => {
                        return item.roleName.indexOf(this.filterQuery.roleName) > -1
                    })
                }
                return tempList
            }
        },
        watch: {
            'role.roleName' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdateRole = newValue !== this.currentRole.roleName
                } else {
                    // 新增的时候，
                    this.isUpdateRole = newValue && newValue.trim().length > 0
                }
            },
            'role.roleRemark' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdateRole = newValue !== this.currentRole.roleRemark
                } else {
                    // 新增的时候，
                    this.isUpdateRole = newValue && newValue.trim().length > 0
                }
            },
            'role.roleMoney' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdateRole = newValue !== this.currentRole.roleMoney
                } else {
                    // 新增的时候，
                    this.isUpdateRole = newValue && newValue.length > 0
                }
            },
            roleDialogVisible (newValue) {
                if (!newValue) {
                    this.currentRolePermissions = []
                }
            }
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
            this.getRoles()
        },
        methods: {
            async getRoles () {
                const res = await role.getRoles()
                this.rolesList = res.data.roles
            },

            handleSelectChange (row) {
                const self = this
                self.currentRole = deepClone(row)
            },
            handleAddRole () {
                this.role = Object.assign({}, defaultRole)
                if (this.$refs.tree) {
                    this.$refs.tree.setCheckedNodes([])
                }
                this.currentDialogType = this.dialogType.NEW
                this.roleDialogVisible = true
            },

            handleEditRole () {
                const self = this
                if (!self.currentRole.roleId) {
                    self.$message({
                        type: 'error',
                        message: '请选择角色!'
                    })
                    return
                }
                self.role = deepClone(self.currentRole)
                // 重置保存状态
                self.isUpdateRole = false
                self.isUpdatePermission = false
                self.currentDialogType = this.dialogType.EDIT

                role.getRolePermission(self.role.roleId).then(result => {
                    self.roleDialogVisible = true
                    self.checkStrictly = true

                    if (result.data && result.data.length > 0) {
                        const tempPermissionList = []
                        for (const item of result.data) {
                            tempPermissionList.push(item)
                        }
                        self.currentRolePermissions = tempPermissionList
                    } else {
                        self.currentRolePermissions = []
                    }

                    self.$nextTick(() => {
                        this.role.routes = this.currentRolePermissionKeys
                        this.$refs.tree.setCheckedKeys(this.role.routes)
                        this.checkStrictly = false
                    })
                }).catch(error => {
                    self.$message({
                        type: 'error',
                        message: error.message
                    })
                })
            },
            /**
             * 删除角色
             * @param $index
             * @param row
             */
            handleDelRole () {
                const self = this
                self.role = deepClone(self.currentRole)
                if (self.role.roleId <= 0) {
                    self.$message({
                        type: 'error',
                        message: '请选择角色!'
                    })
                    return
                }

                self.$confirm(`确认删除角色“${self.role.roleName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    role.deleteRole(self.role.roleId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '角色删除成功!'
                        })
                        self.rolesList = self.rolesList.filter(item => {
                            return item.roleId != self.role.roleId
                        })
                        self.currentRole = Object.assign({}, defaultRole)
                    }, result => {
                        self.$message({
                            type: 'error',
                            message: result.message
                        })
                    })

                }).catch(err => {
                })
            },

            async confirmRole () {
                const isEdit = this.currentDialogType === this.dialogType.EDIT

                const checkedKeys = this.$refs.tree.getCheckedKeys()
                const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
                this.role.routes = _.concat(checkedKeys, halfCheckedKeys)

                if (isEdit) {
                    this.updateRole()
                } else {
                    this.addRole()
                }
            },
            updateRole () {
                const self = this

                if (this.isUpdatePermission) {
                    const addPermissionKeys = _.difference(self.role.routes, self.currentRolePermissionKeys)
                    const deletePermissionKeys = _.difference(self.currentRolePermissionKeys, self.role.routes)
                    const addPermissionList = []
                    const deletePermissionList = []

                    if (addPermissionKeys && addPermissionKeys.length > 0) {
                        for (const item of addPermissionKeys) {
                            addPermissionList.push({
                                'permissionId': item,
                                'roleId': self.role.roleId
                            })
                        }
                    }

                    if (deletePermissionKeys && deletePermissionKeys.length > 0) {
                        for (const item of deletePermissionKeys) {
                            deletePermissionList.push({
                                'permissionId': item,
                                'roleId': self.role.roleId
                            })
                        }
                    }

                    role.batchRolePermission({
                        'addPerList': addPermissionList,
                        'delPerList': deletePermissionList
                    }).then(result => {
                        self.roleDialogVisible = false

                        self.$message({
                            type: 'success',
                            message: '修改角色权限成功'
                        })
                    }).catch((error) => {
                        self.$message({
                            type: 'error',
                            message: error.message
                        })
                    })
                }

                if (this.isUpdateRole) {
                    const { roleId, roleName, roleRemark, roleMoney} = self.role
                    role.putRole({
                        'roleId': roleId,
                        'roleName': roleName,
                        'roleRemark': roleRemark,
                        'roleMoney' : roleMoney,
                        'colList' : "123",
                        'roleEditable' : "123",
                        'roleRight' : 123
                    }).then(result => {
                        self.roleDialogVisible = false

                        for (let index = 0; index < this.rolesList.length; index++) {
                            if (this.rolesList[index].roleId === this.role.roleId) {
                                this.rolesList.splice(index, 1, Object.assign({}, self.role))
                                break
                            }
                        }

                        self.currentRole = deepClone(self.role)

                        self.$message({
                            type: 'success',
                            message: '修改角色信息成功'
                        })
                    }).catch((error) => {
                        self.$message({
                            type: 'error',
                            message: error.message
                        })
                    })

                }

            },
            addRole () {
                const self = this
                role.addRole({
                    'roleName': self.role.roleName,
                    'roleRemark' : self.role.roleRemark,
                    'roleMoney' :self.role.roleMoney
                }).then(result => {

                    const addRoleData = result.data
                    self.role.roleId = addRoleData.roleId
                    self.rolesList.push(addRoleData)


                    if (self.role.routes && self.role.routes.length > 0) {
                        const addPerList = []
                        for (const item of self.role.routes) {
                            addPerList.push({
                                'permissionId': item,
                                'roleId': self.role.roleId
                            })
                        }
                        role.batchRolePermission({
                            'addPerList': addPerList,
                            'delPerList': []
                        }).then(result => {
                            self.roleDialogVisible = false

                            const { roleName } = self.role

                            self.$message({
                                type: 'success',
                                message: '新增角色成功'
                            })
                        })
                    } else {
                        self.roleDialogVisible = false

                        self.$message({
                            type: 'success',
                            message: '新增角色成功'
                        })
                    }
                }).catch(error => {
                    self.$message({
                        type: 'error',
                        message: error.message
                    })
                })
            },
            resetQueryParam () {
                this.filterQuery.roleName = ""
                this.filterRoleName = ""

            },
            handleTreeCheck (selectNode, checkedNodes) {
                const checkedNodeKeys = _.concat(checkedNodes.checkedKeys, checkedNodes.halfCheckedKeys)
                this.isUpdatePermission = _.difference(checkedNodeKeys, this.currentRolePermissionKeys).length > 0 ||
                    _.difference(this.currentRolePermissionKeys, checkedNodeKeys).length > 0
            },
            handleFilter () {
                this.filterQuery.roleName = this.filterRoleName
            },

            handleBeforeCloseEditRole (done) {
                //
                if (!this.isConfirmDisabled) {
                    this.$confirm('您修改了角色信息，是否需要保存?', '确认', {
                        confirmButtonText: '保存',
                        cancelButtonText: '不保存',
                        type: 'warning'
                    }).then(_ => {
                        // 需要保存
                        this.confirmRole()

                    })
                        .catch(_ => {
                            // 取消保存了-直接关闭
                            done()
                        })
                } else {
                    // 内容未修改-直接关闭
                    done()
                }
            },
            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function (flag) {
                // 当关闭面板时查询数据
                if (!flag) {
                    this.handleFilter()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-container {
        .manage-table {
            margin-top: 30px;
        }

        .permission-tree {
            margin-bottom: 30px;
        }
    }
</style>
