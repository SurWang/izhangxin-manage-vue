<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getXingeAppConfigPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="游戏">
                        <el-select
                            size="small"
                            v-model="searchGame"
                            placeholder="请选择游戏"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in mainGameInfos"
                                :key="item.gameId"
                                :label="item.gameName"
                                :value="item.gameId">
                                {{ item.gameName }}
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="filter-form-item" label="选择应用">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchPn
                            :filterable="!$isMobile"
                            placeholder="请选择应用"
                            clearable
                        >
                            <el-option
                                v-for="item in searchAppInfos"
                                :key=item.pn
                                :label="item.aiName"
                                :value=item.pn>
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
                @click="handleAdd">
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit">
                修改
            </el-button>
        </operate-container>

        <div class="manage-main">
            <div class="manage-main-body">
                <el-table
                    ref="table"
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    v-loading="listLoading"
                    height="100%"
                    border
                    fit
                    highlight-current-row
                    :data="tableDatas"
                    @row-click="handleSelectChange"
                >
                    <el-table-column align="center" label="应用pn" width="200">
                        <template slot-scope="scope">
                            {{ formatType(scope.row.appPn) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.appName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="应用类型" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.appSystem == 2 ? "IOS" : "Android" }}
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="信鸽应用ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.accessId}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="信鸽秘钥" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.secretKey}}
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

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="gameDialogVisible"
            :title="currentDialogType===dialogType.EDIT?'编辑':'新增'"
            width="600px"
        >
            <el-form ref="ruleForm" :model="currentData" label-width="120px"
                     label-position="left" :rules="rules" >
                <el-form-item label="游戏" prop="gameid">
                    <el-select
                        v-model="currentData.gameid"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        filterable
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in mainGameInfos"
                            :key="item.gameId"
                            :label="item.gameName"
                            :value="item.gameId">
                            {{ item.gameName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="应用" prop="appPn">
                    <el-select
                        v-model="currentData.appPn"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        filterable
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in apps"
                            :key="item.pn"
                            :label="item.aiName"
                            :value="item.pn">
                            {{ item.aiName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="应用类型">
                    <el-select
                        v-model="currentData.appSystem"
                        placeholder="vip类型"
                        popper-class="role-select-dropdown"
                    >
                        <el-option :value="1" label="Android">Android</el-option>
                        <el-option :value="2" label="IOS">IOS</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="信鸽access id" prop="accessId" >
                    <el-input  v-model="currentData.accessId" placeholder="信鸽access id"/>
                </el-form-item>
                <el-form-item label="信鸽secret key" prop="secretKey">
                    <el-input  v-model="currentData.secretKey" placeholder="信鸽secret key"/>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="gameDialogVisible=false">取消</el-button>
                <el-button type="primary"  @click="confirm">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'
    import DateRangeUnlink from '@/components/Date/DateRangeUnlink'

    import { deepClone } from '@/utils'
    import waves from '@/directive/waves'
    import moment from "moment";
    import xingePush from '@/api/pyq/xingePush'
    import game from '@/api/hallgame/game'
    import app from '@/api/app/app'

    const defaultFilterQuery = {
    }

    const defaultGame = {
        appSystem:1,
        appPn:""
    }

    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }

    export default {
        directives: { waves },
        components: {
            FilterContainer,
            OperateContainer,
            Pagination,
            DateRangeUnlink
        },
        data () {
            return {
                listLoading: false,
                isUpdateGame: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchGame:'',
                searchPn:'',


                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                gameDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                mainGameInfos:[],
                apps:[],
                searchAppInfos:[],

                rules: {
                    gameid:[
                        { required: true, message: '请输入游戏', trigger: 'change' }
                    ],
                    appPn:[
                        { required: true, message: '请输入应用', trigger: 'change' }
                    ],
                    accessId:[
                        { required: true, message: '请输入accessId', trigger: 'blur' }
                    ],
                    secretKey:[
                        { required: true, message: '请输入secretKey', trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {
            isConfirmDisabled () {
                if (this.currentData.gameName && this.currentData.gameName.trim().length > 0) {
                    // 渠道名称不为空的时候，在判断用户名是否修改或者是否修改了渠道信息
                    return !(this.isUpdateGame)
                } else {
                    // 渠道必须要有名称，不可以为空
                    return true
                }
            }
        },
        watch: {
            'currentData.gameid' (newValue, oldValue) {
                if (newValue) {
                    this.getApps(newValue, "")
                }
            },
            'searchGame' (newValue, oldValue) {
                if (newValue) {
                    this.getSearchAppInfos(newValue, "")
                }
            }
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
            this.getMainGame()

        },

        methods: {

            async getXingeAppConfigPage () {
                const self = this
                self.listLoading = true
                xingePush.getXingeAppConfigPage(self.currentPage, self.pageSize,self.searchGame,
                    self.searchPn).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getMainGame () {
                const res = await game.getMainGame()
                this.mainGameInfos = res.data.maingames
            },

            async getApps (gameId, channelId) {
                const res = await app.getApps(gameId, channelId)
                this.apps = res.data
                if (this.apps && this.apps.length > 0) {
                    this.currentData.appPn = this.apps[0].pn
                } else {
                    this.currentData.appPn = ''
                }
            },

            async getSearchAppInfos (gameId, channelId) {
                const res = await app.getApps(gameId, channelId)
                this.searchAppInfos = res.data
                if (this.searchAppInfos && this.searchAppInfos.length > 0) {
                    this.searchPn = this.searchAppInfos[0].pn
                } else {
                    this.searchPn = ''
                }
            },




            handleSelectChange (row) {
                const self = this
                self.selectData = deepClone(row)
            },
            handleAdd () {
                this.currentData = Object.assign({}, defaultGame)
                this.currentDialogType = this.dialogType.NEW
                this.gameDialogVisible = true
            },

            handleEdit () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择数据!'
                    })
                    return
                }

                // 重置保存状态
                self.isUpdateGame = false
                self.currentDialogType = this.dialogType.EDIT

                self.gameDialogVisible = true

            },
            /**
             * 删除
             * @param $index
             * @param row
             */
            handleDel () {
                const self = this
                self.currentData = deepClone(self.selectData)
                debugger
                if (!self.currentData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.currentData.appName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append('app_operate',2)
                    form.append('app_pn',self.currentData.appPn)
                    xingePush.executeAppConfig(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        self.tableDatas = self.tableDatas.filter(item => {
                            return item.autoId != self.currentData.autoId
                        })
                        self.selectData= Object.assign({}, defaultGame)
                    }, result => {
                    })
                }).catch(err => {
                })
            },

            async confirm () {
                const isEdit = this.currentDialogType === this.dialogType.EDIT

                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        if (isEdit) {
                            this.update()
                        } else {
                            this.add()
                        }
                    } else {
                        return false;
                    }
                });
            },
            update () {
                const self = this
                let form = new FormData()
                form.append('app_operate',1)
                form.append('app_pn',self.currentData.appPn)
                form.append('app_appSystem', self.currentData.appSystem)
                form.append('app_accessid', self.currentData.accessId)
                form.append('app_secretkey', self.currentData.secretKey)

                xingePush.executeAppConfig(form).then(result => {
                    self.gameDialogVisible = false
                    for (let index = 0; index < this.tableDatas.length; index++) {
                        if (this.tableDatas[index].autoId === this.currentData.autoId) {
                            this.tableDatas.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }
                    self.selectData = deepClone(self.currentData)
                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                }).catch((error) => {

                })
            },
            add () {
                const self = this
                let form = new FormData()
                form.append('app_operate',0)
                form.append('app_pn',self.currentData.appPn)
                form.append('app_appSystem', self.currentData.appSystem)
                form.append('app_accessid', self.currentData.accessId)
                form.append('app_secretkey', self.currentData.secretKey)

                xingePush.executeAppConfig(form).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getXingeAppConfigPage()
                }).catch(error => {
                })
            },
            resetQueryParam () {
            },

            handleBeforeCloseEditGame (done) {
                //
                if (!this.isConfirmDisabled) {
                    this.$confirm('您修改了渠道信息，是否需要保存?', '确认', {
                        confirmButtonText: '保存',
                        cancelButtonText: '不保存',
                        type: 'warning'
                    }).then(_ => {
                        // 需要保存
                        this.confirmGame()
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
                    this.getXingeAppConfigPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getXingeAppConfigPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getXingeAppConfigPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getXingeAppConfigPage()

            },

            handleClick(tab, event) {
                this.tableDatas = []
                this.listTotal = 0
            },

            formatType(value) {
                var result="全部";
                if(value==1){
                    result= "个人VIP"
                }
                if(value==2){
                    result= "俱乐部VIP"
                }
                return result;
            }
        },
        filters: {
            formatDate: function (value) {
                if (value == 0 || value == null) {
                    return "不限"
                } else {
                    return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-container {
        .roles-table {
            margin-top: 30px;
        }

        .permission-tree {
            margin-bottom: 30px;
        }
    }
</style>
