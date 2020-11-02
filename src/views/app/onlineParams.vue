<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getOnlineParamsPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item  class="filter-form-item" label="选择游戏">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchGameId
                            :filterable="!$isMobile"
                            placeholder="请选择游戏"
                            clearable
                            >
                            <el-option
                                v-for="item in gameInfos"
                                :key=item.gameId
                                :label="item.gameName"
                                :value=item.gameId>
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="filter-form-item" label="选择渠道">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchChannel
                            :filterable="!$isMobile"
                            placeholder="请选择渠道"
                            clearable
                            >
                            <el-option
                                v-for="item in searchChannelInfos"
                                :key=item.channelId
                                :label="item.channelName"
                                :value=item.channelId>
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="filter-form-item" label="选择应用">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchPn
                            :filterable="!$isMobile"
                            placeholder="请选择应用"
                            clearable
                            >
                            <el-option
                                v-for="item in searchAppInfos"
                                :key=item.pn
                                :label="item.appname"
                                :value=item.pn>
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
                @click="handleAddParams">
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEditParams">
                编辑
            </el-button>

            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelParams">
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
                    fit
                    highlight-current-row
                    height="100%"
                    :data="tableDates"
                    @row-click="handleSelectChange">
                    <el-table-column align="center" label="参数名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.opParamName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="版本号" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.opAppCode }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="参数值" width="500">
                        <template slot-scope="scope">
                            {{ scope.row.opParamValue }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="备注" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.opDesc }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.opTime }}
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
            :title="currentDialogType===dialogType.EDIT?'编辑参数':'新增参数'"
            width="800px"
            :before-close="handleBeforeCloseEdit">
            <el-form ref="ruleForm" :model="currentData" label-width="85px"
                     label-position="left"  :rules="rules">

                <el-form-item label="游戏" v-if="currentDialogType === dialogType.EDIT ? false : true">
                    <el-select
                        v-model="gameId"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        v-if="currentDialogType === dialogType.EDIT ? false : true"
                        clearable>
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in gameInfos"
                            :key="item.gameId"
                            :label="item.gameName"
                            :value="item.gameId">
                            {{ item.gameName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="渠道" v-if="currentDialogType === dialogType.EDIT ? false : true">
                    <el-select
                        v-model="channelId"
                        placeholder="请选择渠道"
                        popper-class="role-select-dropdown"
                        v-if="currentDialogType === dialogType.EDIT ? false : true"
                        clearable>
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in selectChannelInfos"
                            :key="item.channelId"
                            :label="item.channelName"
                            :value="item.channelId">
                            {{ item.channelName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="应用" prop="pn">
                    <el-select
                        v-if="currentDialogType === dialogType.EDIT ? false : true"
                        v-model="currentData.opParamName"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false"
                        clearable>
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in selectAppInfos"
                            :key="item.pn"
                            :label="item.appname"
                            :value="item.pn">
                            {{ item.appname }}
                        </el-option>
                    </el-select>
                    <el-input v-else v-model="currentData.opParamName" readonly />
                </el-form-item>
                <el-form-item label="参数值" prop="opParamValue">
                    <el-input type="textarea" :rows="4" v-model="currentData.opParamValue" placeholder="参数值"/>
                </el-form-item>

                <el-form-item label="版本号" >
                    <el-input v-model="currentData.opAppCode" placeholder="版本号"/>
                    <span style="color: red">注:此处设置为"-1",为兼容以前版本,对于新的版本此处必须和ver_code保持一致</span>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="currentData.opDesc" placeholder="描述"/>
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


    import { deepClone } from '@/utils'
    import app from '@/api/app/app'
    import onlineParams from '@/api/app/onlineParams'
    import game from '@/api/hallgame/game'
    import channel from '@/api/app/channel'

    import waves from '@/directive/waves'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        opParamName:"",
        opDesc:""
    }

    export default {
        directives: { waves },
        components: {
            Pagination,
            FilterContainer,
            OperateContainer
        },
        data () {
            return {
                listLoading: false,
                isUpdate: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,

                searchGameId: '',
                searchChannel: '',
                searchPn: '',

                currentData: Object.assign({}, defaultData),
                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                dialogVisible: false,
                dialogType: DialogType,

                dialogSubVisible : false,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息

                gameId: '',
                channelId: "",
                gameInfos : [],
                channelInfos : [],
                appInfos: [],
                rules: {
                    opParamName : [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ],
                    opParamValue : [
                        { required: true, message: '请输入参数值', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {

            selectChannelInfos () {
                if (this.gameId) {
                    const selectChannelIds = this.appInfos.filter(item => {
                        return item.gameid === this.gameId
                    }).map(item => {
                        return item.channel
                    })
                    const selectChannelInfos = this.channelInfos.filter(item => {
                        return selectChannelIds.indexOf(item.channelId) > -1
                    })
                    return selectChannelInfos
                } else {
                    return this.channelInfos
                }
            },

            selectAppInfos () {
                if (this.gameId) {
                    let selectAppInfos = this.appInfos.filter(item => {
                        return item.gameid === this.gameId
                    })
                    if (this.channelId) {
                        selectAppInfos = selectAppInfos.filter(item => {
                            return item.channel === this.channelId
                        })
                    }
                    return selectAppInfos
                } else {
                    if (this.channelId) {
                        const selectAppInfos = this.appInfos.filter(item => {
                            return item.channel === this.channelId
                        })
                        return selectAppInfos
                    } else {
                        return this.appInfos
                    }
                }
            },

            searchChannelInfos () {
                if (this.searchGameId) {
                    const searchChannelIds = this.appInfos.filter(item => {
                        return item.gameid === this.searchGameId
                    }).map(item => {
                        return item.channel
                    })
                    const searchChannelInfos = this.channelInfos.filter(item => {
                        return searchChannelIds.indexOf(item.channelId) > -1
                    })
                    return searchChannelInfos
                } else {
                    return this.channelInfos
                }
            },

            searchAppInfos () {
                if (this.searchGameId) {
                    let searchAppInfos = this.appInfos.filter(item => {
                        return item.gameid === this.searchGameId
                    })
                    if (this.searchChannel) {
                        searchAppInfos = searchAppInfos.filter(item => {
                            return item.channel === this.searchChannel
                        })
                    }
                    return searchAppInfos
                } else {
                    if (this.searchChannel) {
                        const searchAppInfos = this.appInfos.filter(item => {
                            return item.channel === this.searchChannel
                        })
                        return searchAppInfos
                    } else {
                        return this.appInfos
                    }
                }
            }
        },

        watch: {
            'searchGameId' (newValue, oldValue) {
                if (this.searchChannelInfos.length > 0) {
                    this.searchChannel = this.searchChannelInfos[0].channelId
                }
            },
            'searchChannel' (newValue, oldValue) {
                if (this.searchAppInfos.length > 0) {
                    this.searchPn = this.searchAppInfos[0].pn
                }
            },

            'gameId' (newValue, oldValue) {
                this.channelId = ""
                this.currentData.opParamName = ""
            },
            'channelId' (newValue, oldValue) {
                this.currentData.opParamName = ""
            }

        },
        created () {
            this.getLimitMainGames()
            this.getChannelInfos()
            this.getAppInfos()
            this.getOnlineParamsPage()
        },

        methods: {
             getOnlineParamsPage () {
                const self = this
                self.listLoading = true

                 onlineParams.getOnlineParamsPage(self.currentPage, self.pageSize, self.searchPn).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getLimitMainGames () {
                const res = await game.getLimitMainGames()
                this.gameInfos = res.data
            },

            async getChannelInfos () {
                const res = await channel.getLimitChannels()
                this.channelInfos = res.data
            },

            async getAppInfos () {
                const res = await app.getTotalApps("", "")
                this.appInfos = res.data
            },

            handleSelectChange (row) {
                const self = this
                self.selectData = deepClone(row)
            },

            handleAddParams () {
                this.currentData = Object.assign({}, defaultData)

                this.currentDialogType = this.dialogType.NEW
                this.dialogVisible = true
            },

            handleEditParams () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.opId) {
                    self.$message({
                        type: 'error',
                        message: '请选择参数!'
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
            handleDelParams () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.opId) {
                    self.$message({
                        type: 'error',
                        message: '请选择参数!'
                    })
                    return
                }

                self.$confirm(`确认删除参数“${self.currentData.appname}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    onlineParams.deleteParams(self.currentData.opId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '参数删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.opId != self.currentData.opId
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
                            this.updateParams()
                        } else {
                            this.addParams()
                        }
                    } else {
                        return false;
                    }
                });
            },
            updateParams () {
                const self = this
                const { opId, opParamName, opAppCode, opParamValue, opDesc} = self.currentData

                if (opParamValue.indexOf("{") == -1) {
                    self.$message({
                        type: 'error',
                        message: 'paramValue必须为JSON格式！'
                    })
                    return
                }

                let form = new FormData()
                form.append("id",opId)
                form.append("paramname", opParamName)
                form.append("paramvalue", opParamValue)
                form.append("appcode",opAppCode)
                form.append("desc",opDesc)
                onlineParams.executeParams(form).then(result => {
                    if (result.data == 0) {
                        self.dialogVisible = false
                        for (let index = 0; index < this.tableDates.length; index++) {
                            if (this.tableDates[index].opId === this.currentData.opId) {
                                this.tableDates.splice(index, 1, Object.assign({}, self.currentData))
                                break
                            }
                        }
                        self.selectData = deepClone(self.currentData)
                        self.$message({
                            type: 'success',
                            message: '修改参数信息成功'
                        })
                    } else if (result.data == -4) {
                        self.$message({
                            type: 'error',
                            message: '在线参数名称已经存在，请重新指定参数名！'
                        })
                    } else {
                        self.$message({
                            type: 'error',
                            message: '保存失败'
                        })
                    }
                }).catch((error) => {
                })
            },
            addParams () {
                const self = this

                if (self.currentData.opParamValue.indexOf("{") == -1) {
                    self.$message({
                        type: 'error',
                        message: 'paramValue必须为JSON格式！'
                    })
                    return
                }

                let form = new FormData()
                form.append("paramname",self.currentData.opParamName + '.config2')
                form.append("paramvalue", self.currentData.opParamValue)
                form.append("appcode",self.currentData.opAppCode)
                form.append("desc",self.currentData.opDesc)

                onlineParams.executeParams(form).then(result => {
                    if (result.data == 0) {
                        self.dialogVisible = false
                        self.$message({
                            type: 'success',
                            message: '新增参数成功'
                        })
                        self.getOnlineParamsPage();
                    } else if (result.data == -4) {
                        self.$message({
                            type: 'error',
                            message: '在线参数名称已经存在，请重新指定参数名！'
                        })
                    } else {
                        self.$message({
                            type: 'error',
                            message: '保存失败'
                        })
                    }

                }).catch(error => {
                })
            },
            resetQueryParam () {
                this.getOnlineParamsPage()
            },

            handleBeforeCloseEdit (done) {
                //
                if (this.isUpdate) {
                    this.$confirm('您修改了信息，是否需要保存?', '确认', {
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
                    this.getOnlineParamsPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getOnlineParamsPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getOnlineParamsPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getOnlineParamsPage()
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
