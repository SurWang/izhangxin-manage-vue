<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getGameItemPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="道具名称">
                        <el-select
                            size="small"
                            v-model="searchGameid"
                            placeholder="请选择道具"
                            clearable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            @change="getGameItemPage"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in allGameItems"
                                :key="item.tolId"
                                :label="item.tolName"
                                :value="item.tolId">
                                {{ item.tolName }}
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

                    <el-table-column align="center" label="道具id" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.tolId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="道具名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.tolName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="图片地址" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.tolUrl }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="兑换比例" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.itemScale }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="过期时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.expiredDays }}
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
            :title="currentDialogType===dialogType.EDIT?'编辑道具':'新增道具'"
            width="800px"
            :before-close="handleBeforeCloseEdit"
            @close="handleClose">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left" :rules="rules">
                <el-form-item label="选择游戏" >
                    <el-select
                        v-model="currentData.gameId"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false">
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

                <el-form-item label="道具id" prop="tolId">
                    <el-input v-model="currentData.tolId" placeholder="道具id" size="medium"/>
                </el-form-item>

                <el-form-item label="道具名称" prop="tolName">
                    <el-input v-model="currentData.tolName" placeholder="道具名称" size="medium"/>
                </el-form-item>

                <el-form-item label="上传图片" >
                    <el-upload
                        class="img-uploader"
                        action="/api/upload/img/info"
                        :headers="this.$authInfo"
                        :show-file-list="false"
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError">
                        <img v-if="img" :src="img" class="img-info">
                        <el-button v-else size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="兑换比例">
                    <el-input v-model="currentData.itemScale" placeholder="兑换比例"/>
                </el-form-item>
                <el-form-item label="过期时间">
                    <el-input v-model="currentData.expiredDays" placeholder="过期时间"/>
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
                searchGameid: '',
                disabled:false,

                currentData: Object.assign({}, defaultData),
                tableDates: [],
                allGameItems: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                dialogVisible: false,
                dialogType: DialogType,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息
                mainGameInfos : [],
                rules: {
                    tolId :[
                        { required: true, message: '请输入道具ID', trigger: 'blur' }
                    ],
                    tolName :[
                        { required: true, message: '请输入道具名称', trigger: 'blur' }
                    ]
                },
            }
        },
        computed: {

        },
        watch: {

        },
        created () {
            this.getGameItemPage()
            this.getMainGame()
            this.getAllGameItems()
        },

        methods: {
            async getGameItemPage () {
                const self = this
                self.listLoading = true

                game.getGameItemPage(self.currentPage, self.pageSize, self.searchGameid).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getMainGame () {
                const res = await game.getMainGame()
                this.mainGameInfos = res.data.maingames
            },

            async getAllGameItems () {
                const res =  await game.getAllGameItems()
                this.allGameItems = res.data.tool
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
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.tolId) {
                    self.$message({
                        type: 'error',
                        message: '请选择道具!'
                    })
                    return
                }

                self.$confirm(`确认删除道具“${self.currentData.tolName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    game.delGameItem(self.currentData.tolId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '道具删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.tolId != self.currentData.tolId
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
                game.addGameItem({
                    'tolId': self.currentData.tolId,
                    'tolName': self.currentData.tolName,
                    'tolUrl': self.currentData.tolUrl ? self.currentData.tolUrl : "",
                    'gameId': self.currentData.gameId ? self.currentData.gameId : -1,
                    'itemScale': self.currentData.itemScale ? self.currentData.itemScale : 0,
                    'expiredDays': self.currentData.expiredDays ? self.currentData.expiredDays : 0
                }).then(result => {
                    const data = result.data
                    self.tableDates.push(data)

                    self.dialogVisible = false
                    self.img = ''
                    self.$message({
                        type: 'success',
                        message: '新增道具成功'
                    })
                }).catch(error => {
                })
            },

            resetQueryParam () {
                this.getGameItemPage()
            },

            handleClose () {
                this.img = ""
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
                    this.getGameItemPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getGameItemPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getGameItemPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getGameItemPage()
            },

            handleUploadSuccess(res,file) {
                if (ResultCode.SUCCESS.code === res.code) {
                    this.$Message.success('上传成功')
                    this.img = URL.createObjectURL(file.raw)
                    this.currentData.tolUrl = res.data
                } else {
                    this.$Message.error('上传失败')
                }
            },

            handleUploadError() {
                this.$Message.error('上传失败')
            },

            formatRemark (value){
                let text=""
                const arr=eval(value);
                $.each(arr, function (n, value) {
                    text+=value.tolnum+value.tolname+"+";
                });
                if (text.length>26){
                    text=text.substring(0,text.length-1);
                }
                return text
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
