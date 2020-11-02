<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getActivityPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="活动标题">
                        <el-input size="small"
                                  v-model="searchName"
                                  placeholder="活动标题"
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
                            <el-option class="role-select-dropdown__item" :value="1" label="运行中">运行中</el-option>
                            <el-option class="role-select-dropdown__item" :value="2" label="下线">下线</el-option>

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
                    <el-table-column align="center" label="渠道" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="活动标题" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.activity_title }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="活动开始时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.start_time }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="活动结束时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.end_time }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="活动图标" width="200">
                        <template slot-scope="scope">
                            <img :src="scope.row.activity_icon" style="width: 50px;height: 50px">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="活动内容" width="200">
                        <template slot-scope="scope">
                            {{ formatDesc(scope.row.activity_type) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="活动状态" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.activity_status == 1 ? "运行中" : "下线" }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="函数名" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.function_name }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="参数值" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.params_value }}
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
                <el-form-item label="渠道" >
                    <el-select
                        v-model="currentData.channelId"
                        placeholder="请选择渠道"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in totalApps"
                            :key="item.pn"
                            :label="item.appname"
                            :value="item.pn">
                            {{ item.appname }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动标题">
                    <el-input v-model="currentData.activity_title" placeholder="活动标题"/>
                </el-form-item>
                <el-form-item label="活动开始时间">
                    <el-date-picker
                        v-model="currentData.start_time"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动结束时间">
                    <el-date-picker
                        v-model="currentData.end_time"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                        @focus="clickEndTime">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="活动标题图片">
                    <el-upload
                        class="img-uploader"
                        action="/api/tencentcloud/upload/imageFile"
                        :headers="this.$authInfo"
                        :data="{
                                fileType:'image',
                                gameId:0
                            }"
                        :show-file-list="false"
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError">
                        <img v-if="currentData.activity_icon" :src="currentData.activity_icon" class="img-info">
                        <el-button v-else size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="活动类型">
                    <el-select
                        v-model="currentData.activity_type"
                        placeholder="活动类型"
                        popper-class="role-select-dropdown"
                        style="width: 93%;">
                        <el-option :value="1" label="图片类型">图片类型</el-option>
                        <el-option :value="2" label="H5网页类型">H5网页类型</el-option>
                        <el-option :value="3" label="无互动仅展示类型">无互动仅展示类型</el-option>
                    </el-select>
                </el-form-item>

                <template v-if="currentData.activity_type == 1">
                    <el-form-item label="活动内容">
                        <el-upload
                            class="img-uploader"
                            action="/api/tencentcloud/upload/imageFile"
                            :headers="this.$authInfo"
                            :data="{
                                fileType:'image',
                                gameId:0
                            }"
                            :show-file-list="false"
                            :on-success="handleUploadSuccess1"
                            :on-error="handleUploadError">
                            <img v-if="currentData.activity_content" :src="currentData.activity_content" class="img-info">
                            <el-button v-else size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="函数名">
                        <el-input v-model="currentData.function_name" placeholder="函数名"/>
                    </el-form-item>
                    <el-form-item label="参数">
                        <el-input v-model="currentData.params_value" placeholder="参数"/>
                    </el-form-item>
                </template>

                <template v-if="currentData.activity_type == 2">
                    <el-form-item label="活动内容">
                        <el-input v-model="currentData.activity_content" placeholder="活动内容"/>
                    </el-form-item>
                </template>

                <el-form-item label="活动状态">
                    <el-select
                        v-model="currentData.activity_status"
                        placeholder="活动状态"
                        popper-class="role-select-dropdown"
                        style="width: 93%;">
                        <el-option :value="1" label="运行">运行</el-option>
                        <el-option :value="2" label="下线">下线</el-option>
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
    import {ResultCode} from '@/api/ResultCode'

    import game from '@/api/hallgame/game'
    import activity from '@/api/pyq/activity'
    import channel from '@/api/app/channel'
    import app from '@/api/app/app'

    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
        gameName: '' //
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

                filterQuery: Object.assign({}, defaultFilterQuery),
                filterGameName: '',
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                searchStatus : 0,
                searchName : '',

                currentData: Object.assign({}, defaultGame),
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
                },
                pickerOptions: {}
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
            this.getActivityPage()
            this.getTotalApps()
        },

        methods: {
            async getActivityPage () {
                const self = this
                self.listLoading = true
                activity.getActivityPage(self.currentPage, self.pageSize,self.searchStatus,
                self.searchName).then(result => {
                    self.listLoading = false
                    self.tableDatas = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getTotalApps () {
                const res = await app.getTotalApps("","")
                this.totalApps = res.data
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
                if (!self.currentData.list_id) {
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
            handleDel () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.list_id) {
                    self.$message({
                        type: 'error',
                        message: '请选择游戏!'
                    })
                    return
                }

                self.$confirm(`确认删除游戏“${self.currentData.activity_title}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    activity.deleteItem(self.currentData.list_id).then(result => {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        self.tableDatas = self.tableDatas.filter(item => {
                            return item.list_id != self.currentData.list_id
                        })
                        self.selectData= Object.assign({}, defaultGame)
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

                if(self.currentData.activity_type == 1 && !self.currentData.activity_icon){
                    self.$message({
                        type: 'error',
                        message: "请上传活动图片"
                    })
                    return;
                }else if(self.currentData.activity_type == 2 && !self.currentData.activity_content){
                    self.$message({
                        type: 'error',
                        message: "请填写活动URL"
                    })
                    return;
                }


                const data = {
                    'activityName': self.currentData.activity_title,
                    'beginDate': self.currentData.start_time,
                    'beginDate1':self.currentData.end_time,
                    'activityIcon_img':self.currentData.activity_icon,
                    'au_activityStatus':self.currentData.activity_status,
                    'au_activityType':self.currentData.activity_type,
                    'pn':self.currentData.channelId,
                    'listId':self.currentData.list_id
                }

                if (self.currentData.activity_type == 1) {
                    data['activityJS_img'] = self.currentData.activity_content
                    data['functionName'] = self.currentData.function_name
                    data['paramsValue'] = self.currentData.params_value
                } else if (self.currentData.activity_type == 2) {
                    data['au_activityUrl'] = self.currentData.activity_content
                }
                activity.putItem(data).then(result => {
                    self.gameDialogVisible = false

                    self.selectData = deepClone(self.currentData)

                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                    self.getActivityPage()
                }).catch((error) => {

                })
            },
            add () {
                const self = this

                if(self.currentData.activity_type == 1 && !self.currentData.activity_icon){
                    self.$message({
                        type: 'error',
                        message: "请上传活动图片"
                    })
                    return;
                }else if(self.currentData.activity_type == 2 && !self.currentData.activity_content){
                    self.$message({
                        type: 'error',
                        message: "请填写活动URL"
                    })
                    return;
                }

                const data = {
                    'activityName': self.currentData.activity_title,
                    'beginDate': self.currentData.start_time,
                    'beginDate1':self.currentData.end_time,
                    'activityIcon_img':self.currentData.activity_icon,
                    'au_activityStatus':self.currentData.activity_status,
                    'au_activityType':self.currentData.activity_type,
                    'pn':self.currentData.channelId
                }

                if (self.currentData.activity_type == 1) {
                    data['activityJS_img'] = self.currentData.activity_content
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
                    self.getActivityPage()
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
                    this.getActivityPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getActivityPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getActivityPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getActivityPage()
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
                    this.$set(this.currentData, 'activity_icon', res.data[0].fileurl)
                } else {
                    this.$Message.error('上传失败')
                }
            },

            handleUploadSuccess1(res,file) {
                if (ResultCode.SUCCESS.code === res.code) {
                    this.$Message.success('上传成功')
                    this.$set(this.currentData, 'activity_content', res.data[0].fileurl)
                } else {
                    this.$Message.error('上传失败')
                }
            },

            handleUploadError() {
                this.$Message.error('上传失败')
            },

            clickEndTime() {
                this.pickerOptions.disabledDate = time => {
                    if (this.currentData.start_time) {
                        return (
                            time.getTime() > Date.now || time.getTime() < new Date(this.currentData.start_time).getTime()
                        )
                    } else {
                        return time.getTime() < Date.now()
                    }
                }
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
        width: 120px;
        height: 80px;
        display: block;
    }
</style>
