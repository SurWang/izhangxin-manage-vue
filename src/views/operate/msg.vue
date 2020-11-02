<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getMsgInfo"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="账号ID">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="账号ID"
                                  style="width: 200px;"
                                  clearable
                                 >
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
                    fit
                    highlight-current-row
                    height="100%"
                    :data="tableDates"
                    @row-click="handleSelectChange"
                    :row-class-name="tableRowClassName">

                    <el-table-column align="center" label="消息编号" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gpid }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="游戏名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gameName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="账号ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.uid }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="昵称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.nickname }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="消息" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.msg }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="状态" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.status == 0 ? "广播中" : "未广播" }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="表达式时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.cronTime }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pn }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="200">
                        <template slot-scope="{row,$index}">
                            <el-button v-if="row.status == 0" type="primary" size="mini" @click="parseTmmsg(row)">
                                暂停广播
                            </el-button>
                            <el-button v-else type="primary" size="mini" @click="resumeTmmsg(row)">
                                恢复广播
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="manage-main-footer">

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

                <el-form-item label="任务编号" prop="gpid">
                    <el-input v-model="currentData.gpid" placeholder="任务编号" size="medium"/>
                </el-form-item>

                <el-form-item label="pn" prop="pn">
                    <el-select
                        v-model="currentData.pn"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        style="width: 202px">
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

                <el-form-item label="选择游戏" prop="gameid">
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
                            v-for="item in games"
                            :key="item.gameId"
                            :label="item.gameName"
                            :value="item.gameId">
                            {{ item.gameName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账号ID" >
                    <el-input v-model="currentData.uid" placeholder="账号ID"/>
                </el-form-item>

                <el-form-item label="昵称" >
                    <el-input v-model="currentData.nickname" placeholder="昵称" />
                </el-form-item>

                <el-form-item label="消息" prop="msg">
                    <el-input v-model="currentData.msg" placeholder="消息" />
                </el-form-item>
                <el-form-item label="自定义时间" prop="cronTime">
                    <el-input v-model="currentData.cronTime" placeholder="请输入正确的quartz cron表达式" />
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
    import msg from '@/api/operate/msg'
    import game from '@/api/hallgame/game'
    import app from '@/api/app/app'

    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        gameid:0,
        pn:"-1"
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
                searchUid: '',
                disabled:false,

                currentData: Object.assign({}, defaultData),
                tableDates: [],
                games:[],
                apps:[],

                dialogVisible: false,
                dialogType: DialogType,

                dialogSubVisible : false,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息

                rules: {
                    gpid:[
                        { required: true, message: '请输入编号', trigger: 'blur' }
                    ],
                    pn:[
                        { required: true, message: '请输入pn', trigger: 'change' }
                    ],
                    gameid:[
                        { required: true, message: '请输入游戏', trigger: 'change' }
                    ],
                    msg:[
                        { required: true, message: '请输入消息', trigger: 'blur' }
                    ],
                    cronTime:[
                        { required: true, message: '请输入表达式', trigger: 'blur' }
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
        },
        created () {
            this.getMsgInfo()
            this.getGames()
            this.getApps()
        },

        methods: {
            async getMsgInfo () {
                const self = this
                await msg.getMsgInfo(self.searchUid).then(result => {
                    if (result.data) {
                        self.tableDates = result.data.rows
                        self.listTotal = result.data.total
                    } else {
                        self.tableDates = []
                    }
                }, result => {
                    self.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })

            },

            async getGames () {
                const res = await game.getGames("", "")
                this.games = res.data.games
                this.games.unshift({gameId:0,gameName:'全部'});

            },

            async getApps () {
                const res = await app.getApps("", "")
                this.apps = res.data
                this.apps.unshift({pn:'-1',aiName:'全部'});
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
                if (!self.selectData.goodsId) {
                    self.$message({
                        type: 'error',
                        message: '请选择商品!'
                    })
                    return
                }
                // 重置保存状态
                self.isUpdate = false
                self.goodsImg = self.currentData.goodsImg
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
                if (!self.selectData.gpid) {
                    self.$message({
                        type: 'error',
                        message: '请选择消息!'
                    })
                    return
                }

                self.$confirm(`确认删除消息“${self.currentData.gpname}”?`, '提示', {
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
                            //this.update()
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

                let form = new FormData()
                form.append('gpId', self.currentData.gpid)
                form.append('tm_uid', self.currentData.uid)
                form.append('tm_nickname', self.currentData.nickname)
                form.append('tm_gameid', self.currentData.gameid)
                form.append('tm_msg', self.currentData.msg)
                form.append('custom_time', self.currentData.cronTime)
                form.append('tm_pn', self.currentData.pn)

                msg.addMsg(form).then(result => {
                    const data = result.data
                    if (data == 0) {
                        self.tableDates.unshift(data)
                        self.dialogVisible = false
                        self.$message({
                            type: 'success',
                            message: '新增消息成功'
                        })
                    }else if (data == -99){
                        self.$message({
                            type: 'error',
                            message: '表达式书写有误'
                        })
                    }else if (data == -2){
                        self.$message({
                            type: 'error',
                            message: '已存在相同的编号'
                        })
                    } else {
                        self.$message({
                            type: 'error',
                            message: '数据有误'
                        })
                    }
                }).catch(error => {
                })
            },

            resetQueryParam () {
                this.getMsgInfo()
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
                    this.getMsgInfo()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getMsgInfo()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getMsgInfo()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getMsgInfo()
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
