<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getGameConfigPage"
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
                            filterable
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
                            filterable
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
                            v-model="searchType"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" value="" label="全部">全部</el-option>
                            <el-option class="role-select-dropdown__item" value="default" label="默认">默认</el-option>
                            <el-option class="role-select-dropdown__item" value="android" label="安卓">安卓</el-option>
                            <el-option class="role-select-dropdown__item" value="ios" label="ios">ios</el-option>

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

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-md-add"
                @click="handleAddFolder">
                创建文件夹
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
                    <el-table-column align="center" label="渠道" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用全称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pnName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="游戏" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gameName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="支持类型" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.dgcPlatform == "default" ? "默认" : scope.row.dgcPlatform}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="versionName" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.versionName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="versionCode" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.versionCode }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="更新时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.updateTimestr }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="extparam" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.extparam }}
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
            <el-form :model="currentData" label-width="120px" label-position="left"
                     :rules="rules" ref="ruleForm">
                <el-form-item label="渠道" >
                    <el-select
                        v-model="currentData.dgcChannelId"
                        placeholder="请选择渠道"
                        clearable
                        filterable
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
                <el-form-item label="应用" >
                    <el-select
                        v-model="currentData.dgcPn"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        clearable
                        filterable
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
                <el-form-item label="游戏" prop="dgcSmallgameId">
                    <el-select
                        v-model="currentData.dgcSmallgameId"
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


                <el-form-item label="支持类型">
                    <el-radio-group v-model="currentData.dgcPlatform"
                                    :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-radio label="default">默认</el-radio>
                        <el-radio label="android" >安卓</el-radio>
                        <el-radio label="ios" >IOS</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="version-name">
                    <el-input v-model="currentData.versionName" placeholder="version-name"/>
                </el-form-item>
                <el-form-item label="version-code" prop="versionCode">
                    <el-input v-model="currentData.versionCode" placeholder="version-code"/>
                </el-form-item>

                <el-form-item label="上传文件" >
                    <el-input v-model="currentData.autoid" type="hidden"/>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        :headers="this.$authInfo"
                        action=""
                        :file-list="fileList"
                        :auto-upload="false"
                        :multiple="true"
                        :before-upload="onBeforeUpload"
                        :http-request="handleUpload"
                        :on-remove="handleRemove"
                        :on-change="fileChange"
                        :limit="2">
                        <el-button style="margin-left: 100px;" slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="extparam">
                    <el-input type="textarea" v-model="currentData.extparam" placeholder="extparam"/>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="gameDialogVisible=false">取消</el-button>
                <el-button type="primary"  @click="confirm">保存</el-button>
            </div>
        </el-dialog>


        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="createDialogVisible"
            title="创建文件夹"
            width="600px"
        >
            <el-form :model="createData" label-width="120px" label-position="left"
                     :rules="createRules" ref="createForm">
                <el-form-item label="游戏" prop="gameId">
                    <el-select
                        v-model="createData.gameId"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        filterable
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

                <el-form-item label="游戏目录" prop="moduleDdz">
                    <el-input v-model="createData.moduleDdz" placeholder="游戏目录"/>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="createDialogVisible=false">取消</el-button>
                <el-button type="primary"  @click="createFolder">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'

    import { deepClone } from '@/utils'
    import game from '@/api/hallgame/game'
    import gameConfig from '@/api/pyq/gameConfig'
    import channel from '@/api/app/channel'
    import app from '@/api/app/app'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
        gameName: '' //
    }

    const defaultGame = {
        dgcPlatform :"default",
        dgcPn: 'all',
        extparam: "{}",
        autoid :0,
        dgcChannelId:null,
        dgcPn:""
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

                searchGameId : '',
                searchChannel : '',
                searchType:'',
                games:[],
                channels:[],
                apps:[],

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],

                gameDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                fileList:[],
                files:[],

                createDialogVisible:false,
                createData:{},
                rules: {
                    dgcSmallgameId : [
                        { required: true, message: '请输入游戏', trigger: 'change' }
                    ],
                    dgcPlatform : [
                        { required: true, message: '请输入类型', trigger: 'change' }
                    ],
                    versionCode: [
                        { required: true, message: '请输入versionCode', trigger: 'blur' }
                    ],
                },
                createRules: {
                    gameId : [
                        { required: true, message: '请输入游戏', trigger: 'change' }
                    ],
                    moduleDdz : [
                        { required: true, message: '请输入目录', trigger: 'blur' }
                    ],
                }
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
            'currentData.dgcChannelId' (newValue, oldValue) {
                if (newValue) {
                    this.getApps("", newValue)
                }
            }
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
            this.getGameConfigPage()
            this.getLimitGames()
            this.getLimitChannels()
            this.getApps("","")
        },

        methods: {
            async getGameConfigPage () {
                const self = this
                self.listLoading = true
                gameConfig.getGameConfigPage(self.currentPage, self.pageSize,self.searchGameId,
                self.searchChannel,self.searchType).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.items
                    self.listTotal = result.data.totalCount
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

            async getApps (gameId, channelId) {
                const res = await app.getApps(gameId, channelId)
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
                if (!self.currentData.dgcAutoId ) {
                    self.$message({
                        type: 'error',
                        message: '请选择游戏!'
                    })
                    return
                }

                // 重置保存状态
                self.isUpdateGame = false
                self.currentDialogType = this.dialogType.EDIT

                self.gameDialogVisible = true
                self.currentData.autoid = self.selectData.dgcFileUploadId

            },
            /**
             * 删除渠道
             * @param $index
             * @param row
             */
            handleDel () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.dgcAutoId ) {
                    self.$message({
                        type: 'error',
                        message: '请选择游戏!'
                    })
                    return
                }

                self.$confirm(`确认删除游戏“${self.currentData.gameName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    gameConfig.deleteItem(self.currentData.dgcAutoId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        self.tableDatas = self.tableDatas.filter(item => {
                            return item.dgcAutoId != self.currentData.dgcAutoId
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
                const { dgcAutoId, autoid, versionName,versionCode,extparam} = self.currentData
                gameConfig.putItem({
                    'listId': dgcAutoId,
                    'autoId': autoid,
                    'versionName':versionName,
                    'versionCode':parseInt(versionCode),
                    'extparam':extparam
                }).then(result => {
                    self.gameDialogVisible = false
                    for (let index = 0; index < this.tableDatas.length; index++) {
                        if (this.tableDatas[index].dgcAutoId === this.currentData.dgcAutoId) {
                            this.tableDatas.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }

                    self.selectData = deepClone(self.currentData)

                    self.$message({
                        type: 'success',
                        message: '修改游戏信息成功'
                    })
                }).catch((error) => {
                    self.$message({
                        type: 'error',
                        message: error.message
                    })
                })
            },
            add () {
                const self = this
                let form = new FormData()
                form.append('autoid', self.currentData.autoid)
                form.append('channelid', self.currentData.dgcChannelId)
                form.append('pn', self.currentData.dgcPn)
                form.append('smallgame', self.currentData.dgcSmallgameId)
                form.append('type', self.currentData.dgcPlatform)
                form.append('extparam', self.currentData.extparam)
                form.append('versionName', self.currentData.versionName)
                form.append('versionCode', parseInt(self.currentData.versionCode))

                gameConfig.addItem(form).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增游戏成功'
                    })
                    self.getGameConfigPage()
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
                    this.getGameConfigPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getGameConfigPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getGameConfigPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getGameConfigPage()
            },

            submitUpload() {
                const self = this
                const gameId = self.currentData.dgcSmallgameId
                var	pn = self.currentData.dgcPn;
                var	channelid = self.currentData.dgcChannelId;
                var	type = self.currentData.dgcPlatform;

                if (!gameId) {
                    self.$message({
                        type: 'error',
                        message: '请填写游戏'
                    })
                    return
                }

                gameConfig.getGameFolder(gameId).then(result=>{
                    debugger
                    if(result.data == 0){
                        if (self.currentDialogType == self.dialogType.NEW) {
                            let form = new FormData()
                            form.append('smallgame', gameId)
                            form.append('pn', pn)
                            form.append('type', type)
                            form.append('channelid', channelid)

                            gameConfig.ifExistGameConfig(form).then(result=>{
                                if(result.data.ret == 1){
                                    self.$refs.upload.submit();
                                    let form = new FormData();
                                    form.append('gameid', self.currentData.dgcSmallgameId);
                                    form.append('uploadtype', self.currentData.dgcPlatform);
                                    form.append('version', self.currentData.versionCode);

                                    self.files.forEach(file => {
                                        form.append("file", file, file.name);
                                    });
                                    // 提交调用uploadFile函数
                                    gameConfig.uploadFile(form).then(result => {
                                        self.files = []
                                        if (result.data[0].autoId > 0) {
                                            self.$message({
                                                type: 'success',
                                                message: '上传成功'
                                            })
                                            self.currentData.autoid = result.data[0].autoId
                                        } else if (result.data[0].autoId == -999) {
                                            self.$message({
                                                type: 'error',
                                                message: '压缩包中没有log.json文件,不能上传'
                                            })
                                        }  else if (result.data[0].autoId == -1000) {
                                            self.$message({
                                                type: 'error',
                                                message: '压缩包中没有log.json文件,不能上传'
                                            })
                                        }
                                    },error=>{
                                    })
                                } else {
                                    self.$message({
                                        type: 'error',
                                        message: result.data.desc
                                    })
                                    return
                                }
                            }, error => {
                            })
                        } else {
                            self.$refs.upload.submit();
                            let form = new FormData();
                            form.append('gameid', self.currentData.dgcSmallgameId);
                            form.append('uploadtype', self.currentData.dgcPlatform);
                            form.append('version', self.currentData.versionCode);

                            self.files.forEach(file => {
                                form.append("file", file, file.name);
                            });
                            // 提交调用uploadFile函数
                            gameConfig.uploadFile(form).then(result => {
                                self.files = []
                                if (result.data[0].autoId > 0) {
                                    self.$message({
                                        type: 'success',
                                        message: '上传成功'
                                    })
                                    self.currentData.autoid = result.data[0].autoId
                                } else if (result.data[0].autoId == -999) {
                                    self.$message({
                                        type: 'error',
                                        message: '压缩包中没有log.json文件,不能上传'
                                    })
                                }  else if (result.data[0].autoId == -1000) {
                                    self.$message({
                                        type: 'error',
                                        message: '压缩包中没有log.json文件,不能上传'
                                    })
                                }
                            },error=>{
                            })
                        }
                    } else {
                        self.$message({
                            type: 'error',
                            message: '请先创建该游戏的文件夹'
                        })
                        return
                    }
                }, error => {
                })
            },

            onBeforeUpload (file) {
                // 验证游戏的文件夹是否存在
                const self = this

/*
                gameConfig.getGameFolder(gameId).then(result=>{
                    debugger
                    if(result.data == 0){
                        if (self.currentDialogType == self.dialogType.NEW) {
                            let form = new FormData()
                            form.append('smallgame', gameId)
                            form.append('pn', pn)
                            form.append('type', type)
                            form.append('channelid', channelid)

                            gameConfig.ifExistGameConfig(form).then(result=>{
                                if(result.data.ret == 1){
                                    return true
                                } else {
                                    self.$message({
                                        type: 'error',
                                        message: result.data.desc
                                    })
                                    return false
                                }
                            }, error => {
                            })
                        }
                    } else {
                        self.$message({
                            type: 'error',
                            message: '请先创建该游戏的文件夹'
                        })
                        return false
                    }
                }, error => {
                })*/
            },

            handleUpload (row) {
                this.files.push(row.file);
            },

            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            handleAddFolder() {
                this.createDialogVisible = true
            },
            createFolder() {
                const self = this
                let form = new FormData()
                form.append('c_gameId', self.createData.gameId)
                form.append('m_folderName', self.createData.moduleDdz)

                gameConfig.createFolder(form).then(result => {
                    if(result.data!=null&&result.data==0){
                        self.$message({
                            type: 'success',
                            message: '创建文件成功'
                        })
                        self.createData = {}
                        self.createDialogVisible = false
                    }else if(result.data==-1){
                        self.$message({
                            type: 'error',
                            message: '该游戏已存在该类型文件夹'
                        })
                    }else{
                        self.$message({
                            type: 'error',
                            message: '创建文件夹失败'
                        })
                    }
                }, error => {
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
