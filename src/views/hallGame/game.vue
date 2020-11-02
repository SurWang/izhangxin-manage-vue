<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getGameInfosPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="是否主游戏">
                        <el-select
                            size="small"
                            v-model="searchMain"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option class="role-select-dropdown__item" value="0" label="否">否</el-option>
                            <el-option class="role-select-dropdown__item" value="1" label="是">是</el-option>
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
                @click="handleAddGame">
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelGame">
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
                    :data="gameInfos"
                    @row-click="handleSelectChange"
                >
                    <el-table-column align="center" label="游戏ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gameId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="游戏名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gameName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="游戏类型" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gameStatus == 1 ? "主游戏" : "子游戏" }}
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
            :title="currentDialogType===dialogType.EDIT?'编辑游戏':'新增游戏'"
            width="600px"
            >
            <el-form :model="game" label-width="120px" label-position="left">
                <el-form-item label="ID">
                    <el-input v-model="game.gameId" placeholder="游戏Id"/>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="game.gameName" placeholder="游戏名称"/>
                </el-form-item>

                <el-form-item label="是否本地棋牌">
                    <el-radio-group v-model="game.isLocal">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                    </el-radio-group>
                </el-form-item>


                <el-form-item label="是否主游戏">
                    <el-radio-group v-model="game.gameStatus">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <div v-if="game.gameStatus == 1 ? true : false">
                    <el-form-item label="版本">
                        <el-input v-model="game.version" placeholder="版本"/>
                    </el-form-item>

                    <el-form-item label="是否创建子游戏">
                        <el-radio-group v-model="subGameFlag">
                            <el-radio :label="1" >是</el-radio>
                            <el-radio :label="0" >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>

                <div v-if="showSubGame">
                    <el-form-item label="子游戏ID">
                        <el-input v-model="game.subGameId" placeholder="子游戏Id"/>
                    </el-form-item>
                    <el-form-item label="子游戏名称">
                        <el-input v-model="game.subGameName" placeholder="子游戏名称"/>
                    </el-form-item>
                </div>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="gameDialogVisible=false">取消</el-button>
                <el-button type="primary"  @click="confirmGame">保存</el-button>
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
    import game from '@/api/hallgame/game'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
        gameName: '' //
    }

    const defaultGame = {
        gameStatus:0
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

                searchMain : '',

                game: Object.assign({}, defaultGame),
                gameInfos: [],

                gameDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                currentGame: Object.assign({}, defaultGame),// 当前选中的渠道信息

                subGameFlag:0

            }
        },
        computed: {
            isConfirmDisabled () {
                if (this.game.gameName && this.game.gameName.trim().length > 0) {
                    // 渠道名称不为空的时候，在判断用户名是否修改或者是否修改了渠道信息
                    return !(this.isUpdateGame)
                } else {
                    // 渠道必须要有名称，不可以为空
                    return true
                }
            },

            showSubGame () {
                if (this.game.gameStatus === 1 && this.subGameFlag === 1) {
                    return true
                } else {
                    return false
                }
            }
        },
        watch: {
            'game.gameName' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdateGame = newValue !== this.currentGame.gameName
                } else {
                    // 新增的时候，
                    this.isUpdateGame = newValue && newValue.trim().length > 0
                }
            }
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
            this.getGameInfosPage()
        },

        methods: {
            async getGameInfosPage () {
                const self = this
                self.listLoading = true

                game.getGameInfosPage(self.currentPage, self.pageSize,self.searchMain).then(result => {
                    self.listLoading = false
                    self.gameInfos = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            handleSelectChange (row) {
                const self = this
                self.currentGame = deepClone(row)
            },
            handleAddGame () {
                this.game = Object.assign({}, defaultGame)

                this.currentDialogType = this.dialogType.NEW
                this.gameDialogVisible = true
            },

            handleEditGame () {
                const self = this
                self.game = deepClone(self.currentGame)
                if (self.game.gameId <= 0) {
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

            },
            /**
             * 删除渠道
             * @param $index
             * @param row
             */
            handleDelGame () {
                const self = this
                self.game = deepClone(self.currentGame)
                if (self.game.gameId <= 0) {
                    self.$message({
                        type: 'error',
                        message: '请选择游戏!'
                    })
                    return
                }

                self.$confirm(`确认删除游戏“${self.game.gameName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    game.delGame(self.game.gameId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '游戏删除成功!'
                        })
                        self.gameInfos = self.gameInfos.filter(item => {
                            return item.gameId != self.game.gameId
                        })
                        self.currentGame= Object.assign({}, defaultGame)
                    }, result => {

                    })

                }).catch(err => {
                })
            },

            async confirmGame () {
                const isEdit = this.currentDialogType === this.dialogType.EDIT
                if (isEdit) {
                    this.updateGame()
                } else {
                    this.addGame()
                }
            },
            updateGame () {
                const self = this
                const { gameId, gameName, version, gameStatus} = self.game
                game.putGame({
                    'gameId': gameId,
                    'gameName': gameName,
                    'version':version,
                    'gameStatus':gameStatus
                }).then(result => {
                    self.gameDialogVisible = false
                    for (let index = 0; index < this.gameInfos.length; index++) {
                        if (this.gameInfos[index].gameId === this.game.gameId) {
                            this.gameInfos.splice(index, 1, Object.assign({}, self.game))
                            break
                        }
                    }

                    self.currentGame = deepClone(self.game)

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

            addGame () {
                const self = this

                let form = new FormData()
                form.append('gameId', self.game.gameId)
                form.append('gameName', self.game.gameName)
                form.append('gameStatus', self.game.gameStatus)
                form.append('chirldStatus', self.subGameFlag)
                form.append('chirldgameId', self.game.subGameId ? self.game.subGameId : "")
                form.append('chirldgamename', self.game.subGameName ? self.game.subGameName : "")
                form.append('pversion', self.game.version ? self.game.version: "")
                form.append('isLocal', self.game.isLocal)

                game.addGame(form).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增游戏成功'
                    })
                    self.getGameInfosPage()
                }).catch(error => {
                })
            },
            resetQueryParam () {
                this.filterQuery.gameName = ""
                this.filterGameName = ""

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
                    this.getGameInfosPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getGameInfosPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getGameInfosPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getGameInfosPage()
            },
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
