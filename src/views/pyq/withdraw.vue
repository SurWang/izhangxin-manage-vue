<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getWithdrawConfigPage"
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
                            {{ scope.row.pn }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="取现所需最小金额" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.min_money_cond / scope.row.coin_cash_ratio }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="最大额度" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.daily_max_limit / scope.row.coin_cash_ratio }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="手续费" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.service_charge }}
                        </template>
                    </el-table-column>

                    <!--<el-table-column align="center" label="第三方服务费" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.third_service_charge }}
                        </template>
                    </el-table-column>-->

                    <el-table-column align="center" label="每日取现次数" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.daily_withdrawal_times }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="比率" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.coin_cash_ratio }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="时间区间设置" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.withdrawal_time_range }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="预留金额数目" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.reserve_num / scope.row.coin_cash_ratio }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="至少取现金额" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.min_withdraw_every / scope.row.coin_cash_ratio }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="状态" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.status == 1 ? "可用" : "不可用" }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="记录时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.uptime | formatDate }}
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
            <el-form :model="currentData" label-width="140px" label-position="left"
                     ref="ruleForm" :rules="rules">

                <el-form-item label="选择pn" prop="pn">
                    <el-select
                        v-model="currentData.pn"
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
                <el-form-item label="最小金额" prop="min_money_cond">
                    <el-input v-model="currentData.min_money_cond" placeholder="取现所需最小的游戏币金额门槛"
                              onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="最大额度" prop="daily_max_limit">
                    <el-input v-model="currentData.daily_max_limit" placeholder="每日取现的最大额度"
                              onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="手续费" prop="service_charge">
                    <el-input v-model="currentData.service_charge" placeholder="我方取现的手续费千分值（值为20表示手续费为20/1000=2%）"
                              onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="每日取现次数" prop="daily_withdrawal_times">
                    <el-input v-model="currentData.daily_withdrawal_times" placeholder="每日取现次数"
                              onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="比率(游戏币/现金)" prop="coin_cash_ratio">
                    <el-input v-model="currentData.coin_cash_ratio" placeholder="游戏币和现金的比率（游戏币/现金）"
                              onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="时间区间">
                    <!--<el-input v-model="currentData.withdrawal_time_range" placeholder="时间区间"/>-->
                    <el-time-picker
                        is-range
                        value-format="HH:mm"
                        format="HH:mm"
                        v-model="timeRange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="预留金额数目" prop="reserve_num">
                    <el-input v-model="currentData.reserve_num" placeholder="需要预留的取现金额数目"
                              onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="至少取现金额" prop="min_withdraw_every">
                    <el-input v-model="currentData.min_withdraw_every" placeholder="每次至少要取现的金额"
                              onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="currentData.status"
                        placeholder="状态"
                        popper-class="role-select-dropdown"
                        style="width: 93%;"
                    >
                        <el-option value="1" label="可用">可用</el-option>
                        <el-option value="0" label="不可用">不可用</el-option>
                    </el-select>
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
    import withdraw from '@/api/pyq/withdraw'
    import app from '@/api/app/app'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
    }

    const defaultGame = {
        status : '1',
        pn:'-1'
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
                rules: {
                    pn : [
                        { required: true, message: '请输入pn', trigger: 'change' }
                    ],
                    min_money_cond : [
                        { required: true, message: '请输入最小金额', trigger: 'blur' }
                    ],
                    daily_max_limit : [
                        { required: true, message: '请输入最大金额', trigger: 'blur' }
                    ],
                    service_charge : [
                        { required: true, message: '请输入手续费', trigger: 'blur' }
                    ],
                    min_withdraw_every : [
                        { required: true, message: '请输入至少取现金额', trigger: 'blur' }
                    ],
                    daily_withdrawal_times : [
                        { required: true, message: '请输入每日取现次数', trigger: 'blur' }
                    ],
                    coin_cash_ratio : [
                        { required: true, message: '请输入比率', trigger: 'blur' }
                    ],
                    reserve_num : [
                        { required: true, message: '请输入预留金额数目', trigger: 'blur' }
                    ],
                },
                timeRange: [new Date(2016, 9, 10, 0, 0, 0), new Date(2016, 9, 10, 23, 59, 59)],
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
            this.getWithdrawConfigPage()
            this.getApps();
        },

        methods: {
            async getWithdrawConfigPage () {
                const self = this
                self.listLoading = true
                withdraw.getWithdrawConfigPage(self.currentPage, self.pageSize, self.searchPn).then(result => {
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
                this.apps.unshift({pn:'-1',aiName:'通用'});
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
                if (!self.currentData.id) {
                    self.$message({
                        type: 'error',
                        message: '请选择数据!'
                    })
                    return
                }

                if (!self.currentData.withdrawal_time_range) {
                    self.timeRange = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
                } else {
                    self.timeRange = self.currentData.withdrawal_time_range.split("-")
                }
                // 重置保存状态
                self.$set(self.currentData, 'min_money_cond', self.currentData.min_money_cond / self.currentData.coin_cash_ratio)
                self.$set(self.currentData, 'daily_max_limit', self.currentData.daily_max_limit / self.currentData.coin_cash_ratio)
                self.$set(self.currentData, 'reserve_num', self.currentData.reserve_num / self.currentData.coin_cash_ratio)
                self.$set(self.currentData, 'min_withdraw_every', self.currentData.min_withdraw_every / self.currentData.coin_cash_ratio)

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
                if (!self.currentData.id) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.currentData.pn}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append("id", self.currentData.id)
                    withdraw.deleteWithdrawConfig(form).then(result => {
                        if (result.data.ret == 1) {
                            self.$message({
                                type: 'success',
                                message: result.data.desc
                            })
                            self.selectData= Object.assign({}, defaultGame)
                            self.getWithdrawConfigPage()
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
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        if (isEdit) {
                            this.update()
                        } else {
                            this.add()
                        }
                    } else {
                        return false;
                    }
                });
            },
            update () {
                const self = this

                if (!self.timeRange) {
                    self.$set(self.currentData, 'withdrawal_time_range', "")
                } else {
                    self.$set(self.currentData, 'withdrawal_time_range', self.timeRange[0] + "-" + self.timeRange[1])
                }

                let form = new FormData()
                form.append('id',self.currentData.id)
                form.append('pn',self.currentData.pn)
                form.append('min_money_cond', self.currentData.min_money_cond)
                form.append('daily_max_limit', self.currentData.daily_max_limit)
                form.append('service_charge', self.currentData.service_charge)
                form.append('daily_withdrawal_times', self.currentData.daily_withdrawal_times)
                form.append('coin_cash_ratio', self.currentData.coin_cash_ratio)
                form.append('withdrawal_time_range', self.currentData.withdrawal_time_range)
                form.append('reserve_num', self.currentData.reserve_num)
                form.append('min_withdraw_every', self.currentData.min_withdraw_every)
                form.append('status', self.currentData.status)

                withdraw.updateWithDrawConfig(form).then(result => {
                    if (result.data.ret > 0) {
                        self.gameDialogVisible = false
                        self.selectData = deepClone(self.currentData)
                        self.$message({
                            type: 'success',
                            message: '修改信息成功'
                        })
                        self.getWithdrawConfigPage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: '修改信息失败'
                        })
                    }

                }).catch((error) => {

                })
            },
            add () {
                const self = this

                if (!self.timeRange) {
                    self.$set(self.currentData, 'withdrawal_time_range', "")
                } else {
                    self.$set(self.currentData, 'withdrawal_time_range', self.timeRange[0] + "-" + self.timeRange[1])
                }

                let form = new FormData()
                form.append('pn',self.currentData.pn)
                form.append('min_money_cond', self.currentData.min_money_cond)
                form.append('daily_max_limit', self.currentData.daily_max_limit)
                form.append('service_charge', self.currentData.service_charge)
                form.append('daily_withdrawal_times', self.currentData.daily_withdrawal_times)
                form.append('coin_cash_ratio', self.currentData.coin_cash_ratio)
                form.append('withdrawal_time_range', self.currentData.withdrawal_time_range)
                form.append('reserve_num', self.currentData.reserve_num)
                form.append('min_withdraw_every', self.currentData.min_withdraw_every)

                form.append('status', self.currentData.status)

                withdraw.insertWithDrawConfig(form).then(result => {
                    if (result.data.ret > 0) {
                        self.gameDialogVisible = false
                        self.$message({
                            type: 'success',
                            message: '新增信息成功'
                        })
                        self.getWithdrawConfigPage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: '新增信息失败, 请检查参数是否已存在'
                        })
                    }
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
                    this.getWithdrawConfigPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getWithdrawConfigPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getWithdrawConfigPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getWithdrawConfigPage()
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
