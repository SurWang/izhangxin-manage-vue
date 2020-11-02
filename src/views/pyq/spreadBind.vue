<template>
    <div class="app-container manage-container">
        <div class="filter-container">
            <!-- 搜索面板遮罩 -->
            <div class="filter-wrapper">
                <!-- 搜索面板展开关闭按钮 -->
                <div class="filter-header">
                    <div class="filter-title">搜索</div>
                </div>
                <div class="filter-main">
                    <div class="filter-left">
                        <el-form
                            inline
                            class="filter-form"
                            label-width="6em">
                            <el-form-item class="filter-form-item" label="账号ID">
                                <el-input size="small"
                                          v-model="searchUid"
                                          placeholder="用户ID"
                                          style="width: 200px;"
                                          clearable>
                                </el-input>
                            </el-form-item>

                            <el-form-item class="filter-form-item" label="推广码">
                                <el-input size="small"
                                          v-model="searchCode"
                                          placeholder="推广码"
                                          style="width: 200px;"
                                          clearable>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="filter-right">
                        <el-button type="primary" size="small" icon="el-icon-search" @click="getSpreadBindPage">绑定者查询
                        </el-button>
                        <el-button type="primary" size="small" icon="el-icon-search" @click="getSpreadBoundPage">被绑定者查询
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <operate-container>
            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-md-person-add"
                @click="handleBund">
                解除绑定
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
                    <el-table-column align="center" label="用户ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.usPlyGuid }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="用户昵称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.usNickName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="推广码" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.usSpreadCode }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="被绑定用户UID" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.convenerUid }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="被绑定用户昵称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.convenerNickName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="被绑定用户推广码" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.convenerCode }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="已领取返利" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.usReceivedNum }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="总返利" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.usTotalNum }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="绑定时间" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.usBundTime }}
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
                <el-form-item label="消息类型">
                    <el-select
                        v-model="currentData.message_typ"
                        placeholder="活动状态"
                        popper-class="role-select-dropdown"
                        style="width: 93%;">
                        <el-option :value="1" label="俱乐部消息">俱乐部消息</el-option>
                        <el-option :value="2" label="个人消息">个人消息</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接收消息玩家ID">
                    <el-input type="textarea" :rows="4" v-model="currentData.userId" placeholder="请输入接收消息玩家的uid 可以批量发送，如果发送给个人，则中间以英文“,”隔开 如(10000001,10000002) 如果是发给俱乐部格式如下(10000001-1,10000002-2) 前面是uid 后面是俱乐部ID"/>
                </el-form-item>
                <el-form-item label="推送内容">
                    <el-input type="textarea" :rows="4"  v-model="currentData.message" placeholder="推送内容"/>
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
    import spread from '@/api/pyq/spread'
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

                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchUid:'',
                searchCode:'',


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
            async getSpreadBindPage () {
                const self = this

                if (!self.searchUid && !self.searchCode) {
                    self.$message({
                        type: 'info',
                        message: '请输入推广员ID或推广code!'
                    })
                    return
                }

                self.listLoading = true
                spread.getSpreadBindPage(self.currentPage, self.pageSize,self.searchUid, self.searchCode).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getSpreadBoundPage () {
                const self = this

                if (!self.searchUid && !self.searchCode) {
                    self.$message({
                        type: 'info',
                        message: '请输入推广员ID或推广code!'
                    })
                    return
                }

                self.listLoading = true
                spread.getSpreadBoundPage(self.currentPage, self.pageSize,self.searchUid, self.searchCode).then(result => {
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
             * 解绑
             * @param $index
             * @param row
             */
            handleBund () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.usPlyGuid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认解除绑定“${self.currentData.usPlyGuid}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData();
                    form.append('spreadUid', self.currentData.usPlyGuid)
                    spread.bund(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '解除成功!'
                        })
                        self.selectData= Object.assign({}, defaultGame)
                        self.getSpreadBindPage()
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
                    self.getSpreadBindPage()
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
                    this.getSpreadBindPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getSpreadBindPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getSpreadBindPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getSpreadBindPage()
            },
            formatterType(value){
                if(value==1){
                    return "俱乐部消息";
                }else if(value==2){
                    return "个人消息";
                }else{
                    return value;
                }
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
