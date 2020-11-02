<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getAppInfosPage"
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
                            placeholder=""
                            clearable
                            filterable
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
                            filterable
                        >
                            <el-option
                                v-for="item in searchChannelInfos"
                                :key=item.channelId
                                :label="item.channelName"
                                :value=item.channelId>
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="应用">
                        <el-select
                            size="small"
                            v-model="searchPn"
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in searchAppInfos"
                                :key="item.pn"
                                :label="item.appname"
                                :value="item.pn">
                                {{ item.appname }}
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
                @click="handleAddApp">
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEditApp">
                编辑
            </el-button>

            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelApp">
                删除
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-add"
                @click="handleAddSub">
                创建子渠道包
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-add"
                @click="refreshCacheByPn">
                刷新缓存
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-add"
                @click="loadCacheByPn">
                显示缓存
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
                    <el-table-column align="center" label="游戏名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gameName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="渠道名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.appname }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用全称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pn }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="版本号" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.verstr }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="强制升级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.ef === 1 ? "是" : "否" }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="登录IP" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.lip }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="端口" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.port }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="审核状态" width="200">
                        <template slot-scope="scope">
                            {{ getStatus(scope.row.specialstatus) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="所属主渠道包" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.parentPnName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="是否启用推广" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.promoterStatus === 1 ? "是" : "否" }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="支付宝收款方" width="200">
                        <template slot-scope="scope">
                            {{ getAliName(scope.row.alitype) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="是否允许注册" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.isreglimit === 0 ? "是" : "否" }}
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
            :title="currentDialogType===dialogType.EDIT?'编辑应用':'新增应用'"
            width="800px"
            :before-close="handleBeforeCloseEdit">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left" :inline="true" :rules="rules">

                <el-form-item label="游戏" prop="gameid">
                    <el-select
                        v-model="currentData.gameid"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false"
                        clearable
                        filterable>
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

                <el-form-item label="渠道" prop="channel">
                    <el-select
                        v-model="currentData.channel"
                        placeholder="请选择渠道"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false"
                        clearable
                        filterable>
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in allChannelInfos"
                            :key="item.channelId"
                            :label="item.channelName"
                            :value="item.channelId">
                            {{ item.channelName }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用名称" prop="appname">
                    <el-input v-model="currentData.appname" placeholder="应用名称"/>
                </el-form-item>
                <el-form-item label="应用全称" prop="pn">
                    <el-input  v-model="currentData.pn" placeholder="应用全称"
                               :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>
                <el-form-item label="版本号">
                    <el-input v-model="currentData.verstr" placeholder="版本号"/>
                </el-form-item>
                <el-form-item label="版本数字">
                    <el-input v-model="currentData.verno" placeholder="版本数字" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>
                <el-form-item label="下载地址">
                    <el-input v-model="currentData.url" placeholder="下载地址" />
                </el-form-item>

                <el-form-item label="提示消息">
                    <el-input v-model="currentData.msg" placeholder="提示消息"/>
                </el-form-item>
                    <el-form-item label="登陆IP">
                        <el-input  v-model="currentData.lip" placeholder="登陆IP"/>
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input v-model="currentData.port" placeholder="端口" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                    </el-form-item>

                <el-form-item label="审核状态" >
                    <el-select
                        v-model="currentData.specialstatus"
                        placeholder="审核状态"
                        popper-class="role-select-dropdown"
                        style="width: 93%;">
                        <el-option :value="0" label="审核完毕">审核完毕</el-option>
                        <el-option :value="1" label="审核中">审核中</el-option>
                        <el-option :value="2" label="审核完毕（地方棋牌）">审核完毕（地方棋牌）</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="强制升级">
                    <el-radio-group v-model="currentData.ef">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="收款方" prop="alitype">
                    <el-select
                        v-model="currentData.alitype"
                        placeholder="请选择收款方"
                        popper-class="role-select-dropdown"
                        style="width: 93%;">
                        <el-option :value="0" label="微禹">微禹</el-option>
                        <el-option :value="3" label="讯鸟">讯鸟</el-option>
                        <el-option :value="4" label="三趣">三趣</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否允许注册">
                    <el-radio-group v-model="currentData.isreglimit">
                        <el-radio :label="0" >是</el-radio>
                        <el-radio :label="1" >否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否启用推广">
                    <el-radio-group v-model="currentData.promoterStatus">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="confirm">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogSubVisible"
            title="创建子渠道包"
            width="600px">
        <el-form ref="ruleSubForm" :model="currentData" label-width="100px"
                 label-position="left" :rules="rules">

                <el-form-item label="主渠道" >
                    <el-select
                        v-model="currentData.channel"
                        popper-class="role-select-dropdown"
                        :disabled="true">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in allChannelInfos"
                            :key="item.channelId"
                            :label="item.channelName"
                            :value="item.channelId">
                            {{ item.channelName }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主应用名称" >
                    <el-input v-model="currentData.appname" placeholder="应用名称"
                              :disabled="true" />
                </el-form-item>
                <el-form-item label="主应用全称" >
                    <el-input  v-model="currentData.pn" placeholder="应用全称"
                               :disabled="true" />
                </el-form-item>

                <el-form-item label="子渠道" prop="subChannelName">
                    <el-select
                        v-model="currentData.subChannelName"
                        placeholder="请选择子渠道"
                        popper-class="role-select-dropdown">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in allChannelInfos"
                            :key="item.channelId"
                            :label="item.channelName"
                            :value="item.channelName">
                            {{ item.channelName }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="子应用名称" prop="subAppName">
                    <el-input v-model="currentData.subAppName" placeholder="子应用名称"/>
                </el-form-item>
                <el-form-item label="子应用全称" prop="subPn">
                    <el-input  v-model="currentData.subPn" placeholder="子应用全称"/>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogSubVisible=false">取消</el-button>
                <el-button type="primary" @click="addSubApp">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible1"
            title="缓存"
            width="600px">

                {{ pnCache }}


            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible1=false">取消</el-button>
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
    import channel from '@/api/app/channel'
    import game from '@/api/hallgame/game'

    import waves from '@/directive/waves'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        ef: 0,
        specialstatus: 1,
        isreglimit : 1,
        promoterStatus: 0
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
                dialogVisible1: false,

                dialogType: DialogType,

                dialogSubVisible : false,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息

                gameInfos : [],
                searchChannelInfos : [],
                allChannelInfos:[],
                searchAppInfos:[],
                appInfos: [],
                pnCache:'',

                rules: {
                    pn : [
                        { required: true, message: '请输入应用全称', trigger: 'blur' }
                    ],
                    appname : [
                        { required: true, message: '请输入应用名称', trigger: 'blur' }
                    ],
                    gameid: [
                        { required: true, message: '请选择游戏', trigger: 'change' }
                    ],
                    channel: [
                        { required: true, message: '请选择渠道', trigger: 'change' }
                    ],
                    alitype:[
                        { required: true, message: '请选择收款方', trigger: 'change' }
                    ],

                    subChannelName: [
                        { required: true, message: '请选择子渠道', trigger: 'change' }
                    ],
                    subPn : [
                        { required: true, message: '请输入子应用全称', trigger: 'blur' }
                    ],
                    subAppName : [
                        { required: true, message: '请输入子应用名称', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
            isConfirmDisabled () {
                if (this.currentData.appname && this.currentData.appname.trim().length > 0) {
                    // 渠道名称不为空的时候，在判断用户名是否修改或者是否修改了渠道信息
                    return !(this.isUpdate)
                } else {
                    // 渠道必须要有名称，不可以为空
                    return true
                }
            }
        },
        watch: {
            'currentData.appname' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdate = newValue !== this.selectData.appname
                } else {
                    // 新增的时候，
                    this.isUpdate = newValue && newValue.trim().length > 0
                }
            },

            'currentData.pn' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdate = newValue !== this.selectData.pn
                } else {
                    // 新增的时候，
                    this.isUpdate = newValue && newValue.trim().length > 0
                }
            },

            'searchGameId' (newValue, oldValue) {
                if (newValue) {
                    this.getGameToSearchChannel(newValue)
                    this.getTotalApps(newValue, "");
                }
            },

            'searchChannel' (newValue, oldValue) {
                this.getTotalApps(this.searchGameId, newValue);
            }

        },
        created () {
            this.getAppInfosPage()
            this.getLimitGames()
            this.getLimitChannels()
            //this.getAppInfos()
        },

        methods: {
            async getAppInfosPage () {
                const self = this
                self.listLoading = true

                app.getAppInfosPage(self.currentPage, self.pageSize,self.searchGameId, self.searchChannel, self.searchPn).then(result => {
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
                this.gameInfos = res.data
            },
            async getLimitChannels () {
                const res = await channel.getLimitChannels()
                this.allChannelInfos = res.data
            },

            async getGameToSearchChannel (gameId) {
                const res = await channel.getGameToChannel(gameId)
                this.searchChannelInfos = res.data
                if (this.searchChannelInfos && this.searchChannelInfos.length > 0) {
                    this.searchChannel = this.searchChannelInfos[0].channelId
                } else {
                    this.searchChannel = null
                }
            },

            async getTotalApps (game, channel) {
                const res = await app.getTotalApps(game, channel)
                this.searchAppInfos = res.data
                if (this.searchAppInfos && this.searchAppInfos.length > 0) {
                    this.searchPn = this.searchAppInfos[0].pn
                } else {
                    this.searchPn = ''
                }
            },

            handleSelectChange (row) {
                const self = this
                self.selectData = deepClone(row)
            },

            handleAddApp () {
                this.dialogVisible = true
                this.currentData = Object.assign({}, defaultData)
                this.currentDialogType = this.dialogType.NEW
            },

            handleEditApp () {
                const self = this
                self.dialogVisible = true
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.appid) {
                    self.$message({
                        type: 'error',
                        message: '请选择应用!'
                    })
                    return
                }
                // 重置保存状态
                self.isUpdate = false
                self.currentDialogType = this.dialogType.EDIT

            },

            handleAddSub () {
                const self = this
                if (!self.selectData.appid) {
                    self.$message({
                        type: 'error',
                        message: '请选择应用!'
                    })
                    return
                }

                if (self.selectData.parentpn) {
                    self.$message({
                        type: 'error',
                        message: '暂不支持子渠道包下建子渠道包!'
                    })
                    return
                }

                self.currentData = deepClone(self.selectData)
                self.dialogSubVisible = true;
            },
            /**
             * 删除
             * @param $index
             * @param row
             */
            handleDelApp () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.appid) {
                    self.$message({
                        type: 'error',
                        message: '请选择应用!'
                    })
                    return
                }

                self.$confirm(`确认删除应用“${self.currentData.appname}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    app.deleteApp(self.currentData.appid).then(result => {
                        self.$message({
                            type: 'success',
                            message: '应用删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.appid != self.currentData.appid
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
                            this.updateApp()
                        } else {
                            this.addApp()
                        }
                    } else {
                        return false;
                    }
                });
            },
            updateApp () {
                const self = this

                const { appid, appname,gameid, channel, verstr, verno, msg, lip, port,
                    ef, specialstatus, alitype, isreglimit, promoterStatus, pn, url} = self.currentData
                app.putApp({
                    'appid': appid,
                    'appname': appname,
                    'gameid' : gameid,
                    'channel' : channel,
                    'ef': ef,
                    'lip': lip,
                    'msg': msg,
                    'pn': pn,
                    'port': port,
                    'verstr': verstr,
                    'verno': verno,
                    'specialstatus': specialstatus,
                    'promoterStatus': promoterStatus,
                    'alitype': alitype,
                    'isreglimit': isreglimit,
                    'wawajiStatus':0,
                    'url':url
                }).then(result => {
                    self.dialogVisible = false

                    for (let index = 0; index < this.tableDates.length; index++) {
                        if (this.tableDates[index].appId === this.currentData.appId) {
                            this.tableDates.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }

                    self.selectData = deepClone(self.currentData)

                    self.$message({
                        type: 'success',
                        message: '修改应用信息成功'
                    })
                }).catch((error) => {
                })
            },
            addApp () {
                const self = this
                app.addApp({
                    'appid':-1,
                    'appname': self.currentData.appname,
                    'gameid': self.currentData.gameid ? self.currentData.gameid : -1,
                    'channel': self.currentData.channel ? self.currentData.channel : -1,
                    'ef': self.currentData.ef  ? self.currentData.ef : 0,
                    'lip': self.currentData.lip,
                    'msg': self.currentData.msg,
                    'pn': self.currentData.pn,
                    'port': self.currentData.port,
                    'verstr': self.currentData.verstr,
                    'verno': self.currentData.verno ? self.currentData.verno : -1,
                    'specialstatus': self.currentData.specialstatus ? self.currentData.specialstatus : 0,
                    'promoterStatus': self.currentData.promoterStatus ? self.currentData.promoterStatus : 0,
                    'alitype':self.currentData.alitype ? self.currentData.alitype : 0,
                    'isreglimit' : self.currentData.isreglimit ? self.currentData.isreglimit : 0,
                    'wawajiStatus' : 0,
                    'url':self.currentData.url
                }).then(result => {
                    self.dialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增应用成功'
                    })
                    self.getAppInfosPage()
                }).catch(error => {
                })
            },
            addSubApp () {
                const self = this
                self.$refs.ruleSubForm.validate((valid) => {
                    if (valid) {
                        app.addSubApp(self.currentData.channel,
                            self.currentData.pn,
                            self.currentData.subChannelName,
                            self.currentData.subPn,
                            self.currentData.subAppName,
                            0
                        ).then(result => {
                            self.dialogSubVisible = false
                            if (result.data.ret == 0) {
                                self.$message({
                                    type: 'success',
                                    message: '新增应用成功'
                                })
                            } else {
                                self.$message({
                                    type: 'error',
                                    message: result.data.msg
                                })
                            }
                            self.getAppInfosPage()
                        }).catch(error => {
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetQueryParam () {
                this.searchAppName = ""
                this.getAppInfosPage()
            },

            handleBeforeCloseEdit (done) {
                //
                if (this.isUpdate) {
                    this.$confirm('您修改了应用信息，是否需要保存?', '确认', {
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
                    this.getAppInfosPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getAppInfosPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getAppInfosPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getAppInfosPage()
            },

            getStatus (value) {
                switch (value) {
                    case 0:
                        return "审核完毕"
                    case 1:
                        return "审核中"
                    case 2:
                        return "审核完毕（地方棋牌）"
                }
            },

            getAliName (value) {
                switch (value) {
                    case 0:
                        return "微禹"
                    case 3:
                        return "讯鸟"
                    case 4:
                        return "三趣"
                }
            },

            refreshCacheByPn () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.appid) {
                    self.$message({
                        type: 'error',
                        message: '请选择应用!'
                    })
                    return
                }
                let form = new FormData()
                form.append("pn",self.currentData.pn)
                app.refreshCacheByPn(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: result.data
                    })
                }, result => {
                })
            },

            loadCacheByPn () {
                const self = this
                self.pnCache = ""
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.appid) {
                    self.$message({
                        type: 'error',
                        message: '请选择应用!'
                    })
                    return
                }
                app.loadCacheByPn(self.currentData.pn).then(result => {
                    self.dialogVisible1 = true
                    self.pnCache = result.data
                }, result => {
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
</style>
