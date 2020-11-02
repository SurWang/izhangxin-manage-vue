<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getVipPriceConfigPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="vip类型">
                        <el-select
                            size="small"
                            v-model="searchType"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            clearable
                        >
                            <el-option class="role-select-dropdown__item" :value="1" label="个人VIP">个人VIP</el-option>
                            <el-option class="role-select-dropdown__item" :value="2" label="俱乐部VIP">俱乐部VIP</el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="vip等级">
                        <el-input size="small"
                                  v-model="searchLevel"
                                  placeholder="vip等级"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="状态">
                        <el-select
                            size="small"
                            v-model="searchStatus"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            clearable
                        >
                            <el-option class="role-select-dropdown__item" :value="1" label="可用">可用</el-option>
                            <el-option class="role-select-dropdown__item" :value="2" label="不可用">不可用</el-option>
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
                    <el-table-column align="center" label="时间" width="200">
                        <template slot-scope="scope">
                            {{ formatType(scope.row.oDate) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="vip等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.vipLevel }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="vip价格" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.vipPrice }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="vip状态" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.vipStatus == 1 ? "可用" : "不可用"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.vipTime | formatDate}}
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
            <el-form :model="currentData" label-width="120px" label-position="left">
                <el-form-item label="vip类型">
                    <el-select
                        v-model="currentData.vipType"
                        placeholder="vip类型"
                        popper-class="role-select-dropdown"
                        >
                        <el-option :value="1" label="个人VIP">个人VIP</el-option>
                        <el-option :value="2" label="俱乐部vip">俱乐部vip</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="vip等级">
                    <el-input  v-model="currentData.vipLevel" placeholder="vip等级"/>
                </el-form-item>
                <el-form-item label="vip单价">
                    <el-input  v-model="currentData.vipPrice" placeholder="vip单价"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="currentData.vipStatus"
                        placeholder="vip类型"
                        popper-class="role-select-dropdown"
                        >
                        <el-option :value="1" label="可用">可用</el-option>
                        <el-option :value="2" label="不可用">不可用</el-option>
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
    import DateRangeUnlink from '@/components/Date/DateRangeUnlink'

    import { deepClone } from '@/utils'
    import vipPrice from '@/api/pyq/vipPrice'
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

                searchType:'',
                searchStatus:'',
                searchLevel:'',

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
        },

        methods: {

            async getVipPriceConfigPage () {
                const self = this
                self.listLoading = true
                vipPrice.getVipPriceConfigPage(self.currentPage, self.pageSize,self.searchType,
                    self.searchLevel,self.searchStatus).then(result => {
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
                if (!self.currentData.id) {
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
                if (isEdit) {
                    this.update()
                } else {
                    this.add()
                }
            },
            update () {
                const self = this
                let form = new FormData()
                form.append('vipId',self.currentData.id)
                form.append('vipTypeS',self.currentData.vipType)
                form.append('vipLevelS', self.currentData.vipLevel)
                form.append('vipPriceS', self.currentData.vipPrice)
                form.append('vipStatusS', self.currentData.vipStatus)

                vipPrice.putItem(form).then(result => {
                    self.gameDialogVisible = false
                    for (let index = 0; index < this.tableDatas.length; index++) {
                        if (this.tableDatas[index].id === this.currentData.id) {
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
                form.append('vipTypeS',self.currentData.vipType)
                form.append('vipLevelS', self.currentData.vipLevel)
                form.append('vipPriceS', self.currentData.vipPrice)
                form.append('vipStatusS', self.currentData.vipStatus)

                vipPrice.addItem(form).then(result => {
                    debugger
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getVipPriceConfigPage()
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
                    this.getVipPriceConfigPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getVipPriceConfigPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getVipPriceConfigPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getVipPriceConfigPage()

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
