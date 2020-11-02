<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getUserInfoPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="用户ID">
                        <el-input size="small"
                                  v-model="searchId"
                                  placeholder="用户ID"
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
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit">
                修改
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-md-person-add"
                @click="findClubInfo">
                查看俱乐部信息
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
                    <el-table-column align="center" label="昵称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.nickName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="用户ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.userId }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="头像" width="200">
                        <template slot-scope="scope">
                            <img :src="scope.row.face" style="height: 50px; width:50px">
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="钻石" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.zuanshi }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="游戏币" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gameMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="vip等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.vipLevel > 0 ?
                            scope.row.vipLevel + "级" + scope.row.vipOverTime + "到期" : "无"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="注册时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.registTime }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="最后登录时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.lastLoginTime }}
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
                     ref="ruleForm" :rules="rules" >

                <el-form-item label="昵称">
                    <el-input v-model="currentData.nickName" placeholder="昵称"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>
                <el-form-item label="ID">
                    <el-input v-model="currentData.userId" placeholder="ID"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>

                <el-form-item label="头像">
                    <img  :src="currentData.face" class="img-info">
                </el-form-item>

                <el-form-item label="钻石">
                    <el-input v-model="currentData.zuanshi" placeholder="钻石"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>

                <el-form-item label="游戏币">
                    <el-input v-model="currentData.gameMoney" placeholder="游戏币"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>

                <el-form-item label="VIP等级">
                    <el-input v-model="currentData.vipLevel" placeholder="VIP等级"/>
                </el-form-item>

                <el-form-item label="到期时间">
                    <el-date-picker
                        v-model="currentData.vipOverTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="修改原因" prop="remark">
                    <el-input v-model="currentData.remark" placeholder="修改原因"/>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="gameDialogVisible=false">取消</el-button>
                <el-button type="primary"  @click="confirm">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="gameDialogVisible1"
            title="个人所在俱乐部查询"
            width="1000px"
        >
            <el-table
                ref="table1"
                class="manage-table"
                header-row-class-name="manage-table-header"
                border
                fit
                highlight-current-row
                :data="tableDatas1"
            >
                <el-table-column align="center" label="俱乐部名称" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.clubName }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="俱乐部ID" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.clubId }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="创建/加入时间" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.joinTime }}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="俱乐部等级" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.clubLevel }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="身份" width="200">
                    <template slot-scope="scope">
                        {{ roleType(scope.row.role) }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'

    import { deepClone } from '@/utils'
    import game from '@/api/hallgame/game'
    import userinfo from '@/api/pyq/userinfo'
    import channel from '@/api/app/channel'
    import app from '@/api/app/app'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
    }

    const defaultGame = {
        activity_status :1,
        activity_type: 1
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
                gameDialogVisible: false,
                gameDialogVisible1: false,


                filterQuery: Object.assign({}, defaultFilterQuery),
                filterGameName: '',
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchId:'',

                currentData: Object.assign({}, defaultGame),
                tableDatas: [],
                tableDatas1:[],
                totalApps:[],
                dialogType: DialogType,
                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                img:'',
                rules: {
                    remark : [
                        { required: true, message: '请输入修改原因', trigger: 'blur' }
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
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
        },

        methods: {
            async getUserInfoPage () {
                const self = this
                if (self.searchId == '') {
                    self.$message({
                        type: 'error',
                        message: '请填写用户Id!'
                    })
                }
                self.listLoading = true
                userinfo.getUserInfoPage(self.currentPage, self.pageSize,self.searchId).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
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
                if (!self.currentData.userId) {
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
             * 删除渠道
             * @param $index
             * @param row
             */
            findClubInfo () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.userId) {
                    self.$message({
                        type: 'error',
                        message: '请选择用户!'
                    })
                    return
                }
                self.gameDialogVisible1 = true
                userinfo.findClubInfo(self.currentData.userId).then(result => {
                    self.listLoading = false
                    self.tableDatas1 = result.data.rows
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
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
                userinfo.putItem({
                    'uid': parseInt(self.currentData.userId),
                    'vipLevel': parseInt(self.currentData.vipLevel),
                    'overTime':self.currentData.vipOverTime,
                    'remark':self.currentData.remark
                }).then(result => {
                    self.gameDialogVisible = false
                    self.selectData = deepClone(self.currentData)
                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                    self.getUserInfoPage()
                }).catch((error) => {
                })
            },
            add () {

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
                    this.getUserInfoPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getUserInfoPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getUserInfoPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getUserInfoPage()
            },
            formatDesc(value){
                if(value == 1){
                    return "图片";
                }else if(value == 2){
                    return "网址";
                }else if(value == 3){
                    return "无";
                }
            },
            handleUploadSuccess(res,file) {
                if (ResultCode.SUCCESS.code === res.code) {
                    this.$Message.success('上传成功')
                    this.img = URL.createObjectURL(file.raw)
                    this.currentData.activityJS_img = res.data
                } else {
                    this.$Message.error('上传失败')
                }
            },

            handleUploadError() {
                this.$Message.error('上传失败')
            },

            roleType(value){
                var str="会员";
                if(value==1){
                    str="创建者";
                }else if(value==1){
                    str="管理员";
                }
                return str;
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

    .img-info {
        width: 60px;
        height: 60px;
        display: block;
    }
</style>
