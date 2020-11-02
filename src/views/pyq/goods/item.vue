<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getItemPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="游戏道具">
                        <el-select
                            size="small"
                            v-model="searchItemId"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in items"
                                :key="item.itemId"
                                :label="item.itemName"
                                :value="item.itemId">
                                {{ item.itemName }}
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
                    <el-table-column align="center" label="道具ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.itemId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="道具名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.itemName }}
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
                <el-form-item label="道具ID">
                    <el-input v-model="currentData.itemId" placeholder="道具ID"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>
                <el-form-item label="道具名称">
                    <el-input v-model="currentData.itemName" placeholder="道具名称"/>
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
    import goods from '@/api/pyq/goods'
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
                searchItemId:0,

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                items:[],
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
            this.getItemPage()
            this.getItems()
        },

        methods: {
            async getItemPage () {
                const self = this
                self.listLoading = true
                goods.getItemPage(self.currentPage, self.pageSize, self.searchItemId).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getItems() {
                const res = await goods.getItems()
                this.items = res.data
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
                debugger
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.itemId && self.currentData.itemId != 0 ) {
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
                if (!self.currentData.itemId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.currentData.itemId}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    userVip.deleteItem(self.currentData.itemId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        self.tableDatas = self.tableDatas.filter(item => {
                            return item.itemId != self.currentData.itemId
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
                fd.append('gi_GainOperate', 1);
                fd.append('gi_GainItemIndex', self.currentData.itemId);
                fd.append('gi_GainItemName', self.currentData.itemName);

                goods.putItem(fd).then(result => {
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
                fd.append('gi_GainOperate', 0);
                fd.append('gi_GainItemIndex', self.currentData.itemId);
                fd.append('gi_GainItemName', self.currentData.itemName);

                goods.addItem(fd).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getItemPage()
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
                    this.getItemPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getItemPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getItemPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getItemPage()
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
