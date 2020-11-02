<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getRegLimitPage"
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
                            v-model="searchGameId"
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in games"
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
                                v-for="item in channels"
                                :key="item.channelId"
                                :label="item.channelName"
                                :value="item.channelId">
                                {{ item.channelName }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="是否允许注册">
                        <el-select
                            size="small"
                            v-model="searchStatus"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" value="-1" label="全部">全部</el-option>
                            <el-option class="role-select-dropdown__item" value="0" label="允许">允许</el-option>
                            <el-option class="role-select-dropdown__item" value="1" label="不允许">不允许</el-option>
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
                type="danger"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit">
                修改
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

                    <el-table-column align="center" label="游戏名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.irGameName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="渠道" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.irChannelName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pnName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="评论地址" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.irEvaurl }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="是否允许注册" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.irStatus == 0 ? "允许" : "不允许" }}
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
            :title="currentDialogType===dialogType.EDIT?'编辑':'新增'"
            width="800px"
            :before-close="handleBeforeCloseEdit"
            @close="handleClose">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left" :rules="rules">

                <el-form-item label="游戏" prop="irGameId">
                    <el-select
                        v-model="currentData.irGameId"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in games"
                            :key="item.gameId"
                            :label="item.gameName"
                            :value="item.gameId">
                            {{ item.gameName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="渠道" prop="irChannelId">
                    <el-select
                        v-model="currentData.irChannelId"
                        placeholder="请选择渠道"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in channels"
                            :key="item.channelId"
                            :label="item.channelName"
                            :value="item.channelId">
                            {{ item.channelName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="应用" prop="pn">
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

                <el-form-item label="评论地址" >
                    <el-input v-model="currentData.irEvaurl" placeholder="评论地址" />
                </el-form-item>
                <el-form-item label="是否允许注册" >
                    <el-radio-group v-model="currentData.irStatus">
                        <el-radio :label="0">允许</el-radio>
                        <el-radio :label="1">不允许</el-radio>
                    </el-radio-group>

                </el-form-item>
            </el-form>

            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="confirm">保存</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'
    import UploadImg from '@/components/UploadImg'


    import { deepClone } from '@/utils'
    import regLimit from '@/api/operate/regLimit'
    import game from '@/api/hallgame/game'
    import channel from '@/api/app/channel'
    import app from '@/api/app/app'

    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        irChannelId:'',
        irGameId:'',
        irStatus : 0
    }

    export default {
        directives: { waves },
        components: {
            Pagination,
            FilterContainer,
            OperateContainer,
            UploadImg
        },
        data () {
            return {
                listLoading: false,
                isUpdate: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,
                searchGameId:'',
                searchChannel:'',
                searchStatus: '-1',
                disabled:false,

                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                currentData: Object.assign({}, defaultData),
                tableDates: [],
                games:[],
                channels:[],
                apps:[],

                dialogVisible: false,
                dialogType: DialogType,

                dialogSubVisible : false,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息

                rules: {
                    irGameId:[
                        { required: true, message: '请输入游戏', trigger: 'change' }
                    ],
                    irChannelId:[
                        { required: true, message: '请输入渠道', trigger: 'change' }
                    ],
                    pn:[
                        { required: true, message: '请输入应用', trigger: 'change' }
                    ]
                }
            }
        },
        computed: {
            isConfirmDisabled () {
                if (this.currentData.goodsName && this.currentData.goodsName.trim().length > 0) {
                    // 渠道名称不为空的时候，在判断用户名是否修改或者是否修改了渠道信息
                    return !(this.isUpdate)
                } else {
                    // 渠道必须要有名称，不可以为空
                    return true
                }
            },

        },
        watch: {
            'currentData.irGameId' (newValue, oldValue) {
                if (newValue) {
                    this.getGameToChannel(newValue)
                    this.getApps(newValue, "")
                }
            },

            'currentData.irChannelId' (newValue, oldValue) {
                if (newValue) {
                    this.getApps(this.currentData.irGameId, newValue)
                }
            },

            'searchGameId' (newValue, oldValue) {
                if (newValue) {
                    this.getGameToChannel(newValue)
                }
            }
        },
        created () {
            this.getRegLimitPage()
            this.getLimitGames()
            this.getLimitChannels()
        },

        methods: {
            async getRegLimitPage () {
                const self = this
                self.listLoading = true
                regLimit.getRegLimitPage(self.currentPage, self.pageSize,self.searchGameId,
                    self.searchChannel,self.searchStatus).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getLimitGames () {
                const res = await game.getLimitGames()
                this.games = res.data
            },

            async getLimitChannels () {
                const res = await channel.getLimitChannels()
                this.channels = res.data
            },

            async getGameToChannel (gameId) {
                const res = await channel.getGameToChannel(gameId)
                this.channels = res.data
                if (this.channels && this.channels.length > 0) {
                    this.$set(this.currentData, 'irChannelId', this.channels[0].channelId)
                } else {
                    this.$set(this.currentData, 'irChannelId', '')
                }
            },

            async getApps (gameId, channelId) {
                const res = await app.getApps(gameId, channelId)
                this.apps = res.data
                if (this.apps && this.apps.length > 0) {
                    this.$set(this.currentData, 'pn', this.apps[0].pn)
                } else {
                    this.$set(this.currentData, 'pn', '')
                }
            },

            handleSelectChange (row) {
                const self = this
                self.selectData = deepClone(row)
            },

            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
            },

            handleAdd () {
                this.currentData = deepClone(Object.assign({}, defaultData))
                this.currentDialogType = this.dialogType.NEW
                this.dialogVisible = true
            },

            handleEdit () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.irId) {
                    self.$message({
                        type: 'error',
                        message: '请选择信息!'
                    })
                    return
                }
                // 重置保存状态
                self.isUpdate = false
                self.currentDialogType = this.dialogType.EDIT
                self.dialogVisible = true
            },

            /**
             * 删除
             * @param $index
             * @param row
             */
            handleDel () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.irId) {
                    self.$message({
                        type: 'error',
                        message: '请选择信息!'
                    })
                    return
                }

                self.$confirm(`确认删除信息“${self.currentData.gpname}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    msg.deleteMsg(self.currentData.gpid).then(result => {
                        self.$message({
                            type: 'success',
                            message: '消息删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.gpid != self.currentData.gpid
                        })
                        self.selectData= {}
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
            add () {
                const self = this
                regLimit.addLimit({
                    'irGameId': self.currentData.irGameId ? self.currentData.irGameId : 0,
                    'irChannelId': self.currentData.irChannelId ? self.currentData.irChannelId : 0 ,
                    'pn': self.currentData.pn ? self.currentData.pn : "",
                    'irEvaurl': self.currentData.irEvaurl ? self.currentData.irEvaurl : "",
                    'irStatus': self.currentData.irStatus ? self.currentData.irStatus : 0
                }).then(result => {
                    self.dialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增成功'
                    })
                    this.getRegLimitPage()
                }).catch(error => {
                })
            },
            update () {
                const self = this
                const { irId, irStatus, irEvaurl} = self.currentData
                regLimit.putLimit({
                    'irId': irId,
                    'irStatus': irStatus,
                    'irEvaurl': irEvaurl
                }).then(result => {
                    self.dialogVisible = false
                    for (let index = 0; index < this.tableDates.length; index++) {
                        if (this.tableDates[index].irId === this.currentData.irId) {
                            this.tableDates.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }
                    self.selectData = deepClone(self.currentData)
                    self.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                }).catch((error) => {
                })
            },
            resetQueryParam () {
                this.getRegLimitPage()
            },

            handleClose () {
                this.goodsImg = ""
            },

            handleBeforeCloseEdit (done) {
                //
                if (this.isUpdate) {
                    this.$confirm('您修改了商品信息，是否需要保存?', '确认', {
                        confirmButtonText: '保存',
                        cancelButtonText: '不保存',
                        type: 'warning'
                    }).then(_ => {
                        // 需要保存
                        this.confirm()
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
                    this.getRegLimitPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getRegLimitPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getRegLimitPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getRegLimitPage()
            },

            parseTmmsg (row) {
                const self= this
                row.status = 1
                msg.parseTmmsg(row.gpid).then(result => {
                    row.status = 1
                    self.$message({
                        type: 'success',
                        message: '暂停成功!'
                    })
                })
            },

            resumeTmmsg(row) {
                const self= this
                row.status = 0
                msg.resumeTmmsg(row.gpid).then(result => {
                    row.status = 0
                    self.$message({
                        type: 'success',
                        message: '恢复成功!'
                    })
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
