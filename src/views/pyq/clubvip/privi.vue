<template>
    <div class="app-container manage-container">

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
                    <el-table-column align="center" label="权限ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.priviId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="权限名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.priviName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="权限描述" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.priviDesc }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="gameDialogVisible"
            :title="currentDialogType===dialogType.EDIT?'编辑':'新增'"
            width="600px"
        >
            <el-form :model="currentData" label-width="120px" label-position="left">
                <el-form-item label="权限ID">
                    <el-input v-model="currentData.priviId" placeholder="权限ID"/>
                </el-form-item>
                <el-form-item label="权限名称">
                    <el-input v-model="currentData.priviName" placeholder="权限名称"/>
                </el-form-item>
                <el-form-item label="权限描述">
                    <el-input v-model="currentData.priviDesc" placeholder="权限描述"/>
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
    import clubVip from '@/api/pyq/clubVip'
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
                listLoading1: false,
                isUpdateGame: false,
                isShowFilterPanel: false,

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
            this.getClubVipPage()
        },

        methods: {
            async getClubVipPage () {
                const self = this
                self.listLoading = true
                clubVip.getClubVipPage(self.currentPage, self.pageSize).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
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
                        message: '请选择!'
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

                self.$confirm(`确认删除“${self.currentData.priviName}”?`, '提示', {
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
                if (isEdit) {
                    this.update()
                } else {
                    this.add()
                }
            },
            update () {
                const self = this
                let fd = new FormData();
                fd.append('autoId', self.currentData.autoId);
                fd.append('priviName', self.currentData.priviName);
                fd.append('priviDesc', self.currentData.priviDesc);

                clubVip.putItem(fd).then(result => {
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
                let fd = new FormData();
                fd.append('priviId', self.currentData.priviId);
                fd.append('priviName', self.currentData.priviName);
                fd.append('priviDesc', self.currentData.priviDesc);

                clubVip.addItem(fd).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getClubVipPage()
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
                    this.getClubVipPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getClubVipPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getClubVipPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getClubVipPage()
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
