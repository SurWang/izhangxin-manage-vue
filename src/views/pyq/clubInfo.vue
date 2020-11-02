<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getClubInfoPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="俱乐部ID">
                        <el-input size="small"
                                  v-model="searchClubId"
                                  placeholder="俱乐部ID"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="俱乐部名称">
                        <el-input size="small"
                                  v-model="searchName"
                                  placeholder="俱乐部名称"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="创建者ID">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="创建者ID"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="状态">
                        <el-select
                            size="small"
                            v-model="searchStatus"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            clearable
                        >
                            <el-option class="role-select-dropdown__item" :value="0" label="全部">全部</el-option>
                            <el-option class="role-select-dropdown__item" :value="1" label="正常">正常</el-option>
                            <el-option class="role-select-dropdown__item" :value="2" label="已解散">已解散</el-option>
                            <el-option class="role-select-dropdown__item" :value="3" label="封禁">封禁</el-option>
                        </el-select>
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
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="fengjin">
                封禁
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-md-person-add"
                @click="jiejin">
                解禁
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

                    <el-table-column align="center" label="俱乐部图片" width="200">
                        <template slot-scope="scope">
                            <img :src="scope.row.clubIcon" style="height: 50px; width:50px">
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="创建时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.createTime }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="创建者信息" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.nickName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="俱乐部等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.clubLevel }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="俱乐部基金" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.clubfund }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="俱乐部人数" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.totalNum }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="俱乐部状态" width="200">
                        <template slot-scope="scope">
                            {{ formatterStatus(scope.row.clubStatus) }}
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

                <el-form-item label="俱乐部名称">
                    <el-input v-model="currentData.clubName" placeholder="俱乐部名称"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>
                <el-form-item label="俱乐部ID">
                    <el-input v-model="currentData.clubId" placeholder="俱乐部ID"
                              :disabled="currentDialogType === dialogType.EDIT ? true : false"/>
                </el-form-item>

                <el-form-item label="俱乐部状态">
                    <el-select
                        v-model="currentData.clubStatus"
                        placeholder="俱乐部状态"
                        popper-class="role-select-dropdown"
                        style="width: 93%;"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-option :value="1" label="正常">正常</el-option>
                        <el-option :value="2" label="已解散">已解散</el-option>
                        <el-option :value="3" label="封禁">封禁</el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="俱乐部基金">
                    <el-input v-model="currentData.clubfund" placeholder="俱乐部基金"/>
                </el-form-item>

                <el-form-item label="俱乐部等级">
                    <el-input v-model="currentData.clubLevel" placeholder="俱乐部等级"/>
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

    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'

    import { deepClone } from '@/utils'
    import game from '@/api/hallgame/game'
    import clubinfo from '@/api/pyq/clubinfo'
    import channel from '@/api/app/channel'
    import app from '@/api/app/app'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
        gameName: '' //
    }

    const defaultData = {
        remark:""
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

                searchStatus : 0,
                searchName : '',
                searchClubId:'',
                searchUid:'',

                currentData: Object.assign({}, defaultData),
                tableDatas: [],
                totalApps:[],
                gameDialogVisible: false,
                dialogType: DialogType,
                img:'',

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
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
            this.getClubInfoPage()
        },

        methods: {
            async getClubInfoPage () {
                const self = this
                self.listLoading = true
                clubinfo.getClubInfoPage(self.currentPage, self.pageSize,self.searchStatus,
                self.searchName, self.searchClubId,self.searchUid)
                    .then(result => {
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
                this.currentData = Object.assign({}, defaultData)

                this.currentDialogType = this.dialogType.NEW
                this.gameDialogVisible = true
            },

            handleEdit () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.autoId) {
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
             *
             * @param $index
             * @param row
             */
            fengjin () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                if(self.currentData.clubStatus == 2){
                    self.$message({
                        type: 'error',
                        message: '当前俱乐部已经解散!'
                    })
                    return;
                }
                if(self.currentData.clubStatus == 3){
                    self.$message({
                        type: 'error',
                        message: '当前俱乐部已经是封禁状态!'
                    })
                    return;
                }
                clubinfo.updateStatus(self.currentData.clubId, 3).then(result => {
                    self.$message({
                        type: 'success',
                        message: '封禁成功!'
                    })
                    self.currentData.clubStatus = 3
                    for (let index = 0; index < this.tableDatas.length; index++) {
                        if (this.tableDatas[index].autoId === this.currentData.autoId) {
                            this.tableDatas.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }
                    self.selectData= Object.assign({}, defaultData)
                }, result => {

                })
            },

            /**
             *
             * @param $index
             * @param row
             */
            jiejin () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                if(self.currentData.clubStatus == 2){
                    self.$message({
                        type: 'error',
                        message: '当前俱乐部已经解散!'
                    })
                    return;
                }
                if(self.currentData.clubStatus == 1){
                    self.$message({
                        type: 'error',
                        message: '当前俱乐部已经是正常状态!'
                    })
                    return;
                }
                clubinfo.updateStatus(self.currentData.clubId, 1).then(result => {
                    self.$message({
                        type: 'success',
                        message: '解禁成功!'
                    })
                    self.currentData.clubStatus = 1
                    for (let index = 0; index < this.tableDatas.length; index++) {
                        if (this.tableDatas[index].autoId === this.currentData.autoId) {
                            this.tableDatas.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }
                    self.selectData= Object.assign({}, defaultData)
                }, result => {

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
                debugger
                let form = new FormData()
                form.append("autoId", self.currentData.autoId)
                form.append("clubId", self.currentData.clubId)
                form.append("clubFund", self.currentData.clubfund)
                form.append("vipLevel", self.currentData.clubLevel)
                form.append("clubName", self.currentData.clubName)
                form.append("overTime", self.currentData.vipOverTime)
                form.append("remark", self.currentData.remark)

                clubinfo.updateClub(form).then(result => {
                    debugger
                    self.gameDialogVisible = false

                    self.selectData = deepClone(self.currentData)

                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                    self.getClubInfoPage()
                }).catch((error) => {

                })
            },
            add () {
                const self = this
                const data = {
                    'activityName': self.currentData.activity_title,
                    'beginDate': self.currentData.start_time,
                    'beginDate1':self.currentData.end_time,
                    'activityIcon_img':"1",
                    'au_activityStatus':self.currentData.activity_status,
                    'au_activityType':self.currentData.activity_type,
                    'pn':self.currentData.channelId
                }

                if (self.currentData.activity_type == 1) {
                    data['activityJS_img'] = self.currentData.activityJS_img
                    data['functionName'] = self.currentData.function_name
                    data['paramsValue'] = self.currentData.params_value
                } else if (self.currentData.activity_type == 2) {
                    data['au_activityUrl'] = self.currentData.activity_content
                }

                activity.addItem(data).then(result => {
                    self.gameDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增游戏成功'
                    })
                    self.getClubInfoPage()
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
                    this.getClubInfoPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getClubInfoPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getClubInfoPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getClubInfoPage()
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

            formatterStatus(value){
                var str="正常";
                if(value==2){
                    str="已解散"
                }else if(value==3){
                    str="封禁"
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
</style>
