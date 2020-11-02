<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getSysMsgPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="消息类型">
                        <el-select
                            size="small"
                            v-model="searchType"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            clearable
                            filterable
                        >
                            <el-option class="role-select-dropdown__item" :value="1" label="俱乐部消息">俱乐部消息</el-option>
                            <el-option class="role-select-dropdown__item" :value="2" label="个人消息">个人消息</el-option>

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
                添加推送
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
                    <el-table-column align="center" label="发送人" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.sender_id }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="接收人" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.reciever_id }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="消息类型" width="200">
                        <template slot-scope="scope">
                            {{ formatterType(scope.row.message_typ) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="消息内容" width="400">
                        <template slot-scope="scope">
                            {{ scope.row.message }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="发送时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.send_time | formatDate }}
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
                        style="width: 93%;"
                        clearable
                        filterable>
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
    import xingePush from '@/api/pyq/xingePush'
    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
    }

    const defaultGame = {
        message_typ: 1
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

                searchType:'',

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
            this.getSysMsgPage()
        },

        methods: {
            async getSysMsgPage () {
                const self = this
                self.listLoading = true
                xingePush.getSysMsgPage(self.currentPage, self.pageSize,self.searchType).then(result => {
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
                    self.getSysMsgPage()
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
                    this.getSysMsgPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getSysMsgPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getSysMsgPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getSysMsgPage()
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
