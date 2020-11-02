<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getGiftPage"
            @reset-form="resetQueryParam"
            @toggle-panel="handleFilterHandleButtonClick">
            <template slot="form">
                <el-form
                    inline
                    class="filter-form"
                    label-width="6em">
                    <el-form-item class="filter-form-item" label="礼包名称">
                        <el-select
                            size="small"
                            v-model="searchGpId"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in gpList"
                                :key="item.gpId"
                                :label="item.gpName"
                                :value="item.gpId">
                                {{ item.gpName }}
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

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-add"
                @click="doExport">
                导出激活码
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

                    <el-table-column align="center" label="批次" width="200">
                        <template slot-scope="scope">
                            {{ formateGpId(scope.row.gpId) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="创建时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gpAddTime | formatDate}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="礼包名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gpName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="礼包介绍" width="200">
                        <template slot-scope="scope">
                            {{ formatRemark(scope.row.tools) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="有效期" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gpValidTime | formatDate}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="数量" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.gpCount }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="领取类型" width="200">
                        <template slot-scope="scope">
                            {{ formatType(scope.row.gpType) }}
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
            :title="currentDialogType===dialogType.EDIT?'编辑礼包':'新增礼包'"
            width="800px"
            :before-close="handleBeforeCloseEdit"
            @close="handleClose">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left" :rules="rules">

                <el-form-item label="礼包名称" prop="gpName">
                    <el-input v-model="currentData.gpName" placeholder="礼包名称" size="medium"/>
                </el-form-item>

                <el-form-item label="有效期" prop="gpValidDays">
                    <el-input v-model="currentData.gpValidDays" placeholder="有效期"/>
                </el-form-item>

                <el-form-item label="激活码数量" prop="gpCount">
                    <el-input v-model="currentData.gpCount" placeholder="激活码数量"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

                <el-form-item label="使用限制" prop="gpType">
                    <el-radio-group v-model="currentData.gpType">
                        <el-radio :label="1" >一个账号只能使用一个激活码</el-radio>
                        <el-radio :label="2" >一个账号可使用多个激活码</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="可用次数" >
                    <el-input v-model="currentData.gpKeyCount" placeholder="可用次数" :readonly="currentData.gpType == 1"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

            </el-form>

            <div>
                <el-divider></el-divider>
                <span>增加道具</span>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="currentData.gameItemList"
                    >
                    <el-table-column align="center" label="道具">
                        <template slot-scope="scope">
                            <template >
                                <el-select
                                    v-model="scope.row.tolid"
                                    placeholder="请选择"
                                    clearable
                                    filterable>
                                    <el-option
                                        class="role-select-dropdown__item"
                                        v-for="item in gameItems"
                                        :key="item.tolId"
                                        :label="item.tolName"
                                        :value="item.tolId">
                                        {{ item.tolName }}
                                    </el-option>
                                </el-select>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="道具数量">
                        <template slot-scope="scope">
                                <el-input v-model="scope.row.tolnum" class="edit-input"
                                          size="small" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" >
                        <template  slot-scope="scope" >
                            <div>
                                <el-button type="text" size="small" @click="delItem(scope.$index, scope.row)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="width: 100%; margin-top: 16px; margin-bottom: 8px; border: 1px dashed #909399;"
                           icon="el-icon-plus" @click="addItem">新增道具</el-button>
            </div>

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
    import kefu from '@/api/kefu/kefu'
    import game from '@/api/hallgame/game'
    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        gameItemList:[],
        gpType:1,
        gpKeyCount:1
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
                searchGoodsName: '',
                disabled:false,
                searchGpId:'',
                currentData: Object.assign({}, defaultData),
                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                dialogVisible: false,
                dialogType: DialogType,

                dialogSubVisible : false,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息

                gameItems:[],
                gpList : [],
                rules: {
                    gpName :[
                        { required: true, message: '请输入礼包名称', trigger: 'blur' }
                    ],

                    gpValidDays :[
                        { required: true, message: '请输入有效期', trigger: 'blur' }
                    ],
                    gpCount :[
                        { required: true, message: '请输入数量', trigger: 'blur' }
                    ],
                    gpType :[
                        { required: true, message: '请输入类型', trigger: 'blur' }
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
            gameItemsMap () {
                if (this.gameItems.length > 0) {
                    const gameItemsMap = new Map()
                    for (const item of this.gameItems) {
                        gameItemsMap.set(item.tolId, item.tolName)
                    }
                return gameItemsMap
                }
            }
        },
        watch: {
            'currentData.gpType' (newValue, oldValue) {
                if (newValue == 1) {
                    this.$set(this.currentData, 'gpKeyCount', 1)
                } else {
                    this.$set(this.currentData, 'gpKeyCount', 0)
                }
            }
        },
        created () {
            this.getGiftPage()
            this.getAllGameItems()
            this.getAllGift()
        },

        methods: {
            async getGiftPage () {
                const self = this
                self.listLoading = true

                kefu.getGiftPage(self.currentPage, self.pageSize, self.searchGpId).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getAllGift() {
                const res = await kefu.getAllGift()
                this.gpList = res.data.gpList
            },

            async getAllGameItems () {
                const res = await game.getAllGameItems()
                this.gameItems = res.data.tool
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
                if (!self.selectData.gpId) {
                    self.$message({
                        type: 'error',
                        message: '请选择礼包!'
                    })
                    return
                }

                self.$confirm(`确认删除礼包“${self.currentData.gpName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    kefu.deleteGift(self.currentData.gpId).then(result => {
                        self.$message({
                            type: 'success',
                            message: '礼包删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.gpId != self.currentData.gpId
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
                const self = this

                self.currentData.goodsGain.forEach(item => {
                    self.$delete(item,'edit')
                    item.itemName = self.gainItemsMap.get(item.itemIndex)
                })

                self.currentData.goodsExchange.forEach(item => {
                    self.$delete(item,'edit')
                    item.itemName = self.gainItemsMap.get(item.itemIndex)
                })

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
                })
            },
            add () {
                const self = this
                self.currentData.gameItemList.forEach(item => {
                    item.tolname = self.gameItemsMap.get(item.tolid)
                })

                kefu.addGift({
                    'gpName': self.currentData.gpName,
                    'gpValidDays': self.currentData.gpValidDays ? parseInt(self.currentData.gpValidDays) : 0 ,
                    'gpType': self.currentData.gpType  ? self.currentData.gpType : 0 ,
                    'gpCount': self.currentData.gpCount ? parseInt(self.currentData.gpCount) : 0 ,
                    'gpKeyCount': self.currentData.gpKeyCount ? parseInt(self.currentData.gpKeyCount) : 0 ,
                    'gameItemList': self.currentData.gameItemList ? JSON.stringify(self.currentData.gameItemList) : ""
                }).then(result => {
                    const data = result.data
                    if (data.success) {
                        self.dialogVisible = false
                        self.$message({
                            type: 'success',
                            message: '新增礼包成功'
                        })
                        self.getGiftPage()
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
                this.getGiftPage()
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
                    this.getGiftPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getGiftPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getGiftPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getGiftPage()
            },

            formateGpId (value) {
                if(value){
                    while((value+"").length<4){
                    value="0"+value;
                    }
                return value;
                }
            },
            formatType (value) {
                if(value==1){
                    return "单次";
                }else if(value==2){
                    return "多次";
                }else if(value==3){
                    return "激活码多次";
                }
            },

            formatRemark (value){
                let text=""
                const arr=eval(value);
                if (arr) {
                    arr.forEach(item => {
                        text+=item.tolnum+item.tolname+"+";
                    })
                    text=text.substring(0,text.length-1);
                }
                return text
            },
            addItem() {
                this.currentData.gameItemList.push({
                    tolid: 0,
                    tolnum: ''
                })
            },

            delItem (index, row) {
                this.currentData.gameItemList.splice(index, 1);
            },

            doExport(){
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.gpId) {
                    self.$message({
                        type: 'error',
                        message: '请选择礼包!'
                    })
                    return
                }

                self.$confirm(`确认导出该礼包的激活码“${self.currentData.gpName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {

                    this.$ajax.get('/api/gift/export/newgift/key', {
                        params: {gpId:self.currentData.gpId},
                        responseType: 'blob',
                        headers: this.$authInfo
                    }).then(res => {
                        debugger
                        let fileName = "礼包激活码"
                        if (window.navigator.msSaveOrOpenBlob) {
                            navigator.msSaveBlob(res.data, fileName)
                        } else {
                            var link = document.createElement('a')
                            link.href = window.URL.createObjectURL(res.data)
                            link.download = fileName
                            link.click()
                            window.URL.revokeObjectURL(link.href)
                        }
                    })

                }).catch(err => {
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
