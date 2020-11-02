<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getVipInfoPage"
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
                            filterable
                        >
                            <el-option class="role-select-dropdown__item" :value="1" label="个人VIP">个人VIP</el-option>
                            <el-option class="role-select-dropdown__item" :value="2" label="俱乐部VIP">俱乐部VIP</el-option>

                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="玩家uid">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="玩家uid"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="俱乐部id">
                        <el-input size="small"
                                  v-model="searchClubid"
                                  placeholder="俱乐部id"
                                  style="width: 200px;"
                                  clearable>
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
                @click="handleRefresh">
                刷新玩家vip数据
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
                    <el-table-column align="center" label="vip类型" width="200">
                        <template slot-scope="scope">
                            {{ formatType(scope.row.type) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="uid" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.uid }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="购买vip等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.buyLevel }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="购买开始时间" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.buyStartTime | formatDate }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="购买过期时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.buyOverTime | formatDate }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="兑换vip等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.excLevel }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="兑换开始时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.excStartTime | formatDate }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="兑换过期时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.excOverTime | formatDate }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="当前显示等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.mainLevel }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="当前等级过期时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.mainOverTime | formatDate}}
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
                searchUid: '',
                searchClubid:'',

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

            async getVipInfoPage () {
                const self = this
                if (!self.searchUid) {
                    self.$message({
                        type: 'error',
                        message: '请输入用户Id!'
                    })
                    return
                }
                self.listLoading = true
                vipPrice.getVipInfoPage(self.currentPage, self.pageSize,self.searchType,self.searchUid).then(result => {
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
                const data = {
                    'messageType': parseInt(self.currentData.message_typ),
                    'userId': self.currentData.userId,
                    'content': self.currentData.message
                }

                xingePush.addMsgItem(data).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getSpreadRebatePage()
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
                    this.getVipInfoPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getVipInfoPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getVipInfoPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getVipInfoPage()
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
            },

            handleRefresh () {
                const self = this
                if (!self.searchUid) {
                    self.$message({
                        type: 'error',
                        message: '请填写用户ID'
                    })
                    return
                }
                vipPrice.refershVipInfo(self.searchType,self.searchUid,self.searchClubid).then(result => {
                    if (result.data.code == 0) {
                        self.$message({
                            type: 'success',
                            message: result.data.msg
                        })
                    } else {
                        self.$message({
                            type: 'error',
                            message: result.data.msg
                        })
                    }
                }, result => {

                })

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
