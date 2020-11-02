<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getUsers"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">

                <el-form
                    @submit.native.prevent
                    :inline="true"
                    label-width="6em"
                    class="filter-form"
                    >
                    <el-form-item class="filter-form-item" label="成员姓名">
                        <el-input
                            style="width: 200px"
                            size="small"
                            placeholder="请输入搜索内容"
                            v-model="searchByName"
                            clearable
                            @keydown.enter.native="getUsers"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item  class="filter-form-item" label="角色">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchByRole
                            :filterable="!$isMobile"
                            placeholder="请选择角色"
                            clearable
                            @change="getUsers">
                            <el-option
                                v-for="item in roles"
                                :key=item.roleId
                                :label="item.roleName"
                                :value=item.roleName>
                            </el-option>
                        </el-select>
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
                @click="handleAddUser">
                新增
            </el-button>
            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEditUser">
                修改
            </el-button>
            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelUser">
                删除
            </el-button>
        </operate-container>

        <div class="manage-main">
            <div class="manage-main-body">
                <!--内容区域-->
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    v-loading="listLoading"
                    border
                    fit
                    height="100%"
                    highlight-current-row
                    :data="users"
                    @row-click="handleSelectChange">
                    <el-table-column
                            label="用户名"
                            align="center"
                            width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="角色名"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span>{{ getRoleName(scope.row.userRole)  }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="游戏限制"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userGameLimit == 0 ? "是" : "否" }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="游戏列表"
                        align="center"
                        width="350">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userGameListStr }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="平台限制"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userPlatformLimit == 0 ? "是" : "否"  }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="平台列表"
                        align="center"
                        width="350">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userPlatformListStr }}</span>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <div class="manage-main-footer">
                <pagination
                    class="data-panel-pagination"
                    v-show="listTotal > 0"
                    :total="listTotal"
                    :page.sync="currentPage"
                    :limit.sync="pageSize"
                    @pagination="handlePagination" />
            </div>
        </div>

        <!-- 编辑或添加用户角色权限弹框 -->
        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="userDialogVisible"
            :title="currentDialogType===dialogType.EDIT?'编辑用户':'新增用户'"
            width="550px"
           >
            <el-form label-width="80px"
                     :model="editUser"
                     ref="ruleForm"
                     :rules="rules">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editUser.userName" :readonly="currentDialogType===dialogType.EDIT"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPassword" >
                    <el-input ref="password" :key="passwordType" :type="passwordType" v-model="editUser.userPassword">
                    </el-input>
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                </el-form-item>

                <el-form-item label="角色" prop="userRole" >
                    <el-select
                        v-model="editUser.userRole"
                        placeholder="请选择用户角色"
                        popper-class="role-select-dropdown"
                        style="width: 100%;">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in roles"
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleId">
                            {{ item.roleName }}
                            <!--                            <span class="group-label">{{ getRoleGroupName(item.groupId) }}</span>-->
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="游戏限制" prop="userGameLimit">
                    <el-select
                        v-model="editUser.userGameLimit"
                        placeholder="请选择"
                        popper-class="role-select-dropdown"
                        style="width: 100%;">
                        <el-option :value="0" label="是">是</el-option>
                        <el-option :value="1" label="否">否</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="游戏" >
                    <el-select
                        v-model="editUser.userGameList"
                        placeholder="请选择游戏"
                        multiple
                        filterable
                        style="width: 100%;"
                        popper-class="role-select-dropdown">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in gameInfos"
                            :key="item.gameId"
                            :label="item.gameName"
                            :value="item.gameId">
                            {{ item.gameName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="平台限制" prop="userPlatformLimit">
                    <el-select
                        v-model="editUser.userPlatformLimit"
                        placeholder="请选择"
                        popper-class="role-select-dropdown"
                        style="width: 100%;">
                        <el-option :value="0" label="是">是</el-option>
                        <el-option :value="1" label="否">否</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="平台" >
                    <el-select
                        v-model="editUser.userPlatformList"
                        placeholder="请选择平台"
                        multiple
                        filterable
                        style="width: 100%;"
                        popper-class="role-select-dropdown">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in platformInfos"
                            :key="item.platformId"
                            :label="item.platformName"
                            :value="item.platformId">
                            {{ item.platformName }}
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="userDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmUser">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import { deepClone } from '@/utils'
    import app from '@/api/app/app'
    import game from '@/api/hallgame/game'
    import store from '../../store/index'
    import role from '../../api/system/role'
    import _ from "lodash";

    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }

    const defaultData = {
        userGameList:[],
        userPlatformList:[],
    }

    export default {
        name: 'UserManage',
        components: {
            Pagination,
            FilterContainer,
            OperateContainer
        },

        data () {
            return {
                isShowMoreSearch: false, // 是否展示更多搜索按钮
                isOpenSearch: false, // 是否展开更多搜索
                listLoading: false, // 列表加载loading
                isShowFilterPanel: false, // 是否显示filter面板，只在mobile端有效
                currentDialogType: DialogType.NEW,
                dialogType: DialogType,
                passwordType: 'password',

                roles: [], // 所有的角色
                users: [], // 查询出来的用户
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchByName: '', // 根据姓名搜索
                searchByRole: '', // 根据角色搜,

                userDialogVisible: false, // 是否显示编辑用户权限MODAL
                editUser: {}, // 编辑界面当前对象
                currentEditUser: {}, // 备份
                editUserRoleId: 0, // 当前的角色ID

                gameInfos : [],
                platformInfos:[],

                rules: {
                    userName : [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    userPassword : [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    userRole: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                    userGameLimit: [
                        { required: true, message: '请选择游戏限制', trigger: 'change' }
                    ],
                    userPlatformLimit: [
                        { required: true, message: '请选择平台限制', trigger: 'change' }
                    ]
                }
            }
        },
        computed: {

        },
        created () {
            const self = this
            self.getRoles()
            window.addEventListener('resize', self.handleResize)
            self.getGameInfos()
            self.getPlatformInfos()
        },
        mounted () {
            this.handleResize()
        },
        methods: {
            showPwd () {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            async getGameInfos () {
                const res = await game.getGames("", "")
                this.gameInfos = res.data.games
            },

            async getPlatformInfos () {
                const res = await role.getPlatformInfos()
                this.platformInfos = res.data
            },

            getUsers () {
                const self = this
                self.listLoading = true
                self.searchByRole = self.searchByRole ? self.searchByRole : ''
                role.getUsers(self.currentPage, self.pageSize, self.searchByName, self.searchByRole).then(result => {
                    self.listLoading = false
                    self.users = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.users = []
                })
            },
            async getRoles () {
                const res = await role.getRoles()
                this.roles = res.data.roles
                this.getUsers()
            },

            handleSelectChange (row) {
                const self = this
                self.currentEditUser = deepClone(row)
            },

            handleAddUser () {
                const self = this;
                self.currentDialogType = self.dialogType.NEW
                self.userDialogVisible = true
                self.editUser = {}
            },

            handleEditUser () {
                const self = this;
                self.editUser = deepClone(self.currentEditUser)

                if (!self.editUser.userId) {
                    self.$message({
                        type: 'error',
                        message: '请选择用户!'
                    })
                    return
                }

                if (self.editUser.userGameList) {
                    const strArr = self.editUser.userGameList.split(",")
                    const intArr = []
                    for (let i = 0; i < strArr.length; i++) {
                        intArr[i] = parseInt(strArr[i])
                    }
                    self.$set(self.editUser, 'userGameList', intArr)
                } else {
                    self.$set(self.editUser, 'userGameList', [])
                }

                if (self.editUser.userPlatformList) {
                    const strArr1 = self.editUser.userPlatformList.split(",")
                    const intArr1 = []
                    for (let i = 0; i  < strArr1.length; i++) {
                        intArr1[i] = parseInt(strArr1[i])
                    }
                    self.$set(self.editUser, 'userPlatformList', intArr1)
                } else {
                    self.$set(self.editUser, 'userPlatformList', [])
                }

                self.currentDialogType = self.dialogType.EDIT
                self.userDialogVisible = true
            },

            handleDelUser () {
                const self = this

                self.editUser = deepClone(self.currentEditUser)

                if (self.editUser.userId == undefined) {
                    self.$message({
                        type: 'error',
                        message: '请选择用户!'
                    })
                    return
                }

                self.$confirm(`确认删除用户“${self.editUser.userName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    role.deleteUser(self.editUser.userId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '用户删除成功!'
                        })
                        self.users = self.users.filter(item => {
                            return item.userId != self.editUser.userId
                        })
                        self.currentEditUser = {}
                    }, result => {
                    })

                }).catch(err => {
                })

            },

            resetQueryParam () {
                this.searchByName = ''
                this.searchByRole = ''
                this.getUsers()
            },
            getRoleName (roleId) {
                for (const role of this.roles) {
                    if (role.roleId === roleId) {
                        return role.roleName
                    }
                }
                return '未知-' + roleId
            },

            handlePagination (params) {
                this.getUsers()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getUsers()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getUsers()
            },

            confirmUser () {
                const self = this
                self.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        const isEdit = self.currentDialogType === self.dialogType.EDIT
                        if (isEdit) {
                            this.updateUser()
                        } else {
                            this.addUser()
                        }
                    } else {
                        return false;
                    }
                });
            },
            updateUser () {
                const self = this
                let form = new FormData()
                debugger
                const { userId, userName, userPassword, userRole,  userGameLimit, userPlatformLimit, userGameList,
                    userPlatformList } = self.editUser

                form.append('userId', userId)
                form.append('userName', userName)
                form.append('userPassword', userPassword)
                form.append('userGameLimit', userGameLimit)
                form.append('userPlatformLimit', userPlatformLimit)
                form.append('userRole', userRole)
                for (const item of userGameList) {
                    form.append('userGameList', item)
                }

                for (const item of userPlatformList) {
                    form.append('userPlatformList', item)
                }

                role.putUser(form).then(result => {
                    const addData = result.data
                    if (addData.success) {
                        self.userDialogVisible = false
                        self.currentEditUser = {}
                        self.$message({
                            type: 'success',
                            message: '修改用户信息成功'
                        })
                        self.getUsers()
                    } else {
                        self.$message({
                            type: 'error',
                            message: addData.msg
                        })
                    }
                }).catch((error) => {
                })
            },

            addUser () {
                const self = this
                let form = new FormData()
                debugger
                form.append('userName', self.editUser.userName)
                form.append('userPassword', self.editUser.userPassword)
                form.append('userGameLimit', self.editUser.userGameLimit)
                form.append('userPlatformLimit', self.editUser.userPlatformLimit)
                form.append('userRole', self.editUser.userRole)

                if (self.editUser.userGameList) {
                    for (const item of self.editUser.userGameList) {
                        form.append('userGameList', item)
                    }
                }

                if (self.editUser.userPlatformList) {
                    for (const item of self.editUser.userPlatformList) {
                        form.append('userPlatformList', item)
                    }
                }

                role.addUser(form).then(result => {
                    const addData = result.data
                    if (addData.success) {
                        self.userDialogVisible = false
                        self.$message({
                            type: 'success',
                            message: '新增用户成功'
                        })
                        self.getUsers()
                    } else {
                        self.$message({
                            type: 'error',
                            message: addData.msg
                        })
                    }
                }).catch(error => {
                    self.$message({
                        type: 'error',
                        message: error.message
                    })
                })
            },

            handleResize: function () {
                const filterFormEle = document.querySelector('.filter-form')
                if (!filterFormEle) {
                    return
                }
                const searchFormWidth = filterFormEle.offsetWidth
                let searchFormItemAllWidth = 0
                const searchFormItemEles = document.querySelectorAll('.filter-form-item')
                if (searchFormItemEles && searchFormItemEles.length > 0) {
                    for (const tempEle of searchFormItemEles) {
                        searchFormItemAllWidth += tempEle.offsetWidth
                    }
                    this.isShowMoreSearch = searchFormItemAllWidth > searchFormWidth
                } else {
                    this.isShowMoreSearch = false
                }
            },
            handleOpenMoreSearchClick: function () {
                this.isOpenSearch = !this.isOpenSearch
            },
            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function (flag) {
                if (!flag) {
                    this.getUsers()
                }
            },

            getGameName : function (value) {
                const self = this
                let gameNames = ""
                if (!value) {
                    return gameNames
                }

                const arr = self.gameInfos.filter(item => {
                    if (value.indexOf(item.gameId) !== -1) {
                        return item.gameName
                    }
                })

                for (const obj of arr) {
                    gameNames += obj.gameName
                    gameNames += ","
                }
                return gameNames

            }
        }
    }
</script>

<style>
    .role-select-dropdown__item {
        display: flex;
        padding-left: 30px;
    }

    .role-select-dropdown.is-multiple .role-select-dropdown__item.selected::after {
        left: 10px;
    }

    .role-select-dropdown__item .group-label {
        margin-left: auto;
        font-size: 12px;
        color: #c1c1c1;
    }
</style>

<style scoped>
    .data-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .filter-container {
        flex-shrink: 0;
    }

    .data-panel-main {
        display: flex;
        flex: auto;
        flex-direction: column;
        height: 0;
    }

    .data-panel-main-body {
        flex: auto;
        height: 0;
    }

    .data-panel-main-footer {
        flex-shrink: 0;
        padding: 4px 12px;
    }

    .data-panel-content {
        display: inline-block;
        min-width: 100%;
    }

    .data-panel-table >>> .cell {
        line-height: 28px;
    }

    .data-panel-table >>> th {
        background-color: #fafafa;
        font-weight: normal;
        color: rgba(0, 0, 0, .85);
    }

    .data-panel-table__tag {
        margin: 2px 4px 2px 0;
        font-size: 14px;
    }

    .data-panel-table__button {
        font-size: 14px;
    }

    .data-panel-pagination {
        padding: 0;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 5px;
        font-size: 16px;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
    }
</style>
