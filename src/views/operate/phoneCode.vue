<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getPhoneCodePage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="用户UID">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="用户UID"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getPhoneCodePage">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="手机号">
                        <el-input size="small"
                                  v-model="searchPhone"
                                  placeholder="手机号"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getPhoneCodePage">
                        </el-input>
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

                    <el-table-column align="center" label="UID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pid }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手机号码" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.phone }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="验证码" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.code }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="验证状态" width="200">
                        <template slot-scope="scope" >
                            {{ formatMsg(scope.row.msg) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="日期" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.timeStr }}
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
    import phone from '@/api/operate/phone'
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
                searchPhone : '',
                searchTime : [],

                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                selectData: {}, // 当前选中的信息

            }
        },
        computed: {

        },
        watch: {

        },
        created () {
            this.getPhoneCodePage()
            //this.getAppInfos()
        },

        methods: {
            async getPhoneCodePage () {
                const self = this
                self.listLoading = true
                let beginDate = ""
                let endDate =  ""
                debugger
                if (self.searchTime && self.searchTime.length > 0) {
                    beginDate = self.searchTime[0]
                    if (self.searchTime.length > 1) {
                        endDate =  self.searchTime[1]
                    }
                }
                phone.getPhoneCodePage(self.currentPage, self.pageSize, self.searchUid,self.searchPhone, beginDate, endDate).then(result => {
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
                this.getPhoneCodePage()
            },


            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function (flag) {
                // 当关闭面板时查询数据
                if (!flag) {
                    this.getPhoneCodePage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getPhoneCodePage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getPhoneCodePage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getPhoneCodePage()
            },

            formatMsg(value){
                if(value == "1" || value =="DELIVRD"){
                    return "成功";
                }else if(value == ""){
                    return "未知";
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
