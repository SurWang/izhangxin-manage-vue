<template>
    <div class="app-container manage-container">
        <!--<filter-container
            @submit-form="getUserVipPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                </el-form>
            </template>
        </filter-container>-->

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
                    <el-table-column align="center" label="VIP等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.level }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="等级名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="可创建俱乐部数量" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.clubNum }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="可开房数量" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.tableNum }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="可备注数量" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.remarkNum }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="服务费收取" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.serviceFee}}
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

                <el-form-item label="等级" prop="level">
                    <el-input v-model="currentData.level" placeholder="等级" onkeyup="value=value.replace(/[^(\d-)]/g,'')"
                    :readonly="currentDialogType===dialogType.EDIT"/>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="currentData.name" placeholder="名称"/>
                </el-form-item>
                <el-form-item label="创建俱乐部数量" prop="clubNum">
                    <el-input v-model="currentData.clubNum" placeholder="可创建俱乐部数量" onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="创建房间数量" prop="tableNum">
                    <el-input v-model="currentData.tableNum" placeholder="可创建房间数量" onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="设置备注数量" prop="remarkNum">
                    <el-input v-model="currentData.remarkNum" placeholder="可设置备注数量" onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="服务费(%)" prop="serviceFee">
                    <el-input v-model="currentData.serviceFee" placeholder="服务费(%)-最小为1" min="1" onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
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
    import userVip from '@/api/pyq/userVip'
    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
    }

    const defaultGame = {

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

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                gameDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                rules: {
                    level : [
                        { required: true, message: '请输入等级', trigger: 'blur' }
                    ],
                    name : [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    clubNum: [
                        { required: true, message: '请输入俱乐部数量', trigger: 'blur' }
                    ],
                    tableNum: [
                        { required: true, message: '请输入房间数量', trigger: 'blur' }
                    ],
                    remarkNum:[
                        { required: true, message: '请输入备注数量', trigger: 'blur' }
                    ],
                    serviceFee: [
                        { required: true, message: '请输入服务费', trigger: 'blur' }
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
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
            this.getUserVipPage()
        },

        methods: {
            async getUserVipPage () {
                const self = this
                self.listLoading = true
                userVip.getUserVipPage(self.currentPage, self.pageSize).then(result => {
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
                if (!self.currentData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择数据!'
                    })
                    return
                }

                self.$set(self.currentData, 'serviceFee', self.currentData.serviceFee * 100)
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

                self.$confirm(`确认删除“${self.currentData.name}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    userVip.deleteItem(self.currentData.autoId).then(result => {
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
                const data = {
                    'autoId': parseInt(self.currentData.autoId),
                    'name': self.currentData.name,
                    'clubNum':parseInt(self.currentData.clubNum),
                    'tableNum':parseInt(self.currentData.tableNum),
                    'remarkNum':parseInt(self.currentData.remarkNum),
                    'serviceFee': parseInt(self.currentData.serviceFee)
                }

                userVip.putItem(data).then(result => {
                    self.gameDialogVisible = false
                    self.selectData = deepClone(self.currentData)

                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                    self.getUserVipPage()
                }).catch((error) => {

                })
            },
            add () {
                const self = this
                const data = {
                    'level': parseInt(self.currentData.level),
                    'name': self.currentData.name,
                    'clubNum':parseInt(self.currentData.clubNum),
                    'tableNum':parseInt(self.currentData.tableNum),
                    'remarkNum':parseInt(self.currentData.remarkNum),
                    'serviceFee': parseInt(self.currentData.serviceFee),
                    'autoId': ""
                }

                userVip.addItem(data).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getUserVipPage()
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
                    this.getUserVipPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getUserVipPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getUserVipPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getUserVipPage()
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
