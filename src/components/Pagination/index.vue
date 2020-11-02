<template>
    <div :class="{'hidden':hidden}" class="pagination-container">
        <el-pagination
            class="hr-pagination"
            :background="background && !$isMobile"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :layout="layout"
            :page-sizes="pageSizes"
            :total="total"
            v-bind="$attrs"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
    import { scrollTo } from '@/utils/scroll-to'

    export default {
        name: 'Pagination',
        props: {
            total: {
                required: true,
                type: Number
            },
            page: {
                type: Number,
                default: 1
            },
            limit: {
                type: Number,
                default: 20
            },
            pageSizes: {
                type: Array,
                default () {
                    return [10, 20, 30, 50]
                }
            },
            layout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper'
            },
            background: {
                type: Boolean,
                default: true
            },
            autoScroll: {
                type: Boolean,
                default: true
            },
            hidden: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            currentPage: {
                get () {
                    return this.page
                },
                set (val) {
                    this.$emit('update:page', val)
                }
            },
            pageSize: {
                get () {
                    return this.limit
                },
                set (val) {
                    this.$emit('update:limit', val)
                }
            }
        },
        methods: {
            handleSizeChange (val) {
                this.$emit('pagination', { page: this.currentPage, limit: val })
                if (this.autoScroll) {
                    scrollTo(0, 800)
                }
            },
            handleCurrentChange (val) {
                this.$emit('pagination', { page: val, limit: this.pageSize })
                if (this.autoScroll) {
                    scrollTo(0, 800)
                }
            }
        }
    }
</script>

<style scoped>
    .pagination-container {
        background: #fff;
    }

    .pagination-container.hidden {
        display: none;
    }

    @media only screen and (max-width:1024px) {
        /** 分页器 **/
        .hr-pagination {
            display: flex;
        }
        .hr-pagination >>> .btn-prev,
        .hr-pagination >>> .btn-next {
            flex-shrink: 0;
        }
        .hr-pagination >>> .el-pager {
            flex: auto;
            width: 0;
            overflow-y: auto;
        }
    }

    @media only screen and (max-width:1024px) and (orientation : portrait) {
        .hr-pagination >>> .el-pagination__total,
        .hr-pagination >>> .el-pagination__sizes,
        .hr-pagination >>> .el-pagination__jump {
            display: none!important;
        }
        .hr-pagination >>> .el-pagination__jump {
            margin-left: 0;
        }
    }
</style>
