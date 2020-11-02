<template>
    <!--搜索区域-->
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getLoginLog"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    @submit.native.prevent
                    :inline="true"
                    label-width="6em"
                    class="filter-form">
                    <el-form-item class="filter-form-item" label="用户名">
                        <el-input
                            style="width: 200px"
                            size="small"
                            placeholder="请输入搜索内容"
                            v-model="searchByName"
                            clearable
                            @keydown.enter.native="getLoginLog"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
            </template>
        </filter-container>

        <div class="manage-main">
            <div class="manage-main-body">
                <!--内容区域-->
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    v-loading="listLoading"
                    border
                    fit
                    height="100%"
                    highlight-current-row
                    :data="logs"
                    >
                    <el-table-column
                            label="用户ID"
                            align="center"
                            width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userId }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="用户名"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userName  }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="登录IP"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.loginIp}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="登录时间"
                        align="center"
                        width="350">
                        <template slot-scope="scope">
                            <span>{{(scope.row.loginDate) | formatDate }}</span>
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
    import Pagination from '@/components/Pagination'
    import FilterContainer from '@/components/FilterContainer'

    import moment from 'moment'
    import role from '../../api/system/role'

    export default {
        name: 'loginLog',
        components: {
            Pagination,
            FilterContainer
        },

        data () {
            return {
                isShowMoreSearch: false, // 是否展示更多搜索按钮
                isOpenSearch: false, // 是否展开更多搜索
                listLoading: false, // 列表加载loading
                isShowFilterPanel: false, // 是否显示filter面板，只在mobile端有效

                logs: [], // 查询出来的日志
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchByName: '', // 根据姓名搜索
            }
        },
        computed: {

        },
        created () {
            const self = this
            self.getLoginLog()
            window.addEventListener('resize', self.handleResize)
        },
        mounted () {
            this.handleResize()
        },
        methods: {

            getLoginLog () {
                const self = this
                self.listLoading = true
                role.getLoginLog(self.currentPage, self.pageSize, self.searchByName).then(result => {
                    self.listLoading = false
                    self.logs = result.data.items
                    self.listTotal = result.data.totalNumber
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.logs = []
                })
            },

            handlePagination (params) {
                this.getLoginLog()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getLoginLog()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getLoginLog()
            },

            handleResize: function () {
                const filterFormEle = document.querySelector('.filter-form')
                if (!filterFormEle) {
                    return
                }
                const searchFormWidth = filterFormEle.offsetWidth
                let searchFormItemAllWidth = 0
                const searchFormItemEles = document.querySelectorAll('.filter-form-item')
                if (searchFormItemEles && searchFormItemEles.length > 0) {
                    for (const tempEle of searchFormItemEles) {
                        searchFormItemAllWidth += tempEle.offsetWidth
                    }
                    this.isShowMoreSearch = searchFormItemAllWidth > searchFormWidth
                } else {
                    this.isShowMoreSearch = false
                }
            },
            handleOpenMoreSearchClick: function () {
                this.isOpenSearch = !this.isOpenSearch
            },
            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function (flag) {
                if (!flag) {
                    this.getLoginLog()
                }
            },
            resetQueryParam () {
                this.searchByName = ''
                this.getLoginLog()
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

<style scoped>
    .data-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .filter-container {
        flex-shrink: 0;
    }

    .data-panel-main {
        display: flex;
        flex: auto;
        flex-direction: column;
        height: 0;
    }

    .data-panel-main-body {
        flex: auto;
        height: 0;
    }

    .data-panel-main-footer {
        flex-shrink: 0;
        padding: 4px 12px;
    }

    .data-panel-content {
        display: inline-block;
        min-width: 100%;
    }

    .data-panel-table >>> .cell {
        line-height: 28px;
    }

    .data-panel-table >>> th {
        background-color: #fafafa;
        font-weight: normal;
        color: rgba(0, 0, 0, .85);
    }

    .data-panel-table__tag {
        margin: 2px 4px 2px 0;
        font-size: 14px;
    }

    .data-panel-table__button {
        font-size: 14px;
    }

    .data-panel-pagination {
        padding: 0;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 5px;
        font-size: 16px;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
    }
</style>
