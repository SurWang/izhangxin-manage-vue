<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getErrorInfoPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="错误ID">
                        <el-input size="small"
                                  v-model="searchId"
                                  placeholder="错误ID"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item  class="filter-form-item" label="错误类型">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchType
                            placeholder="错误类型"
                            clearable
                            filterable
                        >
                            <el-option
                                v-for="item in typeInfos"
                                :key="item.gdType"
                                :label="item.gdTypeName"
                                :value="item.gdType">
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

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-md-person-add"
                @click="refreshCache">
                刷新缓存
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
                    <el-table-column align="center" label="自增ID" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gdAutoId }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="类型ID" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gdType }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="类型描述" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gdTypeDesc }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="详情描述" width="300">
                        <template slot-scope="scope">
                            {{ scope.row.gdIdentify }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gdPriority }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="英文描述" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gdEnUsDesc }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="简体描述" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gdZhCnDesc }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="繁体描述" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gdZhTwDesc }}
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
            <el-form :model="currentData" label-width="130px" label-position="left">

                <el-form-item label="错误类型">
                    <el-select
                        v-model="currentData.gdType"
                        placeholder="请选择错误类型"
                        popper-class="role-select-dropdown">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in typeInfos"
                            :key="item.gdType"
                            :label="item.gdTypeName"
                            :value="item.gdType">
                            {{ item.gdTypeName }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="详情描述">
                    <el-input v-model="currentData.gdIdentify" placeholder="输入详情描述"/>
                </el-form-item>

                <el-form-item label="危险等级">
                    <el-select
                        v-model="currentData.gdPriority"
                        placeholder="请选择危险等级"
                        popper-class="role-select-dropdown">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in priorityInfos"
                            :key="item.gpId"
                            :label="item.gpDesc"
                            :value="item.gpId">
                            {{ item.gpDesc }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="英文描述">
                    <el-input v-model="currentData.gdEnUsDesc" placeholder="输入英文描述"/>
                </el-form-item>

                <el-form-item label="简体描述">
                    <el-input v-model="currentData.gdZhCnDesc" placeholder="输入简体描述"/>
                </el-form-item>

                <el-form-item label="繁体描述">
                    <el-input v-model="currentData.gdZhTwDesc" placeholder="输入繁体描述"/>
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

    import { deepClone } from '@/utils'
    import errorInfo from '@/api/app/errorInfo'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
    }

    const defaultGame = {
        sStatus : 1
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
            Pagination
        },
        data () {
            return {
                listLoading: false,
                isUpdateGame: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,

                filterQuery: Object.assign({}, defaultFilterQuery),
                filterGameName: '',
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchId:'',
                searchType: -1,

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],

                priorityInfos:[],
                typeInfos:[],

                gameDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
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
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
            this.getErrorInfoPage()
            this.getTypeInfos()
            this.getPriorityInfos()
        },

        methods: {
            async getErrorInfoPage () {
                const self = this
                self.listLoading = true
                errorInfo.getErrorInfoPage(self.currentPage, self.pageSize, self.searchId, self.searchType).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getTypeInfos () {
                const res = await errorInfo.getTypeInfo()
                this.typeInfos = res.data
                this.typeInfos.unshift({gdType:-1,gdTypeName:'全部'})
            },

            async getPriorityInfos() {
                const res = await errorInfo.getPriorityInfo()
                this.priorityInfos = res.data
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
                if (!self.currentData.gdAutoId) {
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

            refreshCache () {
                const self = this
                errorInfo.refreshErrorInfo().then(result => {
                    if (result.data.ret == 1) {
                        self.$message({
                            type: 'success',
                            message: result.data.desc
                        })
                        self.getErrorInfoPage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: result.data.desc
                        })
                    }
                }, result => {
                })

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
                if (!self.currentData.gdAutoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.currentData.gdAutoId}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append("pn", self.currentData.gdAutoId)
                    googlepay.deleteGooglepay(form).then(result => {
                        if (result.data.ret == 1) {
                            self.$message({
                                type: 'success',
                                message: result.data.desc
                            })
                            self.selectData= Object.assign({}, defaultGame)
                            self.getErrorInfoPage()
                        } else {
                            self.$message({
                                type: 'error',
                                message: result.data.desc
                            })
                        }
                    }, result => {
                    })
                }).catch(err => {
                })
            },

            async confirm () {
                const isEdit = this.currentDialogType === this.dialogType.EDIT
                if (isEdit) {
                    this.update()
                } else {
                    this.add()
                }
            },
            update () {
                const self = this

                let form = new FormData()
                form.append('flag', self.selectData.gdAutoId)
                form.append('typeIdS', self.currentData.gdType)
                form.append('identifyS',self.currentData.gdIdentify)
                form.append('dangerLevelS', self.currentData.gdPriority)
                form.append('dangerLevelSS', self.selectData.gdPriority)
                form.append('English', self.currentData.gdEnUsDesc)
                form.append('Chinese', self.currentData.gdZhCnDesc)
                form.append('Traditional', self.currentData.gdZhTwDesc)

                errorInfo.executeErrorInfo(form).then(result => {
                    self.gameDialogVisible = false
                    self.selectData = deepClone(self.currentData)
                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                    self.getErrorInfoPage()
                }).catch((error) => {

                })
            },
            add () {
                const self = this
                let form = new FormData()

                form.append('typeIdS', self.currentData.gdType)
                form.append('identifyS',self.currentData.gdIdentify)
                form.append('dangerLevelS', self.currentData.gdPriority)
                form.append('English', self.currentData.gdEnUsDesc)
                form.append('Chinese', self.currentData.gdZhCnDesc)
                form.append('Traditional', self.currentData.gdZhTwDesc)

                errorInfo.executeErrorInfo(form).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getErrorInfoPage()
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
                    this.getErrorInfoPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getErrorInfoPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getErrorInfoPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getErrorInfoPage()
            }
        },
        filters: {
            formatDate: function (value) {
                return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
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
