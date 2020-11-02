<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getGiftKeyPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="礼包名称">
                        <el-select
                            size="small"
                            v-model="searchGpId"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in gpList"
                                :key="item.gpId"
                                :label="item.gpName"
                                :value="item.gpId">
                                {{ item.gpName }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="兑换码">
                        <el-input size="small"
                                  v-model="searchKey"
                                  placeholder="兑换码"
                                  style="width: 200px;"
                                  clearable
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="状态">
                        <el-select
                            size="small"
                            v-model="searchStatus"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" value="0" label="未用">未用</el-option>
                            <el-option class="role-select-dropdown__item" value="1" label="已用">已用</el-option>
                            <el-option class="role-select-dropdown__item" value="2" label="已删除">已删除</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </template>
        </filter-container>

        <operate-container>
            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDel">
                删除激活码
            </el-button>
        </operate-container>

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

                    <el-table-column align="center" label="批次" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gkGpId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="礼包名称" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gpName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="礼包介绍" width="200">
                        <template slot-scope="scope">
                            {{ formatRemark(scope.row.tools, scope.row) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="激活码" width="100">
                        <template slot-scope="scope" >
                            {{ scope.row.gkKey }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="有效期" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gkValidTimeStr }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="创建时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gkAddTimeStr }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="激活时间" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gkUseTimeStr }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="激活账号" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.gkUid }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="领用情况" width="100">
                        <template slot-scope="scope">
                            {{ formatStatus(scope.row.gkStatus) }}
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
    import kefu from '@/api/kefu/kefu'
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
                searchGpId : '',
                searchKey : '',
                searchStatus : '0',

                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                tableDates: [],
                gpList : [],

                selectData: {}, // 当前选中的信息
                currentData:{},

            }
        },
        computed: {

        },
        watch: {

        },
        created () {
            this.getGiftKeyPage()
            this.getAllGift()
        },

        methods: {
            async getGiftKeyPage() {
                const self = this
                self.listLoading = true

                kefu.getGiftKeyPage(self.currentPage, self.pageSize, self.searchGpId,
                    self.searchKey, self.searchStatus).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getAllGift() {
                const res = await kefu.getAllGift()
                this.gpList = res.data.gpList
            },

            handleSelectChange(row) {
                const self = this
                self.selectData = deepClone(row)
            },

            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
            },

            handleAddGoods() {
                this.currentData = deepClone(Object.assign({}, defaultData))

                this.currentDialogType = this.dialogType.NEW
                this.dialogVisible = true
            },

            resetQueryParam() {
                this.getGiftKeyPage()
            },

            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function (flag) {
                // 当关闭面板时查询数据
                if (!flag) {
                    this.getGiftKeyPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination(params) {
                this.getGiftKeyPage()
            },

            handleSizeChange(pageSize) {
                this.pageSize = pageSize
                this.getGiftKeyPage()
            },

            handleCurrentChange(page) {
                this.currentPage = page
                this.getGiftKeyPage()
            },

            formatStatus(value) {
                if (value == 0) {
                    return "未用";
                } else if (value == 1) {
                    return "已用";
                } else if (value == 2) {
                    return "礼包已删除";
                }
                return "";
            },

            formatRemark(value, rowData) {
                let text = ""
                const arr = eval(value);
                arr.forEach(item => {
                    text += item.tolnum + item.tolname + "+";
                })
                if (rowData.gpHaHouseCard > 0) {
                    text += rowData.gpHaHouseCard + "红安专用房卡+";
                }
                if (rowData.gpChHouseCard > 0) {
                    text += rowData.gpChHouseCard + "巢湖专用房卡+";
                }
                text = text.substring(0, text.length - 1);
                return text
            },

            /**
             * 删除
             * @param $index
             * @param row
             */
            handleDel () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.gkKey) {
                    self.$message({
                        type: 'error',
                        message: '请选择激活码!'
                    })
                    return
                }

                self.$confirm(`确认删除激活码“${self.currentData.gkKey}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    kefu.deleteGiftKey(self.currentData.gkKey).then(result => {
                        self.$message({
                            type: 'success',
                            message: '激活码删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.gkKey != self.currentData.gkKey
                        })
                        self.selectData= {}
                    }, result => {
                    })

                }).catch(err => {
                })
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
