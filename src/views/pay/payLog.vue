<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getPayLogPage"
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
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in gameInfos"
                                :key="item.gameId"
                                :label="item.gameName"
                                :value="item.gameId">
                                {{ item.gameName }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="渠道">
                        <el-select
                            size="small"
                            v-model="searchChannel"
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in channelInfos"
                                :key="item.channelId"
                                :label="item.channelName"
                                :value="item.channelId">
                                {{ item.channelName }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  class="filter-form-item" label="应用">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchPn
                            :filterable="!$isMobile"
                            placeholder="请选择应用"
                            clearable
                        >
                            <el-option
                                v-for="item in appInfos"
                                :key=item.pn
                                :label="item.aiName"
                                :value=item.pn>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="系统">
                        <el-select
                            size="small"
                            v-model="searchSystem"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" value="all" label="全部">全部</el-option>
                            <el-option class="role-select-dropdown__item" value="ios" label="ios">ios</el-option>
                            <el-option class="role-select-dropdown__item" value="android" label="android">android</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="用户UID">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="用户UID"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getPayLogPage">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="订单号">
                        <el-input size="small"
                                  v-model="searchOrder"
                                  placeholder="订单号"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getPayLogPage">
                        </el-input>
                    </el-form-item>
                    <el-form-item  class="filter-form-item" label="支付方式">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchPayMethod
                            :filterable="!$isMobile"
                            placeholder="请选择支付方式"
                            clearable
                        >
                            <el-option
                                v-for="item in payMethods"
                                :key=item.mid
                                :label="item.name"
                                :value=item.mid>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="宝箱价格">
                        <el-input size="small"
                                  v-model="searchBeginBox"
                                  placeholder=""
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                        -
                        <el-input size="small"
                                  v-model="searchEndBox"
                                  placeholder=""
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="订单状态">
                        <el-select
                            size="small"
                            v-model="searchStatus"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" value="-1" label="全部"></el-option>
                            <el-option class="role-select-dropdown__item" value="0" label="支付成功"></el-option>
                            <el-option class="role-select-dropdown__item" value="3" label="补单成功"></el-option>
                            <el-option class="role-select-dropdown__item" value="11" label="成功付款部分"></el-option>
                            <el-option class="role-select-dropdown__item" value="6" label="验签失败"></el-option>
                            <el-option class="role-select-dropdown__item" value="2" label="支付失败"></el-option>
                            <el-option class="role-select-dropdown__item" value="7" label="付款金额错误"></el-option>
                            <el-option class="role-select-dropdown__item" value="1" label="订单初始化"></el-option>
                            <el-option class="role-select-dropdown__item" value="5" label="等待支付通知超时"></el-option>
                            <el-option class="role-select-dropdown__item" value="4" label="补单失败"></el-option>
                            <el-option class="role-select-dropdown__item" value="8" label="添加道具部分成功"></el-option>
                            <el-option class="role-select-dropdown__item" value="9" label="添加道具完全失败"></el-option>
                            <el-option class="role-select-dropdown__item" value="10" label="更新订单状态失败"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="时间">
                        <date-range-unlink
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            size="small"
                            v-model="searchTime">
                        </date-range-unlink>
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

                    <el-table-column align="center" label="游戏名" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gameStr }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="渠道" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.channelStr }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="应用包名" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pnName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="UID" width="100">
                        <template slot-scope="scope" >
                            {{ scope.row.uid }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="我方订单号" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.order }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="第三方订单号" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.payOrder }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="购买详情" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.desc }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付方式" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.payMname }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="宝箱价格(元)" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.original }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="实际支付(元)" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.price }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="状态" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.statusStr }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="客户端付款状态" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.pmName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="购买时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.timeStr }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="100">
                        <template slot-scope="{row,$index}">
                            <el-button type="primary" size="mini" @click="handleBudan(row)" v-if="row.status != 0 && row.status != 3 ">
                                补分
                            </el-button>
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
            :visible.sync="dialogVisible"
            title="补单"
            width="800px">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left"  >
                <el-form-item label="UID" >
                    {{ currentData.uid }}
                </el-form-item>
                <el-form-item label="订单号">
                    {{ currentData.order }}
                </el-form-item>
                <el-form-item label="实际付款金额">
                    <el-input v-model="currentData.price" placeholder="实际付款金额"/>
                </el-form-item>
                <el-form-item label="请选择支付渠道">
                    <el-select
                        v-model="currentData.payMid"
                        placeholder="请选择支付方式"
                        popper-class="role-select-dropdown"
                        size="medium"
                        style="width: 200px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in payMethods"
                            :key="item.mid"
                            :label="item.name"
                            :value="item.mid">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="remark" placeholder="说明"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="budan">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'
    import UploadImg from '@/components/UploadImg'
    import DateRangeUnlink from '@/components/Date/DateRangeUnlink'


    import { deepClone } from '@/utils'
    import pay from '@/api/pay/pay'
    import box from '@/api/pyq/box'
    import game from '@/api/hallgame/game'
    import channel from '@/api/app/channel'
    import app from '@/api/app/app'
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
                dialogVisible:false,

                searchUid : '',
                searchChannel: '',
                searchPn:'',
                searchGame: '',
                searchSystem:'all',
                searchOrder:'',
                searchBeginBox:'',
                searchEndBox:'',
                searchPayMethod:'',
                searchStatus:'-1',
                searchTime :[moment().subtract(7, "days").format("YYYY-MM-DD")
                    ,moment().format("YYYY-MM-DD")],

                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                selectData: {}, // 当前选中的信息
                currentData:{},
                payMethods:[],
                gameInfos:[],
                channelInfos:[],
                appInfos:[],
                flag:0,
                remark:''
            }
        },
        computed: {
            payMethodMap () {
                if (this.payMethods.length > 0) {
                    const payMethodMap = new Map()
                    for (const payMethod of this.payMethods) {
                        payMethodMap.set(payMethod.mid, payMethod.name)
                    }
                    return payMethodMap
                }
            }

        },
        watch: {
            'searchGame' (newValue, oldValue) {
                if (newValue) {
                    this.getGameToChannel(newValue)
                    this.getApps(newValue, "")
                }
            },

            'searchChannel' (newValue, oldValue) {
                if (newValue) {
                    this.getApps(this.searchGame, newValue)
                }
            },

        },
        created () {
            this.getPayLogPage()
            this.getPayMethods()
            this.getLimitGames()
            this.getLimitChannels()
        },

        methods: {
            async getPayLogPage () {
                const self = this
                self.listLoading = true

                const beginDate = self.searchTime[0]
                const endDate =  self.searchTime[1]

                pay.getPayLogPage(self.currentPage, self.pageSize, self.searchUid, beginDate, endDate, self.searchGame,
                self.searchChannel, self.searchPn, self.searchSystem, self.searchOrder, self.searchBeginBox, self.searchEndBox,
                self.searchPayMethod, self.searchStatus).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getPayMethods() {
                const res = await box.getPayMethod()
                this.payMethods = res.data
            },

            async getLimitGames () {
                const res = await game.getLimitGames()
                this.gameInfos = res.data
            },

            async getLimitChannels () {
                const res = await channel.getLimitChannels()
                this.channelInfos = res.data
            },

            async getGameToChannel (gameId) {
                const res = await channel.getGameToChannel(gameId)
                this.channelInfos = res.data
                if (this.channelInfos && this.channelInfos.length > 0) {
                    this.searchChannel = this.channelInfos[0].channelId
                } else {
                    this.searchChannel = ''
                }
            },

            async getApps (gameId, channelId) {
                const res = await app.getApps(gameId, channelId)
                this.appInfos = res.data
                if (this.apps && this.apps.length > 0) {
                    this.searchPn = this.apps[0].pn
                } else {
                    this.searchPn = ''
                }
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
                    this.getPayLogPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getPayLogPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getPayLogPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getPayLogPage()
            },

            handleBudan(row) {
                this.currentData = row
                this.dialogVisible = true
            },

            budan (){
                const self = this

                if (self.flag == 0) {
                    self.flag = 1
                    if (!self.currentData.price) {
                        self.$message({
                            type: 'error',
                            message: '输入的实际付款金额错误，请重新输入!'
                        })
                        return
                    }

                    let form = new FormData()
                    form.append('flag', self.flag)
                    form.append('myOrder', self.currentData.order)
                    form.append('showPrice', self.currentData.price)
                    form.append('budanMid', self.currentData.payMid)
                    form.append('midName', self.payMethodMap.get(self.currentData.payMid))
                    form.append('desc', self.remark)

                    pay.budan(form).then(result => {
                        self.flag = 0
                        if (result.data.ret == 0) {
                            self.$message({
                                type: 'success',
                                message: result.data.msg
                            })
                            self.currentData = {}
                            self.dialogVisible = false
                            self.remark = ""

                            self.getPayLogPage()
                        } else {
                            self.$message({
                                type: 'error',
                                message: result.data.msg
                            })
                        }
                    }, error => {
                        self.flag = 0
                    })
                } else{
                    self.$message({
                        type: 'info',
                        message: '正在补单中!'
                    })
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
