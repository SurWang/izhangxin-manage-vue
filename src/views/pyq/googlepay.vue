<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getGooglepayPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="渠道">
                        <el-select
                            size="small"
                            v-model="searchPn"
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in apps"
                                :key="item.pn"
                                :label="item.aiName"
                                :value="item.pn">
                                {{ item.aiName }}
                            </el-option>
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
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit">
                修改
            </el-button>

            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDel">
                删除
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
                    <el-table-column align="center" label="pn" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.giPn }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="clent_id" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.giClientId }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="client_secret" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.giClientSecret }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="refresh_token" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.giRefreshToken }}
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

                <el-form-item label="选择pn">
                    <el-select
                        v-model="currentData.giPn"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in apps"
                            :key="item.pn"
                            :label="item.aiName"
                            :value="item.pn">
                            {{ item.aiName }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="client_id">
                    <el-input v-model="currentData.giClientId" placeholder="client_id"/>
                </el-form-item>
                <el-form-item label="refresh_token">
                    <el-input v-model="currentData.giRefreshToken" placeholder="refresh_token"/>
                </el-form-item>
                <el-form-item label="client_secret">
                    <el-input v-model="currentData.giClientSecret" placeholder="client_secret"/>
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
    import googlepay from '@/api/pyq/googlepay'
    import app from '@/api/app/app'

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
            Pagination
        },
        data () {
            return {
                listLoading: false,
                isUpdateGame: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,

                filterQuery: Object.assign({}, defaultFilterQuery),
                filterGameName: '',
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchPn:'',

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                apps:[],
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
            this.getGooglepayPage()
            this.getApps();
        },

        methods: {
            async getGooglepayPage () {
                const self = this
                self.listLoading = true
                googlepay.getGooglepayPage(self.currentPage, self.pageSize, self.searchPn).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getApps () {
                const res = await app.getApps("", "")
                this.apps = res.data
                this.apps.unshift({pn:'all',aiName:'通用'});
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
                if (!self.currentData.giPn) {
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
                if (!self.currentData.giPn) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.currentData.giPn}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append("pn", self.currentData.giPn)
                    googlepay.deleteGooglepay(form).then(result => {
                        if (result.data.ret == 1) {
                            self.$message({
                                type: 'success',
                                message: result.data.desc
                            })
                            self.selectData= Object.assign({}, defaultGame)
                            self.getGooglepayPage()
                        } else {
                            self.$message({
                                type: 'error',
                                message: result.data.desc
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
                form.append('flag', self.selectData.giPn)
                form.append('pnSS', self.selectData.giPn)
                form.append('pnS',self.currentData.giPn)
                form.append('clientIdS', self.currentData.giClientId)
                form.append('refreshTokenS', self.currentData.giRefreshToken)
                form.append('clientSecretS', self.currentData.giClientSecret)


                googlepay.putItem(form).then(result => {
                    self.gameDialogVisible = false
                    for (let index = 0; index < this.tableDatas.length; index++) {
                        if (this.tableDatas[index].giPn === this.currentData.giPn) {
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
                form.append('flag', "")
                form.append('pnSS', "")
                form.append('pnS',self.currentData.giPn)
                form.append('clientIdS', self.currentData.giClientId)
                form.append('refreshTokenS', self.currentData.giRefreshToken)
                form.append('clientSecretS', self.currentData.giClientSecret)

                googlepay.addItem(form).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getGooglepayPage()
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
                    this.getGooglepayPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getGooglepayPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getGooglepayPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getGooglepayPage()
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
