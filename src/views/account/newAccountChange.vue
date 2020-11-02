<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getNewAccountChangePage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="9em">

                    <el-form-item class="filter-form-item" label="用户UID">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="用户UID"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getNewAccountChangePage">
                        </el-input>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="操作原因">
                        <el-select
                            size="small"
                            v-model="searchReason"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in searchRessons"
                                :key="item.reasonValue"
                                :label="item.reasonName"
                                :value="item.reasonValue">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="游戏">
                        <el-select
                            size="small"
                            v-model="searchGame"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in searchGames"
                                :key="item.gameId"
                                :label="item.gameName"
                                :value="item.gameId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="游戏场次">
                        <el-select
                            size="small"
                            v-model="searchServer"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in searchServers"
                                :key="item.serverid"
                                :label="item.serverName"
                                :value="item.serverid">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="查询类型">
                        <el-select
                            size="small"
                            v-model="searchType"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" value="-1" label="全部"></el-option>
                            <el-option class="role-select-dropdown__item" value="0" label="游戏币"></el-option>
                            <el-option class="role-select-dropdown__item" value="1" label="元宝"></el-option>
                            <el-option class="role-select-dropdown__item" value="2" label="小喇叭"></el-option>
                            <el-option class="role-select-dropdown__item" value="351" label="钻石"></el-option>

                        </el-select>
                    </el-form-item>



                    <el-form-item class="filter-form-item" label="其他参数(like)">
                        <el-input size="small"
                                  v-model="searchParam"
                                  placeholder="其他参数"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="其他参数(notlike)">
                        <el-input size="small"
                                  v-model="paramnotlike"
                                  placeholder="其他参数"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="时间">
                        <el-date-picker
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            size="small"
                            v-model="searchTime">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="输赢范围">
                        <el-input size="small"
                                  v-model="startnum"
                                  style="width: 200px;"
                                  clearable>
                        </el-input> -
                        <el-input size="small"
                                  v-model="endnum"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>



                </el-form>
            </template>
        </filter-container>

        <div class="manage-main">
            <div class="manage-main-body">
                <el-table
                    ref="table"
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    v-loading="listLoading"
                    border
                    fit
                    highlight-current-row
                    height="100%"
                    :data="tableDates"
                    @row-click="handleSelectChange"
                    :row-class-name="tableRowClassName">

                    <el-table-column align="center" label="账号UID" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.uidstr }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="游戏名称" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gameName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="服务器名称" width="100">
                        <template slot-scope="scope" >
                            {{ scope.row.serverName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作类型" width="150">
                        <template slot-scope="scope">
                            {{ formatType(scope.row.index, scope.row)}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center"  label="操作原因" width="100">
                        <template slot-scope="scope">
                            {{ formatReson(scope.row.reason) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作前金额" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.values }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作金额"  width="100">
                        <template slot-scope="scope">
                            {{ scope.row.var }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作后金额" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.values + scope.row.var}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="其他参数" width="300">
                        <template slot-scope="scope">
                            {{ scope.row.param1 }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作时间" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.timestr }}
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
    import UploadImg from '@/components/UploadImg'
    import DateRangeUnlink from '@/components/Date/DateRangeUnlink'



    import { deepClone } from '@/utils'
    import account from '@/api/account/account'
    import game from '@/api/hallgame/game'

    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";

    export default {
        directives: { waves },
        components: {
            Pagination,
            FilterContainer,
            OperateContainer,
            UploadImg,
            DateRangeUnlink
        },
        data () {
            return {
                listLoading: false,
                isUpdate: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,

                searchUid : '',
                searchReason:'-1',
                searchGame:'0',
                searchServer:'0',
                searchType: '-1',
                startnum: '',
                endnum: '',
                paramnotlike: '',

                searchParam:'',
                searchTime: '',

                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                selectData: {}, // 当前选中的信息
                searchRessons:[],
                searchGames:[],
                searchServers:[],

            }
        },
        computed: {

        },
        watch: {
            'searchGame' (newValue, oldValue) {
                if (newValue) {
                    this.getSearchServers(newValue)
                }
            }
        },
        created () {
            this.getSearchReasons()
            this.getSearchGames()
        },

        methods: {
            async getNewAccountChangePage () {
                const self = this

                if (!self.searchTime) {
                    self.$message({
                        type: 'error',
                        message: '请选择时间'
                    })
                    return
                }

                self.listLoading = true

                account.getNewAccountChangePage(self.currentPage, self.pageSize,self.searchUid, self.searchReason,
                    self.searchGame, self.searchServer, self.searchType, self.startnum,self.endnum, self.searchParam,self.paramnotlike,
                    self.searchTime).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            getAppInfos () {
                const self = this
                app.getAppInfos().then(result => {
                    self.appInfos = result.data.appInfos
                }, result => {
                })
            },

            async getSearchReasons () {
                const res = await account.getSearchReasons()
                this.searchRessons = res.data
                this.searchRessons.unshift({reasonValue:'-1',reasonName:'全部'});
            },


            async getSearchGames() {
                const res = await game.getChildGames()
                this.searchGames = res.data
                this.searchGames.unshift({gameId:'0',gameName:'全部'});
            },

            async getSearchServers(gameId) {
                const res = await game.getGameServers(gameId)
                if (res.data) {
                    this.searchServers = res.data.serlist
                } else {
                    this.searchServers = []
                }
                this.searchServers.unshift({serverid:'0',serverName:'全部'});
            },


            handleSelectChange (row) {
                const self = this
                self.selectData = deepClone(row)
            },

            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
            },

            handleAddGoods () {
                this.currentData = deepClone(Object.assign({}, defaultData))

                this.currentDialogType = this.dialogType.NEW
                this.dialogVisible = true
            },

            resetQueryParam () {
                this.searchUid = ""
                this.getPayLogPage()
            },


            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function (flag) {
                // 当关闭面板时查询数据
                if (!flag) {
                    this.getNewAccountChangePage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getNewAccountChangePage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getNewAccountChangePage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getNewAccountChangePage()
            },

            formatType (value, rowData) {
                if(value==0 || rowData.reason==32 || rowData.reason==100 || rowData.reason==101 || rowData.reason==105 ||
                    rowData.reason==107 || rowData.reason==113){
                    return "游戏币操作";
                }else if(rowData.reason==102 || rowData.reason==103 || rowData.reason==106 ||
                    rowData.reason==108 || rowData.reason==114){
                    return "元宝操作";
                }else if( rowData.reason==109 || rowData.reason==115){
                    return "小喇叭操作";
                }else if(rowData.reason==110 || rowData.reason==117){
                    return "记牌器操作";
                }else if(rowData.reason==111 || rowData.reason==116){
                    return "比赛卷操作";
                }else if(rowData.reason==112){
                    return "踢人卡操作";
                }else{
                    return "道具操作(index:"+value+")";
                }
            },

            formatReson (value) {
                if(value!=null){
                    var res=0;
                    for(var i in self.reason){
                        if(value==self.reason[i].reasonValue){
                            res=1;
                            return self.reason[i].reasonName;
                        }
                    }
                    if(res==0){
                        return "reason:"+value;
                    }
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
<style>
    .role-select-dropdown__item {
        display: flex;
        padding-left: 30px;
    }

    .role-select-dropdown.is-multiple .role-select-dropdown__item.selected::after {
        left: 10px;
    }

    .role-select-dropdown__item .group-label {
        margin-left: auto;
        font-size: 12px;
        color: #c1c1c1;
    }
    .img-info {
        width: 60px;
        height: 60px;
        display: block;
    }
</style>
