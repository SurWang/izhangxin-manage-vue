<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getPayMethodPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">

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
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDel">
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
                    height="100%"
                    border
                    fit
                    highlight-current-row
                    :data="tableDatas"
                    @row-click="handleSelectChange"
                >
                    <el-table-column align="center" label="编号" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.mid }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="方法" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.method }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="isSp" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.isSp }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="isAppNotify" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.isAppNotify }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="isShow" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.isShow }}
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
            <el-form :model="currentData" label-width="130px" label-position="left"
                     ref="ruleForm" :rules="rules">

                <el-form-item label="支付编号" prop="mid">
                    <el-input v-model="currentData.mid" placeholder="输入支付编号"/>
                </el-form-item>

                <el-form-item label="名称" prop="name">
                    <el-input v-model="currentData.name" placeholder="输入名称"/>
                </el-form-item>

                <el-form-item label="方法">
                    <el-input v-model="currentData.method" placeholder="输入方法"/>
                </el-form-item>

                <el-form-item label="isSp">
                    <el-select
                        v-model="currentData.isSp"
                        placeholder="isSp"
                        popper-class="role-select-dropdown"
                        style="width: 93%;"
                        >
                        <el-option :value="1" label="是">是</el-option>
                        <el-option :value="0" label="否">否</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="isAppNotify">
                    <el-select
                        v-model="currentData.isAppNotify"
                        placeholder="isAppNotify"
                        popper-class="role-select-dropdown"
                        style="width: 93%;"
                    >
                        <el-option :value="1" label="是">是</el-option>
                        <el-option :value="0" label="否">否</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="isShow">
                    <el-select
                        v-model="currentData.isShow"
                        placeholder="isShow"
                        popper-class="role-select-dropdown"
                        style="width: 93%;"
                    >
                        <el-option :value="1" label="是">是</el-option>
                        <el-option :value="0" label="否">否</el-option>
                    </el-select>
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
    import pay from '@/api/pay/pay'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
    }

    const defaultGame = {
        method:'OrderUtil.commonPay',
        isSp:0,
        isAppNotify:0,
        isShow : 0
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

                searchStatus:1,

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                apps:[],
                gameDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                rules: {
                    mid : [
                        { required: true, message: '请输入Id', trigger: 'blur' }
                    ],
                    name : [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                },
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
            this.getPayMethodPage()
        },

        methods: {
            async getPayMethodPage () {
                const self = this
                self.listLoading = true
                pay.getPayMethodPage(self.currentPage, self.pageSize).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
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
                if (!self.currentData.mid) {
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
                if (!self.currentData.mid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.currentData.name}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append("mid", self.currentData.mid)
                    googlepay.deleteGooglepay(form).then(result => {
                        if (result.data.ret == 1) {
                            self.$message({
                                type: 'success',
                                message: result.data.msg
                            })
                            self.selectData= Object.assign({}, defaultGame)
                            self.getPayMethodPage()
                        } else {
                            self.$message({
                                type: 'error',
                                message: result.data.msg
                            })
                        }
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
                form.append('sId', self.selectData.sId)
                form.append('binderScaleS', self.currentData.binderScale)
                form.append('boundScaleS',self.currentData.boundScale)
                form.append('sStatusS', self.currentData.sStatus)

                spread.editRebateRate(form).then(result => {
                    self.gameDialogVisible = false

                    self.selectData = deepClone(self.currentData)

                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                    self.getPayMethodPage()
                }).catch((error) => {

                })
            },
            add () {
                const self = this
                let form = new FormData()
                form.append('mid', self.currentData.mid)
                form.append('name',self.currentData.name)
                form.append('method', self.currentData.method)
                form.append('isSp', self.currentData.isSp)
                form.append('isAppNotify', self.currentData.isAppNotify)
                form.append('isShow', self.currentData.isShow)

                pay.addPayMethod(form).then(result => {
                    if (result.data.ret > 0) {
                        self.gameDialogVisible = false
                        self.$message({
                            type: 'success',
                            message: '新增信息成功'
                        })
                        self.getPayMethodPage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: result.data.desc
                        })
                    }

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
                    this.getPayMethodPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getPayMethodPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getPayMethodPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getPayMethodPage()
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
