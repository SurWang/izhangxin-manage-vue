<template>
    <div class="x-table-container">
        <div class="x-table-tools">
            <slot name="tools"/>
        </div>

        <div class="x-table-main">
            <el-table
                class="x-table-class"
                :data="data"
                v-bind="Object.assign({}, DEFAULT_TABLE_ATTR, $attrs)"
                v-on="$listeners"
            >
                <slot></slot>
            </el-table>
        </div>


        <div class="x-table-footer">
            <pagination
                v-show="total > 0"
                :total="total"
                :page-sizes="[20, 30, 50]"
                :page.sync="currentPage" :limit.sync="pageSize" @pagination="loadData">

            </pagination>
        </div>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    export default {
        name: "XTable",
        components: {
            Pagination
        },

        props: {
            url: String,
            initLoad: {
                type: Boolean,
                default: true
            },
            params: Object,
            // 返回{list, total}
            responseHandler: {
                type: Function,
                default: (res) => {
                    if (res && res.data.list && res.data.total) {
                        return {
                            list: res.data.list,
                            total: res.data.total
                        }
                    }
                    console.warn('x-table can\'t resolve data')
                    return {
                        list: [],
                        total: 0
                    }
                }
            }
        },

        created() {
            if (this.initLoad) {
                this.loadData(this.params)
            }
        },

        data() {
            return {
                DEFAULT_TABLE_ATTR: {
                    border: true,
                    fit: true,
                    height: "100%",
                    'v-loading': false,
                    'highlight-current-row': true,
                },

                data:[],
                total: 0,
                currentPage: 1,
                pageSize: 20,
                loading: false
            }
        },

        methods: {
            loadData(param) {
                if (!this.url) {
                    console.error('url param error')
                    return
                }
                let queryParam = Object.assign({}, this.params, param)

                queryParam.page = this.currentPage
                queryParam.size = this.pageSize


                this.loading = true

                this.$ajax.get(this.url, {
                    params: queryParam
                }).then(res => {
                    this.loading = false
                    let response = this.responseHandler(res)
                    if (!response || !response.list || response.total === undefined) {
                        console.error('response handler need return {list: Array, total: Number}')
                        return
                    }
                    this.data = response.list
                    this.total = response.total
                }).catch(res => {
                    this.loading = false
                    this.data = []
                })
            }
        }
    }
</script>
