<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getAccountPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="用户UID">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="用户UID"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getAccountPage">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="手机号">
                        <el-input size="small"
                                  v-model="searchPhone"
                                  placeholder="手机号"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="查询类型">
                        <el-select
                            size="small"
                            v-model="searchType"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            clearable
                            filterable
                        >
                            <el-option class="role-select-dropdown__item" :value="1" label="未绑定">未绑定</el-option>
                            <el-option class="role-select-dropdown__item" :value="2" label="已绑定">已绑定</el-option>

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
                icon="el-icon-edit"
                @click="handleEdit">
                修改昵称
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="handleExitVIP">
                转移VIP
            </el-button>

            <el-button
                v-if="searchType == 1"
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="delCode">
                解除特惠码
            </el-button>

            <el-button
                v-if="searchType == 2"
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="exitPhone">
                解绑手机
            </el-button>

            <el-button
                v-if="searchType == 2"
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="setPhoneIzhangxin">
                设置手机为掌心账号
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

                    <el-table-column align="center" label="UID" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.aUid }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="账号" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.aAccount }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="昵称" width="150">
                        <template slot-scope="scope" >
                            {{ scope.row.aNickName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="VIP经验" >
                        <template slot-scope="scope">
                            {{ scope.row.aVipDays }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center"  label="开通日期" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aPurchaseDate }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="到期日期" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.aDueDate }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="VIP等级" >
                        <template slot-scope="scope">
                            {{ scope.row.avipLevel  }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="特惠码" width="200" v-if="this.searchType == 1">
                        <template slot-scope="scope">
                            {{ scope.row.aCode }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手机号" width="200" v-else>
                        <template slot-scope="scope">
                            {{ scope.row.aPhone }}
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
            title="修改昵称"
            width="800px">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left"  >

                <el-form-item label="UID" >
                    {{ currentData.aUid }}
                </el-form-item>
                <el-form-item label="账号">
                    {{ currentData.aAccount }}
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="currentData.aNickName" placeholder="昵称"/>
                </el-form-item>
                <el-form-item label="VIP经验">
                    {{ currentData.aVipDays }}
                </el-form-item>
                <el-form-item label="开通日期">
                    {{ currentData.aPurchaseDate }}
                </el-form-item>
                <el-form-item label="到期日期">
                    {{ currentData.aDueDate }}
                </el-form-item>
                <el-form-item label="VIP等级">
                    {{ currentData.avipLevel }}
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="update">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible1"
            title="转移VIP"
            width="800px">
            <el-form label-width="100px" label-position="left"  >

                <el-form-item label="转移至该用户ID">
                    <el-input v-model="exitVipUid" placeholder="转移至该用户ID"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible1=false">取消</el-button>
                <el-button type="primary" @click="exitVIP">保存</el-button>
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
    import account from '@/api/account/account'
    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
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
                dialogVisible:false,
                dialogVisible1:false,

                dialogType: DialogType,
                currentDialogType: DialogType.NEW,
                searchUid : '',
                searchPhone:'',
                searchType : 1,
                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,
                selectData: {}, // 当前选中的信息
                currentData: {},
                exitVipUid:''
            }
        },
        computed: {

        },
        watch: {

        },
        created () {
        },

        methods: {
            async getAccountPage () {
                const self = this

                if(self.searchType == 1){
                    if (!self.searchUid) {
                        self.$message({
                            type: 'error',
                            message: '请输入用户ID!'
                        })
                        return
                    }
                }else if(self.searchType == 2){
                    if (!self.searchUid && !self.searchPhone) {
                        self.$message({
                            type: 'error',
                            message: '请输入用户ID或者手机号!'
                        })
                        return
                    }
                }

                self.listLoading = true
                account.getBindAccountPage(self.currentPage, self.pageSize,
                    self.searchUid, self.searchPhone, self.searchType).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.rows
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

            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
            },

            resetQueryParam () {
                this.searchUid = ""
                this.getPayLogPage()
            },


            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function (flag) {
                // 当关闭面板时查询数据
                if (!flag) {
                    this.getAccountPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getAccountPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getAccountPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getAccountPage()
            },

            handleEdit () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.aUid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }
                // 重置保存状态
                self.isUpdate = false
                self.dialogVisible = true
                self.currentDialogType = this.dialogType.EDIT
            },

            handleExitVIP () {
                const self = this

                if (!self.selectData.aUid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }
                if (self.selectData.aVipDays <= 0 && self.selectData.avipLevel <= 0 ) {
                    self.$message({
                        type: 'error',
                        message: '该账号不是VIP!'
                    })
                    return
                }
                self.currentData = deepClone(self.selectData)
                self.dialogVisible1 = true
                // 重置保存状态
                self.exitVipUid = ''
            },

            update () {
                const self = this
                let form = new FormData()

                form.append('uid', self.currentData.aUid)
                form.append('nickname', self.currentData.aNickName)

                account.executeAccount(form).then(result => {
                    self.dialogVisible = false
                    for (let index = 0; index < this.tableDates.length; index++) {
                        if (this.tableDates[index].aUid === this.currentData.aUid) {
                            this.tableDates.splice(index, 1, Object.assign({}, self.currentData))
                            break
                        }
                    }
                    self.selectData = deepClone(self.currentData)
                    self.$message({
                        type: 'success',
                        message: '修改信息成功'
                    })
                }).catch((error) => {
                })
            },

            delCode () {
                const self = this

                if (!self.selectData.aUid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }
                self.currentData = deepClone(self.selectData)
                let form = new FormData()
                debugger
                form.append('uid', self.currentData.aUid)
                self.$confirm(`确认解除特惠码“${self.currentData.aUid}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    account.delCode(form).then(result => {
                        if (result.data == 1) {
                            self.$message({
                                type: 'success',
                                message: '解除成功!'
                            })
                            self.selectData= {}
                            self.getAccountPage()
                        } else {
                            self.$message({
                                type: 'error',
                                message: '解除失败!'
                            })
                        }
                    }, error => {
                        console.log(error)
                    })
                }).catch(err => {
                })
            },

            /**
             * 转移VIP
             */
            exitVIP(){
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.aUid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                if (self.selectData.aVipDays <= 0 && self.selectData.avipLevel <= 0 ) {
                    self.$message({
                        type: 'error',
                        message: '该账号不是VIP!'
                    })
                    return
                }

                if (self.selectData.aUid == self.exitVipUid) {
                    self.$message({
                        type: 'error',
                        message: '不能转移到同一个账户!'
                    })
                    return
                }

                let form = new FormData()
                form.append('uid', self.currentData.aUid)
                form.append('nuid', self.exitVipUid)

                account.executeVip(form).then(result => {
                    if (result.data == 0) {
                        self.$message({
                            type: 'success',
                            message: '转移成功!'
                        })
                        self.selectData= {}
                        self.getAccountPage()
                        self.dialogVisible = false

                    } else {
                        self.$message({
                            type: 'error',
                            message: '转移失败!'
                        })
                    }
                }, error => {
                })
            },

            exitPhone(){
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.aUid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                if (!self.selectData.aPhone) {
                    self.$message({
                        type: 'error',
                        message: '该账号未绑定手机!'
                    })
                    return
                }

                let form = new FormData()
                form.append('uid', self.currentData.aUid)
                account.executeAccount(form).then(result => {
                    if (result.data == 0) {
                        self.$message({
                            type: 'success',
                            message: '解绑成功!'
                        })
                        self.selectData= {}
                        self.getAccountPage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: '解绑失败!'
                        })
                    }
                }, error => {
                })
            },

            setPhoneIzhangxin() {
                const self = this
                self.currentData = deepClone(self.selectData)
                debugger
                if (!self.selectData.aUid) {
                    self.$message({
                        type: 'error',
                        message: '请选择!'
                    })
                    return
                }

                if (!self.selectData.aPhone) {
                    self.$message({
                        type: 'error',
                        message: '该账号未绑定手机!'
                    })
                    return
                }

                let form = new FormData()
                form.append('phone', self.currentData.aPhone)
                account.updAccountBind(form).then(result => {
                    if (result.data.ret == 0) {
                        self.$message({
                            type: 'success',
                            message: result.data.msg
                        })
                        self.selectData= {}
                        self.getAccountPage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: result.data.msg
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
