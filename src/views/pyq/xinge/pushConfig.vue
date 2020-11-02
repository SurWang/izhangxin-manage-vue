<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getXingePushConfigPage"
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

                    <el-form-item class="filter-form-item" label="应用">
                        <el-select
                            size="small"
                            v-model="searchPn"
                            placeholder="请选择应用"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in searchAppInfos"
                                :key="item.pn"
                                :label="item.aiName"
                                :value="item.pn">
                                {{ item.aiName }}
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="比赛类型ID">
                        <el-input size="small"
                                  v-model="searchMatchId"
                                  placeholder="比赛类型ID"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>


                    <el-form-item class="filter-form-item" label="推送类型">
                        <el-select
                            size="small"
                            v-model="searchType"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" :value="-1" label="全部">全部</el-option>
                            <el-option class="role-select-dropdown__item" :value="0" label="普通推送">普通推送</el-option>
                            <el-option class="role-select-dropdown__item" :value="1" label="比赛场推送">比赛场推送</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </template>
        </filter-container>

        <operate-container>
            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="closeXingePush">
                关闭推送
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
                            {{ scope.row.pns }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="推送标题" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.title }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="推送内容" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.content == 2 ? "IOS" : "Android" }}
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="推送类型" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.notifyType == 0 ? "普通推送" : "比赛场推送"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="比赛类型ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.matchTypeId}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否响铃" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.isRing == 0 ? "否":"是"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否震动" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.isVibrate ? "否":"是"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否可清除" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.isClearable ? "否":"是"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="推送时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.taskTimeStr}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="推送状态" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.status}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="推送结果" width="200">
                        <template slot-scope="scope">
                            {{ formatPushStatus(scope.row.result)}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="创建时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.createTimeStr}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="修改时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.updateTimeStr}}
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
    import xingePush from '@/api/pyq/xingePush'
    import app from '@/api/app/app'
    import game from '@/api/hallgame/game'

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
                searchGame:'',
                searchPn:'',
                searchType:-1,
                searchMatchId:'',

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                gameDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                searchAppInfos:[],
                mainGameInfos:[],
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
            'searchGame' (newValue, oldValue) {
                if (newValue) {
                    this.getSearchAppInfos(newValue, "")
                }
            }
        },
        created () {
            this.getMainGame()
        },

        methods: {

            async getXingePushConfigPage () {
                const self = this
                self.listLoading = true
                xingePush.getXingePushConfigPage(self.currentPage, self.pageSize,self.searchPn,
                    self.searchType,self.searchMatchId).then(result => {
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
            closeXingePush () {
                const self = this
                if (!self.selectData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                if (self.selectData.status == 3) {
                    self.$message({
                        type: 'error',
                        message: '关闭状态无需再次关闭!'
                    })
                    return
                }
                self.currentData = deepClone(self.selectData)
                self.$confirm(`确认关闭推送“${self.currentData.title}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append('xgId',self.currentData.xgId)
                    form.append('matchTypeId',self.currentData.matchTypeId)
                    form.append('taskTime',self.currentData.taskTime)

                    xingePush.deleteXingePush(form).then(result => {
                        if (result.data == 0) {
                            self.$message({
                                type: 'success',
                                message: '关闭成功!'
                            })
                            self.selectData= Object.assign({}, defaultGame)
                        } else {
                            self.$message({
                                type: 'error',
                                message: '关闭失败!'
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
                    self.getXingePushConfigPage()
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
                    this.getXingePushConfigPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getXingePushConfigPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getXingePushConfigPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getXingePushConfigPage()

            },

            handleClick(tab, event) {
                this.tableDatas = []
                this.listTotal = 0
            },
            formatPushStatus(value){
                var v = "未知";
                if(value==0){
                    v = "未执行";
                }else if(value==1){
                    v = "执行成功";
                }else if(value==2){
                    v = "执行失败";
                }else if(value==3){
                    v = "推送关闭";
                }
                return v;
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
