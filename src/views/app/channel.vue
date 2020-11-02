<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getChannelInfosPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item  class="filter-form-item" label="选择渠道">
                        <el-select
                            style="width: 200px"
                            size="small"
                            v-model=searchChannel
                            :filterable="!$isMobile"
                            placeholder="请选择渠道"
                            filterable
                            @change="getChannelInfosPage"
                        >
                            <el-option
                                v-for="item in channels"
                                :key=item.channelId
                                :label="item.channelName"
                                :value=item.channelId>
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
                @click="handleAddChannel">
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEditChannel">
                编辑
            </el-button>

            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelChannel">
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
                    :data="channelInfos"
                    @row-click="handleSelectChange"
                >
                    <el-table-column align="center" label="渠道ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="渠道名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="子渠道" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelChildStr }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="渠道状态" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.status == 0 ? "有效" : "无效" }}
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
            :visible.sync="channelDialogVisible"
            :title="currentDialogType===dialogType.EDIT?'编辑渠道':'新增渠道'"
            width="600px"
            :before-close="handleBeforeCloseEditChannel">
            <el-form :model="channel" label-width="80px" label-position="left">
                <el-form-item label="名称">
                    <el-input v-model="channel.channelId" placeholder="渠道名称" style="display: none"/>
                    <el-input v-model="channel.channelName" placeholder="渠道名称"/>
                </el-form-item>

                <!--<el-form-item label="子渠道" >
                    <el-select
                        v-model="channel.subChannelIds"
                        placeholder="请选择子渠道"
                        multiple
                        filterable
                        style="width: 100%;"
                        popper-class="role-select-dropdown">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in channelInfos"
                            :key="item.channelId"
                            :label="item.channelName"
                            :value="item.channelId">
                            {{ item.channelName }}
                        </el-option>
                    </el-select>
                </el-form-item>-->
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="channelDialogVisible=false">取消</el-button>
                <el-button type="primary" :disabled="isConfirmDisabled" @click="confirmChannel">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'

    import { deepClone } from '@/utils'
    import channel from '@/api/app/channel'
    import waves from '@/directive/waves'
    import moment from "moment"; // waves directive

    const defaultFilterQuery = {
        channelName: '' //
    }

    const defaultChannel = {
        channelId: 0,
        channelName: '',
        subChannelIds:[],
        createTime:0
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
                isUpdateChannel: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,

                filterQuery: Object.assign({}, defaultFilterQuery),
                filterChannelName: '',
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,


                searchChannel: 0,
                channel: Object.assign({}, defaultChannel),
                channelInfos: [],

                channelDialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                currentChannel: Object.assign({}, defaultChannel), // 当前选中的渠道信息
                channels:[]
            }
        },
        computed: {
            isConfirmDisabled () {
                if (this.channel.channelName && this.channel.channelName.trim().length > 0) {
                    // 渠道名称不为空的时候，在判断用户名是否修改或者是否修改了渠道信息
                    return !(this.isUpdateChannel)
                } else {
                    // 渠道必须要有名称，不可以为空
                    return true
                }
            }
        },
        watch: {
            'channel.channelName' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdateChannel = newValue !== this.currentChannel.channelName
                } else {
                    // 新增的时候，
                    this.isUpdateChannel = newValue && newValue.trim().length > 0
                }
            },

            'channel.subChannelIds' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdateChannel = newValue !== this.currentChannel.channelName
                } else {
                    // 新增的时候，
                    this.isUpdateChannel = newValue && newValue.length > 0
                }
            }
        },
        created () {
            // Mock: get all routes and roles list from server
            // this.getRoutes()
            this.getChannelInfosPage()
            this.getChannels()
        },

        methods: {
            async getChannelInfosPage () {

                const self = this
                self.listLoading = true

                channel.getChannelInfosPage(self.currentPage, self.pageSize, self.searchChannel).then(result => {
                    self.listLoading = false
                    self.channelInfos = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getChannels() {
                const res = await channel.getChannels()
                this.channels = res.data
                this.channels.unshift({channelId:0,channelName:'全部'});
            },

            handleSelectChange (row) {
                const self = this
                self.currentChannel = deepClone(row)
            },
            handleAddChannel () {
                this.channel = Object.assign({}, defaultChannel)

                this.currentDialogType = this.dialogType.NEW
                this.channelDialogVisible = true
            },

            handleEditChannel () {
                const self = this
                self.channel = deepClone(self.currentChannel)
                if (self.channel.channelId <= 0) {
                    self.$message({
                        type: 'error',
                        message: '请选择渠道!'
                    })
                    return
                }

                // 重置保存状态
                self.isUpdateChannel = false
                self.currentDialogType = this.dialogType.EDIT

                self.channelDialogVisible = true

            },
            /**
             * 删除渠道
             * @param $index
             * @param row
             */
            handleDelChannel () {
                const self = this
                self.channel = deepClone(self.currentChannel)
                if (self.channel.channelId <= 0) {
                    self.$message({
                        type: 'error',
                        message: '请选择渠道!'
                    })
                    return
                }

                self.$confirm(`确认删除渠道“${self.channel.channelName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    channel.deleteChannel({
                        'channelId': self.channel.channelId,
                        'channelName': self.channel.channelName,
                        'status': 1
                    }).then(result => {
                        self.$message({
                            type: 'success',
                            message: '渠道删除成功!'
                        })
                        self.channel.status = 1
                        for (let index = 0; index < self.channelInfos.length; index++) {
                            if (self.channelInfos[index].channelId === self.channel.channelId) {
                                self.channelInfos.splice(index, 1, Object.assign({}, self.channel))
                                break
                            }
                        }
                        self.currentChannel= Object.assign({}, defaultChannel)
                    }, result => {
                        self.$message({
                            type: 'error',
                            message: result.message
                        })
                    })

                }).catch(err => {
                })
            },

            async confirmChannel () {
                const isEdit = this.currentDialogType === this.dialogType.EDIT
                if (isEdit) {
                    this.updateChannel()
                } else {
                    this.addChannel()
                }
            },
            updateChannel () {
                const self = this

                const { channelId, channelName} = self.channel
                channel.putChannel({
                    'channelId': channelId,
                    'channelName': channelName,
                    'status': 0
                }).then(result => {
                    self.channelDialogVisible = false
                    for (let index = 0; index < this.channelInfos.length; index++) {
                        if (this.channelInfos[index].channelId === this.channel.channelId) {
                            this.channelInfos.splice(index, 1, Object.assign({}, self.channel))
                            break
                        }
                    }
                    self.currentChannel = deepClone(self.channel)

                    self.$message({
                        type: 'success',
                        message: '修改渠道信息成功'
                    })
                }).catch((error) => {
                    self.$message({
                        type: 'error',
                        message: error.message
                    })
                })
            },
            addChannel () {
                const self = this
                channel.addChannel({
                    'channelId': -1,
                    'channelName': self.channel.channelName,
                    'status': 0,
                }).then(result => {

                    self.channelDialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增渠道成功'
                    })
                    self.getChannelInfosPage()
                }).catch(error => {
                })
            },

            resetQueryParam () {
                this.filterQuery.channelName = ""
                this.filterChannelName = ""
            },

            handleFilter () {
                this.filterQuery.channelName = this.filterChannelName

            },

            handleBeforeCloseEditChannel (done) {
                //
                if (!this.isConfirmDisabled) {
                    this.$confirm('您修改了渠道信息，是否需要保存?', '确认', {
                        confirmButtonText: '保存',
                        cancelButtonText: '不保存',
                        type: 'warning'
                    }).then(_ => {
                        // 需要保存
                        this.confirmChannel()

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
                    this.getChannelInfosPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getChannelInfosPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getChannelInfosPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getChannelInfosPage()
            },

            getChannelName :function(value) {
                const self = this
                let channelNames = ""
                if (value.length === 0) {
                    return channelNames
                }

                const arr = self.channelInfos.filter(item => {
                    if (value.indexOf(item.channelId) !== -1) {
                        return item.channelName
                    }
                })

                for (const channel of arr) {
                    channelNames += channel.channelName
                    channelNames += ","
                }
                return channelNames
            }
        },
        filters: {
            formatDate: function (value) {
                return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            },

            formateSubName :function (value) {
                const self = this
                let channelNames = ""
                if (value.length === 0) {
                    return channelNames
                }

                for (let id in value) {
                    const arr = self.channelInfos.filter(function (item) {
                        if (item.channelId === id) {
                            return item.channelName
                        }
                    })
                    channelNames += arr[0]
                    channelNames += ","
                }
                return channelNames
            }
        }
    }
</script>

