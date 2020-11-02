<template>
    <div class="app-container manage-container" >
        <filter-container
            @submit-form="getClubVipConfigPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="俱乐部等级">
                        <el-input size="small"
                                  v-model="searchLevel"
                                  placeholder="vip等级"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
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
                    border
                    height="100%"
                    fit
                    highlight-current-row
                    :data="tableDatas"
                    @row-click="handleSelectChange"
                >
                    <el-table-column align="center" label="俱乐部等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.clubLevel }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="权限参数" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.priviParam }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="权限名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.priviName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="权限描述" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.priviDesc }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="gameDialogVisible"
            :title="currentDialogType===dialogType.EDIT?'编辑':'新增'"
            width="600px"
        >
            <el-form :model="currentData" label-width="120px" label-position="left">

                <el-form-item label="等级">
                    <el-input v-model="currentData.clubLevel" placeholder="等级"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>
                <el-form-item label="权限">
                    <el-select
                        v-model="currentData.priviId"
                        placeholder="请选择权限"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        >
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in privis"
                            :key="item.priviId"
                            :label="item.priviName"
                            :value="item.priviId">
                            {{ item.priviName }}
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="权限参数">
                    <el-input v-model="currentData.priviParam" placeholder="权限参数"/>
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
    import clubVip from '@/api/pyq/clubVip'
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
                listLoading1: false,
                isUpdateGame: false,
                isShowFilterPanel: false,

                filterQuery: Object.assign({}, defaultFilterQuery),
                filterGameName: '',
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,
                searchLevel:'',

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                privis:[],

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
            this.getClubVipConfigPage()
            this.getPrivis();
        },

        methods: {

            async getClubVipConfigPage () {
                const self = this
                self.listLoading = true
                clubVip.getClubVipConfigPage(self.currentPage, self.pageSize, self.searchLevel).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getPrivis() {
                const res = await clubVip.getClubVipList()
                this.privis = res.data
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
                if (!self.currentData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
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
                if (!self.currentData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.currentData.priviName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    clubVip.deleteItem(self.currentData.autoId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        self.tableDatas = self.tableDatas.filter(item => {
                            return item.autoId != self.currentData.autoId
                        })
                        self.selectData= Object.assign({}, defaultGame)
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
                let fd = new FormData();
                fd.append('clubAutoId', self.currentData.autoId);
                fd.append('privi', self.currentData.priviId);
                fd.append('param0', self.currentData.priviParam);
                fd.append('level', self.currentData.clubLevel);

                clubVip.putConfigItem(fd).then(result => {
                    self.gameDialogVisible = false
                    self.selectData = deepClone(self.currentData)
                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                    self.getClubVipConfigPage()
                }).catch((error) => {

                })
            },
            add () {
                const self = this
                let fd = new FormData();
                fd.append('privi', self.currentData.priviId);
                fd.append('param0', self.currentData.priviParam);
                fd.append('level', self.currentData.clubLevel);

                clubVip.addConfigItem(fd).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增信息成功'
                    })
                    self.getClubVipConfigPage()
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
                    this.getClubVipPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getClubVipPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getClubVipPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getClubVipPage()
            },
            handleClick(tab, event) {
                if (tab.index == 0) {
                    this.getClubVipPage()
                } else {
                    this.getClubVipConfigPage()
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
