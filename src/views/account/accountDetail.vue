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
                    <el-form-item class="filter-form-item" label="账号UID">
                        <el-input size="small"
                                  v-model="searchUid"
                                  placeholder="账号UID"
                                  style="width: 200px;"
                                  clearable
                                  @keydown.prevent.enter.native="getAccountPage"
                                  onkeyup="value=value.replace(/[^(\d-)]/g,'')">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="账号名">
                        <el-input size="small"
                                  v-model="searchAccount"
                                  placeholder="账号名"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="昵称">
                        <el-input size="small"
                                  v-model="searchName"
                                  placeholder="昵称"
                                  style="width: 200px;"
                                  clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="查询类型">
                        <el-select
                            size="small"
                            v-model="searchStatus"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            clearable
                            filterable
                        >
                            <el-option class="role-select-dropdown__item" :value="-1" label="全部">全部</el-option>
                            <el-option class="role-select-dropdown__item" :value="0" label="正常">正常</el-option>
                            <el-option class="role-select-dropdown__item" :value="1" label="屏蔽">屏蔽</el-option>

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
                修改
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                @click="accountDetail">
                详细信息
            </el-button>
            <el-button
                class="operate-button"
                type="primary"
                size="small"
                @click="handleBindSpread">
                绑定推广码
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                @click="unBindSpread">
                解绑推广码
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

                    <el-table-column align="center" label="账号名" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.aAccount }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="UID" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.aUid }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="昵称" width="150">
                        <template slot-scope="scope" >
                            {{ scope.row.aNickName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="性别" >
                        <template slot-scope="scope">
                            {{ scope.row.aSex == 0 ? "女" : "男"}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center"  label="注册时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aRegTimeStr }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="设备" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.aRegImei }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="状态" >
                        <template slot-scope="scope">
                            {{ scope.row.aStatus == 0 ? "正常" :"屏蔽" }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="封号时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aForbidTime }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="设备状态" >
                        <template slot-scope="scope">
                            {{ scope.row.fStatus == 0 ? "正常" :"屏蔽"  }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="400">
                        <template slot-scope="{row,$index}">
                            <el-button type="primary" size="mini" v-if="row.aStatus == 0" @click="handleAccountForbid(row.aUid, 1)">
                                屏蔽账号
                            </el-button>
                            <el-button type="primary" size="mini" v-else @click="handleAccountForbid(row.aUid, 2)">
                                激活账号
                            </el-button>
                            <el-button type="primary" size="mini" v-if="row.fStatus == 0" @click="forbidIMEI(row.aRegImei)">
                                屏蔽设备
                            </el-button>
                            <el-button type="primary" size="mini" v-else @click="openIMEI(row.aRegImei)">
                                激活设备
                            </el-button>
                            <el-button type="primary" size="mini" v-if="row.aprivilege == 4" @click="handleAccountForbid(row.aUid, 4)">
                                取消禁言
                            </el-button>
                            <el-button type="primary" size="mini" v-else @click="handleAccountForbid(row.aUid, 3)">
                                禁言
                            </el-button>
                            <el-button v-if="row.status!='draft'" size="mini" @click="handleEditItem(row.aUid)">
                                编辑道具
                            </el-button>
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
            width="600px"
        >
            <el-form label-width="80px" label-position="left">
                <el-form-item label="原因">
                    <el-input v-model="reason" placeholder="原因"/>
                </el-form-item>

                <el-form-item label="解封日期" v-if="operId == 1 || operId == 3">
                    <el-date-picker
                        v-model="activeTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="解封日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="handleConfirm()">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible1"
            width="600px"
        >
            <el-form label-width="80px" label-position="left">
                <el-form-item label="推广码">
                    <el-input v-model="spreadCode" placeholder="推广码"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible1=false">取消</el-button>
                <el-button type="primary" @click="bindSpread">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible4"
            title="修改信息"
            width="800px">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left"  >

                <el-form-item label="账号名">
                    {{ currentData.aAccount }}
                </el-form-item>
                <el-form-item label="UID" >
                    {{ currentData.aUid }}
                </el-form-item>
                <el-form-item label="昵称">
                    {{ currentData.aNickName }}
                </el-form-item>
                <el-form-item label="性别">
                    {{ currentData.aSex == 0 ?'女':'男' }}
                </el-form-item>
                <el-form-item label="头像">
                    <img :src="currentData.aFace" style="height:50px;width:50px;"/>
                </el-form-item>
                <el-form-item label="游戏币">
                    <el-input v-model="currentData.aMoney" placeholder="游戏币" onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="元宝">
                    <el-input v-model="currentData.aGold" placeholder="元宝" onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="保险箱金额">
                    <el-input v-model="currentData.aSafeAmount" placeholder="保险箱金额" onkeyup="value=value.replace(/[^(\d-)]/g,'')"/>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="currentData.aMobile" placeholder="手机号码"/>
                </el-form-item>
                <el-form-item label="注册时间">
                    {{ currentData.aRegTimeStr }}
                </el-form-item>
                <el-form-item label="最近登录时间">
                    {{ currentData.aLastLoginTimeStr }}
                </el-form-item>
                <el-form-item label="修改原因">
                    <el-input v-model="currentData.modifyRason" placeholder="修改原因"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible4=false">取消</el-button>
                <el-button v-if="currentData.aMobile == selectData.aMobile" type="primary" @click="">发送密码</el-button>
                <el-button type="primary" @click="saveData">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible2"
            title="个人详情"
            width="1000px"
        >
            <form>
                <table style="margin-bottom:10px;">
                    <tr>
                        账号名：{{ currentData.aAccount }}
                    </tr>
                    <tr>
                        UID：{{ currentData.aUid }}
                    </tr>
                    <tr>
                        昵称：{{ currentData.aNickName }}
                    </tr>
                    <tr>
                        性别：{{ currentData.aSex }}
                    </tr>
                    <tr>
                        经验等级：{{ currentData.alevel }}
                    </tr>
                    <tr>
                        VIP等级：{{ currentData.avipLevel }}

                    </tr>
                    <tr>
                        头像：<img :src="currentData.aFace" id="ele_img1" style="height:50px;width:50px;"/>
                    </tr>
                    <tr>
                        签名档：{{ currentData.asignature }}
                    </tr>
                    <tr>
                        保险箱金额：{{ currentData.aSafeAmount }}
                    </tr>
                    <tr>
                        保险箱手机号：{{ currentData.aMobile }}
                    </tr>
                    <tr>
                        绑定手机号：{{ currentData.aPhone }}
                    </tr>
                    <tr>
                        推广码：{{ currentData.aSuproedCode }}
                    </tr>
                    <tr>
                        绑定UID：{{ currentData.aSuproUid}}
                    </tr>
                    <tr>
                        注册时间：{{currentData.aRegTimeStr }}
                    </tr>
                    <tr>
                        最近登录时间：{{ currentData.aLastLoginTimeStr }}
                    </tr>
                </table>

                <el-divider>游戏数据</el-divider>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="account"
                >
                    <el-table-column align="center" label="胜利局数" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aWon }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="失败局数" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aLose }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="总局数" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aWon + scope.row.aLose }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="充值金额" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aPayMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="充值笔数" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aPayTimes }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手机型号" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.aRegImei }}
                        </template>
                    </el-table-column>
                </el-table>
                <el-divider>道具数量</el-divider>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="account"
                >
                    <el-table-column align="center" label="游戏币" >
                        <template slot-scope="scope">
                            {{ scope.row.aMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="元宝" >
                        <template slot-scope="scope">
                            {{ scope.row.aGold }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="小喇叭" >
                        <template slot-scope="scope">
                            {{ scope.row.atrumpet }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="记牌器" >
                        <template slot-scope="scope">
                            {{ scope.row.ajpq }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="比赛券">
                        <template slot-scope="scope">
                            {{ scope.row.absq }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="踢人卡">
                        <template slot-scope="scope">
                            {{ scope.row.atrk }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="招财猫">
                        <template slot-scope="scope">
                            {{ scope.row.azcm }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="红酒">
                        <template slot-scope="scope">
                            {{ scope.row.ahj }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="VIP">
                        <template slot-scope="scope">
                            {{ scope.row.avip }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="鸡蛋">
                        <template slot-scope="scope">
                            {{ scope.row.ajd }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="鲜花">
                        <template slot-scope="scope">
                            {{ scope.row.axh }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="娱乐豆">
                        <template slot-scope="scope">
                            {{ scope.row.alaba }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="任务刷刷">
                        <template slot-scope="scope">
                            {{ scope.row.arwss }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="宝牌刷刷">
                        <template slot-scope="scope">
                            {{ scope.row.abpss }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="连胜卡">
                        <template slot-scope="scope">
                            {{ scope.row.alsk }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="水果券">
                        <template slot-scope="scope">
                            {{ scope.row.asgq }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="话费券">
                        <template slot-scope="scope">
                            {{ scope.row.ahfq }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="签到卡">
                        <template slot-scope="scope">
                            {{ scope.row.aqdk }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="好牌卡">
                        <template slot-scope="scope">
                            {{ scope.row.ahpk }}
                        </template>
                    </el-table-column>
                </el-table>

                <el-divider>创建俱乐部信息</el-divider>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="createData"
                >
                    <el-table-column align="center" label="创建的俱乐部id" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.cClubId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="俱乐部名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.cClubName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="俱乐部等级" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.cLeve }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="俱乐部过期时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.cOverTm }}
                        </template>
                    </el-table-column>
                </el-table>

                <el-divider>加入的俱乐部信息</el-divider>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="joinData">
                    <el-table-column align="center" label="加入的俱乐部id" width="200">
                        <template slot-scope="scope">
                                {{ scope.row.jClubId }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="加入俱乐部时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.joinTime | formatDate}}
                        </template>
                    </el-table-column>
                </el-table>
            </form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible2=false">取消</el-button>
            </div>
        </el-dialog>


        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible3"
            title="编辑道具"
            width="1000px"
        >
            <el-form label-width="120px" label-position="left" :inline="true">

                <template v-for="(item,i) in this.boxs" >
                    <el-form-item  :label="item.itemName" v-if="item.itemIndex > 0">
                        <el-input v-model="item.itemNum" />
                        <el-button @click="saveItem(item)">保存</el-button>
                    </el-form-item>
                </template>

                <!--<template v-for="(item,j) in this.userItems">
                    <el-form-item  v-if="boxMap.get(item.itemIndex)" :label="boxMap.get(item.itemIndex)">
                        <el-input v-model="item.itemNum" />
                        <el-button @click="saveItem(item.itemNum,item.itemIndex)">保存</el-button>
                    </el-form-item>
                </template>-->
            </el-form>
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
    import box from '@/api/pyq/box'

    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";

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
                dialogVisible:false,
                dialogVisible1:false,
                dialogVisible2:false,
                dialogVisible3:false,
                dialogVisible4:false,

                searchUid : '',
                searchAccount:"",
                searchName:"",
                searchStatus:-1,

                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                selectData: {}, // 当前选中的信息
                currentData:{},
                account:[],
                createData:[],
                joinData:[],

                boxs:[],
                userItems:[],

                reason:'',
                activeTime: '',
                operId:0,  // 1,屏蔽账号2解封账号，3 禁言，4解除禁言
                operUid:'',
                spreadCode:'',
            }
        },
        computed: {

            boxMap () {
                const boxMap = new Map()
                for (const box of this.boxs) {
                    boxMap.set(box.itemIndex, box.itemName)
                }
                return boxMap
            }

        },
        watch: {

        },
        created () {
            this.getAccountPage()
            this.getboxs()
        },

        methods: {
            async getAccountPage () {
                const self = this
                self.listLoading = true

                account.getAccountPage(self.currentPage, self.pageSize, self.searchUid, self.searchAccount, self.searchName,
                self.searchStatus).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.resultList
                    self.listTotal = result.data.rowCount
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            getAppInfos () {
                const self = this
                app.getAppInfos().then(result => {
                    self.appInfos = result.data.appInfos
                }, result => {
                })
            },

            async getboxs() {
                const res = await box.getBoxItems()
                this.boxs = res.data
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
            forbidIMEI(aRegImei) {
                const self= this
                let form = new FormData()
                form.append('imei', aRegImei)
                form.append('name', "AM.JSP"+aRegImei)
                form.append('status', 1)
                account.updateIMEI(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '屏蔽成功!'
                    })
                    self.getAccountPage()
                }, result => {
                })
            },
            openIMEI(aRegImei) {
                const self= this
                let form = new FormData()
                form.append('imei', aRegImei)
                form.append('name', "AM.JSP"+aRegImei)
                form.append('status', 0)
                account.updateIMEI(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '屏蔽成功!'
                    })
                    self.getAccountPage()
                }, result => {
                })
            },
            handleAccountForbid(uid, operId) {
                this.dialogVisible = true
                this.operUid = uid
                this.operId = operId
                this.reason = ""
                this.activeTime = ""
            },

            handleConfirm() {
                const self = this
                if (!self.reason) {

                    self.$message({
                        type: 'success',
                        message: '请输入原因!'
                    })
                    return
                }
                if(self.operId == 1 || self.operId == 3) {
                    if (!self.activeTime) {
                        self.$message({
                            type: 'success',
                            message: '请输入解封日期!'
                        })
                        return
                    }
                }

                let form = new FormData()
                form.append('uid', self.operUid)
                form.append('reason', self.reason)
                form.append('activeTime', self.activeTime)

                if (self.operId == 1) {
                    //屏蔽账号
                    form.append('status',1)
                    account.editAccountForbid(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '屏蔽成功!'
                        })
                        self.dialogVisible = false
                        self.getAccountPage()
                    }, result => {
                    })
                } else if (self.operId == 2) {
                    //解封账号
                    form.append('status',0)
                    account.editAccountForbid(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '解除成功!'
                        })
                        self.dialogVisible = false
                        self.getAccountPage()
                    }, result => {
                    })
                } else if (self.operId == 3) {
                    //禁言
                    form.append('status',4)
                    account.editSpeakForbid(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '禁言成功!'
                        })
                        self.dialogVisible = false
                        self.getAccountPage()
                    }, result => {
                    })
                } else if (self.operId == 4) {
                    //接触禁言
                    form.append('status',0)
                    account.editSpeakForbid(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '解除成功!'
                        })
                        self.dialogVisible = false
                        self.getAccountPage()
                    }, result => {
                    })
                }
            },

            async handleEdit () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData || !self.selectData.aUid) {
                    self.$message({
                        type: 'error',
                        message: '请选择用户!'
                    })
                    return
                }

                await account.getAccountDetail(self.currentData.aUid).then(result => {
                    self.currentData = result.data.account
                    // 重置保存状态
                    self.isUpdate = false
                    self.dialogVisible4 = true
                }, result => {
                    this.$Message.error(result.message)
                })


            },

            handleBindSpread () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.aUid) {
                    self.$message({
                        type: 'info',
                        message: '请选择用户!'
                    })
                    return
                }
                self.spreadCode = ''
                self.dialogVisible1 = true
            },

            bindSpread() {
                const self = this
                if(self.spreadCode.length < 8 || !self.spreadCode){
                    self.$message({
                        type: 'info',
                        message: '推广码格式有误!'
                    })
                    return
                }
                let form = new FormData()
                form.append('plyguid', self.currentData.aUid)
                form.append('spreadcode', self.spreadCode)
                account.configSpread(form).then(result => {
                    if (result.data == -4) {
                        self.$message({
                            type: 'error',
                            message: '该账户已绑定推广号!'
                        })

                    } else if (result.data == -3) {
                        self.$message({
                            type: 'error',
                            message: '不能绑定本身账号!'
                        })
                    } else if (result.data == -2) {
                        self.$message({
                            type: 'error',
                            message: '推广码不存在!'
                        })
                    } else if(result.data == 0){
                        self.$message({
                            type: 'success',
                            message: '绑定成功!'
                        })
                        self.selectData= Object.assign({}, defaultGame)
                        self.dialogVisible1 = false
                        self.getAccountPage()
                    }
                }, result => {
                })
            },

            unBindSpread() {
                const self = this
                if (!self.selectData.aUid) {
                    self.$message({
                        type: 'info',
                        message: '请选择用户!'
                    })
                    return
                }
                let form = new FormData()
                form.append('plyguid', self.selectData.aUid)
                account.configSpread(form).then(result => {
                    if (result.data == 0) {
                        self.$message({
                            type: 'success',
                            message: '解绑成功!'
                        })
                        self.selectData = Object.assign({}, defaultGame)
                    } else if (result.data == -2) {
                        self.$message({
                            type: 'error',
                            message: '该账户没有绑定推广号!'
                        })
                    } else{
                        self.$message({
                            type: 'error',
                            message: '解绑失败!'
                        })
                    }
                    self.selectData= Object.assign({}, defaultGame)
                }, result => {
                })
            },
            async accountDetail() {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.currentData.aUid) {
                    self.$message({
                        type: 'info',
                        message: '请选择用户!'
                    })
                    return
                }
                self.account = []
                self.createData = []
                self.joinData = []

                await account.getAccountDetail(self.currentData.aUid).then(result => {
                    self.createData = result.data.createData
                    self.joinData = result.data.joinData
                    self.account.push(result.data.account)
                    self.currentData = result.data.account
                    self.dialogVisible2 = true
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.account = []
                    self.createData = []
                    self.joinData = []
                })
            },

            async handleEditItem(uid) {
                const self = this
                self.operUid = uid
                await account.getCasinoitem(uid).then(result => {
                    self.userItems = result.data

                    self.boxs.forEach(function(value, key, iterable) {
                        self.$set(value, 'reMainNum', 0)
                        self.$set(value, 'itemNum', 0)
                        for (const item1 of self.userItems) {
                            if (value.itemIndex == item1.itemIndex) {
                                self.$set(value, 'reMainNum', item1.itemNum)
                                self.$set(value, 'itemNum', item1.itemNum)
                            }
                        }
                    });
                    self.dialogVisible3 = true
                }, result => {
                })
            },

            saveItem(item) {
                const self = this
                let form = new FormData()
                form.append('uid', self.operUid)
                form.append('num', item.itemNum - item.reMainNum)
                form.append('index', item.itemIndex)
                account.saveItem(form).then(result => {
                    if(result.data.ret>=0){
                        self.$message({
                            type: 'success',
                            message: '保存成功!'
                        })
                    }else{
                        self.$message({
                            type: 'error',
                            message: '操作失败!'
                        })
                    }

                }, result => {
                })
            },

            saveData() {
                const self = this

                if (!self.currentData.modifyRason) {
                    self.$message({
                        type: 'error',
                        message: '请修改填写原因!'
                    })
                    return
                }

                let form = new FormData()
                form.append('aUid', self.currentData.aUid)
                form.append('ele_aMoney', self.currentData.aMoney)
                form.append('ele_aGold', self.currentData.aGold)
                form.append('ele_safeAmount', self.currentData.aSafeAmount)
                form.append('ele_mobile', self.currentData.aMobile ? self.currentData.aMobile : "")
                form.append('ele_modifyRason', self.currentData.modifyRason)

                account.updateAccountSafe(form).then(result => {
                    if(result.data.res == 0){
                        self.$message({
                            type: 'success',
                            message: '保存成功!'
                        })
                        self.selectData = {}
                        self.dialogVisible4 = false

                    } else if (result.data.res == -8) {
                        self.$message({
                            type: 'error',
                            message: '操作游戏币或保险箱金额权限不足!'
                        })
                    }else{
                        self.$message({
                            type: 'error',
                            message: '操作失败!'
                        })
                    }
                }, result => {
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
