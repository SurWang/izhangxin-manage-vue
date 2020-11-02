<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getThmPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">

                    <el-form-item class="filter-form-item" label="特惠码">
                        <el-input size="small"
                                  v-model="searchThm"
                                  placeholder="特惠码"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getThmPage">
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

                    <el-table-column align="center" label="UID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.wd_spread_uid }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="账号" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.account }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="昵称" width="200">
                        <template slot-scope="scope" >
                            {{ scope.row.nickName }}
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
                searchThm : '',

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
        },

        methods: {
            async getThmPage () {
                const self = this
                if (!self.searchThm) {
                    self.$message({
                        type: 'error',
                        message: '请输入特惠码!'
                    })
                    return
                }

                self.listLoading = true

                account.getThmPage(self.currentPage, self.pageSize, self.searchThm).then(result => {
                    if (result.data) {
                        self.listLoading = false
                        self.tableDates = result.data.rows
                        self.listTotal = result.data.total
                    } else {
                        self.listLoading = false
                        self.tableDates = []
                        self.listTotal = 0
                    }

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

            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
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
                    this.getThmPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getThmPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getThmPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getThmPage()
            },
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
</style>
