<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getSubGamePage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="游戏名称">
                        <el-select
                            size="small"
                            v-model="searchGame"
                            placeholder="请选择游戏"
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in mainGameInfos"
                                :key="item.gameId"
                                :label="item.gameName"
                                :value="item.gameId">
                                {{ item.gameName }}
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="子游戏名称">
                        <el-select
                            size="small"
                            v-model="searchSubGame"
                            placeholder="请选择子游戏"
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in subGameInfos"
                                :key="item.gameId"
                                :label="item.gameName"
                                :value="item.gameId">
                                {{ item.gameName }}
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

                    <el-table-column align="center" label="主游戏名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.mainGameName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="子游戏名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.subGameName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="游戏version" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.version }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="serverType" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.serverType }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="channel名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelName }}
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
            :before-close="handleBeforeCloseEdit">
            <el-form ref="ruleForm" :model="currentData" label-width="110px"
                     label-position="left" :rules="rules">
                <el-form-item label="选择游戏" prop="mainGameId">
                    <el-select
                        v-model="currentData.mainGameId"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in mainGameInfos"
                            :key="item.gameId"
                            :label="item.gameName"
                            :value="item.gameId">
                            {{ item.gameName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择子游戏" prop="subGameId">
                    <el-select
                        v-model="currentData.subGameId"
                        placeholder="请选择子游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in subGameInfos"
                            :key="item.gameId"
                            :label="item.gameName"
                            :value="item.gameId">
                            {{ item.gameName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="子游戏channel" prop="serverType">
                    <el-select
                        v-model="currentData.serverType"
                        placeholder="请选择子游戏channel"
                        multiple
                        filterable
                        style="width: 100%;"
                        popper-class="role-select-dropdown">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in subChannels"
                            :key="item.channelId"
                            :label="item.channelName"
                            :value="item.channelId">
                            {{ item.channelName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="游戏version" prop="version">
                    <el-input v-model="currentData.version" placeholder="游戏version" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
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
    import game from '@/api/hallgame/game'
    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        serverType:[]
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
                img:'',
                searchGame: -1,
                searchSubGame: -1,
                disabled:false,

                currentData: Object.assign({}, defaultData),
                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                dialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                mainGameInfos : [],
                subGameInfos:[],
                subChannels:[],

                rules: {
                    mainGameId :[
                        { required: true, message: '请选择主游戏', trigger: 'change' }
                    ],
                    subGameId :[
                        { required: true, message: '请选择子游戏', trigger: 'change' }
                    ],
                    serverType :[
                        { required: true, message: '请选择子游戏channel', trigger: 'change' }
                    ],
                    version :[
                        { required: true, message: '请输入游戏版本', trigger: 'blur' }
                    ]
                },
            }
        },
        computed: {

        },
        watch: {

            'currentData.mainGameId' (newValue, oldValue) {
                if (newValue != undefined) {
                    this.getGameVersion(newValue)
                }
            },

            'currentData.subGameId' (newValue, oldValue) {
                if (newValue != undefined) {
                    this.getSubChannels(newValue)
                }
            }


        },
        created () {
            this.getSubGamePage()
            this.getMainGame()
            this.getSubGame()
        },

        methods: {
            async getSubGamePage () {
                const self = this
                self.listLoading = true

                game.getSubGamePage(self.currentPage, self.pageSize, self.searchGame, self.searchSubGame).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getMainGame () {
                const res = await game.getMainGame()
                this.mainGameInfos = res.data.maingames
                this.mainGameInfos.unshift({gameId:-1,gameName:'全部游戏'})
            },

            async getSubGame () {
                const res = await game.getSubGame()
                this.subGameInfos = res.data
                this.subGameInfos.unshift({gameId:-1,gameName:'全部子游戏'})
            },

            async getGameVersion(mainGameId) {
                const res = await game.getGameVersion(mainGameId)
                this.$set(this.currentData, 'version', res.data.msg)
            },

            async getSubChannels(subGameId) {
                const res = await game.getSubChannels(subGameId)
                this.subChannels = res.data
                this.$set(this.currentData, 'serverType', [])

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
                        message: '请选择道具!'
                    })
                    return
                }
                // 重置保存状态
                self.img = self.currentData.img
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
                if (!self.selectData.mainGameId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                self.$confirm(`确认删除“${self.selectData.subGameName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append('gaId', self.selectData.mainGameId)
                    form.append('servertype', self.selectData.serverType)

                    game.delSubGame(form).then(result => {
                        if (result.data.ret == 0) {
                            self.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            self.selectData= deepClone(defaultData)
                            self.getSubGamePage()
                        } else {
                            self.$message({
                                type: 'error',
                                message: result.data.msg
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
                /*const self = this

                const { goodsId, goodsName, goodsOrder, goodsImg, goodsLimitRegAt, goodsLimitVip,
                    goodsLimitCnt, goodsLimitType, goodsStock, goodsStockType, goodsStatus, goodsGain, goodsExchange} = self.currentData
                goods.putGoods({
                    'goodsId': goodsId,
                    'goodsName': goodsName,
                    'goodsOrder': goodsOrder,
                    'goodsImg': goodsImg,
                    'goodsLimitRegAt': goodsLimitRegAt,
                    'goodsLimitVip': goodsLimitVip,
                    'goodsLimitCnt': goodsLimitCnt,
                    'goodsLimitType': goodsLimitType,
                    'goodsStock': goodsStock,
                    'goodsStockType': goodsStockType,
                    'goodsStatus': goodsStatus,
                    'goodsGain': goodsGain,
                    'goodsExchange' : goodsExchange
                }).then(result => {
                    self.dialogVisible = false
                    for (let index = 0; index < this.tableDates.length; index++) {
                        if (this.tableDates[index].goodsId === this.currentData.goodsId) {
                            this.tableDates.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }

                    self.selectData = deepClone(self.currentData)

                    self.goodsImg = ""
                    self.currentGoodsGain = {}
                    self.currentGoodsExchange = {}

                    self.$message({
                        type: 'success',
                        message: '修改商品信息成功'
                    })
                }).catch((error) => {
                })*/
            },
            add () {
                const self = this

                let form = new FormData()
                form.append('ss_gameid', self.currentData.mainGameId);
                form.append('ss_subgameid', self.currentData.subGameId);
                for (const item of self.currentData.serverType) {
                    form.append('ss_channel', parseInt(item));
                }
                form.append('version', self.currentData.version);

                game.addSubGame(form).then(result => {
                    const data = result.data
                    if (data.ret == 0) {
                        self.dialogVisible = false
                        self.$message({
                            type: 'success',
                            message: '新增成功'
                        })
                        self.getSubGamePage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: data.msg
                        })
                    }
                }).catch(error => {
                })
            },

            resetQueryParam () {
                this.getSubGamePage()
            },


            handleBeforeCloseEdit (done) {
                //
                if (this.isUpdate) {
                    this.$confirm('您修改了道具信息，是否需要保存?', '确认', {
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
                    this.getSubGamePage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getSubGamePage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getSubGamePage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getSubGamePage()
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
    .img-info {
        width: 60px;
        height: 60px;
        display: block;
    }
</style>
