<template>
    <div class="app-container manage-container">
        <filter-container
            @submit-form="getGoodsConfigsPage"
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
                            v-model="searchGame"
                            clearable
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
                            popper-class="role-select-dropdown"
                            style="width: 200px"

                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in searchChannels"
                                :key="item.channelId"
                                :label="item.channelName"
                                :value="item.channelId">
                                {{ item.channelName }}
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="filter-form-item" label="应用">
                        <el-select
                            size="small"
                            v-model="searchPn"
                            clearable
                            filterable
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                        >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in searchAppInfos"
                                :key="item.pn"
                                :label="item.appname"
                                :value="item.pn">
                                {{ item.appname }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-form-item" label="状态">
                        <el-select
                            size="small"
                            v-model="searchStatus"
                            popper-class="role-select-dropdown"
                            style="width: 200px"
                            clearable
                            filterable
                        >
                            <el-option class="role-select-dropdown__item" value="-1" label="全部">全部</el-option>
                            <el-option class="role-select-dropdown__item" value="0" label="启用">启用</el-option>
                            <el-option class="role-select-dropdown__item" value="1" label="禁用">禁用</el-option>
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
                @click="handleAddGoods">
                新增
            </el-button>

            <el-button
                class="operate-button"
                type="info"
                size="small"
                icon="el-icon-edit"
                @click="handleEditGoods">
                编辑
            </el-button>

            <el-button
                class="operate-button"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelGoods">
                删除
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-sort-up"
                @click="handleUp">
                上移
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="el-icon-sort-down"
                @click="handleDown">
                下移
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
                    <el-table-column align="center" label="渠道" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.channelName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用名称" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pnName }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="应用" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.pn }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品名称(简体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.goodsName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品名称(繁体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.goodsNameZhtw }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品名称(英文)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.goodsNameEnus }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品描述(简体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.goodsDesc }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品描述(繁体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.goodsDescZhtw }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品描述(英文)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.goodsDescEnus }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="限时特惠" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.discountStatus == 1 ? "是" : "不是" }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="获得道具" width="200">
                        <template slot-scope="scope" >
                            {{ scope.row.gainItem }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="兑换道具" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.exchangeItem }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="排序ID" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.orderId }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品图片" width="200">
                        <template slot-scope="scope">
                            <img :src="scope.row.goodsImg" style="width: 50px;height:50px">
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="兑换类型" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.exchangeType == 1 ? "个人中心兑换" : "俱乐部兑换" }}
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
            :title="currentDialogType===dialogType.EDIT?'编辑商品':'新增商品'"
            width="800px"
            :before-close="handleBeforeCloseEdit"
            @close="handleClose">
            <el-form ref="ruleForm" :model="currentData" label-width="100px"
                     label-position="left" :inline="true" :rules="rules">

                <el-form-item label="名称(简体)" prop="goodsName">
                    <el-input v-model="currentData.goodsName" placeholder="商品名称" size="medium"/>
                </el-form-item>

                <el-form-item label="名称(繁体)" prop="goodsName">
                    <el-input v-model="currentData.goodsNameZhtw" placeholder="商品名称" size="medium"/>
                </el-form-item>

                <el-form-item label="名称(英文)" prop="goodsName">
                    <el-input v-model="currentData.goodsNameEnus" placeholder="商品名称" size="medium"/>
                </el-form-item>

                <el-form-item label="游戏" prop="goodsPn">
                    <el-select
                        v-model="currentData.gameId"
                        placeholder="请选择游戏"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        clearable
                        filterable
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

                <el-form-item label="渠道" prop="goodsPn">
                    <el-select
                        v-model="currentData.channelId"
                        placeholder="请选择渠道"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        clearable
                        filterable
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

                <el-form-item label="应用" prop="pn">
                    <el-select
                        v-model="currentData.pn"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        style="width: 202px"
                        :disabled="currentDialogType === dialogType.EDIT ? true : false"
                        clearable
                        filterable>
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in appInfos"
                            :key="item.pn"
                            :label="item.appname"
                            :value="item.pn">
                            {{ item.appname }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="描述(简体)" prop="goodsDesc">
                    <el-input v-model="currentData.goodsDesc" placeholder="商品描述" size="medium"/>
                </el-form-item>

                <el-form-item label="描述(繁体)" prop="goodsDescZhtw">
                    <el-input v-model="currentData.goodsDescZhtw" placeholder="商品描述" size="medium"/>
                </el-form-item>

                <el-form-item label="描述(英文)" prop="goodsDescEnus">
                    <el-input v-model="currentData.goodsDescEnus" placeholder="商品描述" size="medium"/>
                </el-form-item>

                <el-form-item label="商品图片" prop="goodsImg">
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
                        <img v-if="goodsImg" :src="goodsImg" class="img-info">
                        <el-button v-else size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="兑换类型">
                    <el-radio-group v-model="currentData.exchangeType">
                        <el-radio :label="1" >个人兑换</el-radio>
                        <el-radio :label="2" >俱乐部兑换</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="限时特惠">
                    <el-radio-group v-model="currentData.discountStatus">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="2" >否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="currentData.orderId" :min="1" placeholder="排序" size="medium"/>
                </el-form-item>

                <el-form-item label="等级">
                    <el-input v-model="currentData.goodsLevel" placeholder="等级"  size="medium" />
                    <html style="color: red">如果任何等级可购买则填写99999</html>
                </el-form-item>

                <el-form-item label="兑换的次数">
                    <el-input v-model="currentData.exchangeTimes" placeholder="兑换的次数"/>
                </el-form-item>

                <el-form-item label="商品状态" >
                    <el-radio-group v-model="currentData.goodsStatus" >
                        <el-radio :label="0" >启用</el-radio>
                        <el-radio :label="1" >禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-divider><span style='color:red'>{{ levelDesc }}</span></el-divider>
                <div>
                    <el-form-item label="1级">
                        <el-input v-model="currentData.level1"  placeholder="1级"/>
                    </el-form-item>
                    <el-form-item label="2级">
                        <el-input v-model="currentData.level2" placeholder="2级"/>
                    </el-form-item>
                    <el-form-item label="3级">
                        <el-input v-model="currentData.level3" placeholder="3级"/>
                    </el-form-item>
                    <el-form-item label="4级">
                        <el-input v-model="currentData.level4"  placeholder="4级"/>
                    </el-form-item>
                    <el-form-item label="5级">
                        <el-input v-model="currentData.level5" placeholder="5级"/>
                    </el-form-item>
                    <el-form-item label="6级">
                        <el-input v-model="currentData.level6"  placeholder="6级"/>
                    </el-form-item>
                </div>

            </el-form>



            <div>
                <el-divider><span>获得道具详细配置</span></el-divider>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="currentData.goodsGain"
                    >
                    <el-table-column align="center" label="道具">
                        <template slot-scope="scope">
                            <template v-if="scope.row.edit">
                                <el-select
                                    v-model="scope.row.itemId"
                                    placeholder="请选择"
                                    :disabled="scope.row.itemName ? true : false"
                                    clearable
                                    filterable>
                                    <el-option
                                        class="role-select-dropdown__item"
                                        v-for="item in gainItems"
                                        :key="item.itemId"
                                        :label="item.itemName"
                                        :value="item.itemId">
                                        {{ item.itemName }}
                                    </el-option>
                                </el-select>
                            </template>
                            <span v-else>{{ scope.row.itemName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="道具数量">
                        <template slot-scope="scope">
                            <template>
                                <el-input v-if="scope.row.edit" v-model="scope.row.itemNum" class="edit-input"
                                          size="small" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                                <span v-else>{{ scope.row.itemNum }}</span>
                            </template>
                            <el-input style="display: none" v-model="scope.row.itemName" class="edit-input" size="small" />
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="道具类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.edit">

                                <el-select
                                    v-model="scope.row.itemType"
                                    placeholder="请选择"
                                    :disabled="scope.row.itemName ? true : false"
                                    clearable
                                    filterable>
                                    <el-option :value="0" label="实物奖励">实物奖励</el-option>
                                    <el-option :value="1" label="虚拟奖励(手动)">虚拟奖励(手动)</el-option>
                                    <el-option :value="2" label="虚拟奖励(自动)">虚拟奖励(自动)</el-option>
                                </el-select>
                            </template>
                            <span v-else>{{ formateItemType(scope.row.itemType) }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" >
                        <template  slot-scope="scope" >
                            <div v-if="!scope.row.edit">
                                <el-button type="text" size="small"
                                           @click="editGoodsGain(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="delGoodsGain(scope.$index, scope.row)">删除</el-button>
                            </div>
                            <div v-else>
                                <el-button type="text" size="small" v-if="scope.row.itemName"
                                           @click="saveEditGain(scope.$index, scope.row)">保存</el-button>
                                <el-button type="text" size="small"
                                           @click="cancelEditGain(scope.$index, scope.row)">取消</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="width: 100%; margin-top: 16px; margin-bottom: 8px; border: 1px dashed #909399;"
                           icon="el-icon-plus" @click="addGoodsGain">新增获得道具</el-button>
            </div>

            <div>
                <el-divider></el-divider>
                <span>兑换道具详细配置</span>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="currentData.goodsExchange"
                >
                    <el-table-column align="center" label="道具">
                        <template slot-scope="scope">
                            <template v-if="scope.row.edit">
                                <el-select
                                    v-model="scope.row.itemIndex"
                                    placeholder="请选择"
                                    :disabled="scope.row.itemName ? true : false">
                                    <el-option
                                        class="role-select-dropdown__item"
                                        v-for="item in exchangeItems"
                                        :key="item.itemIndex"
                                        :label="item.itemName"
                                        :value="item.itemIndex">
                                        {{ item.itemName }}
                                    </el-option>
                                </el-select>
                            </template>
                            <span v-else>{{ scope.row.itemName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="道具数量">
                        <template slot-scope="scope">
                            <template>
                                <el-input v-if="scope.row.edit" v-model="scope.row.itemNum" class="edit-input"
                                          size="small" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                                <span v-else>{{ scope.row.itemNum }}</span>
                            </template>
                            <el-input style="display: none" v-model="scope.row.itemName" class="edit-input" size="small" />
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" >
                        <template  slot-scope="scope" >
                            <div v-if="!scope.row.edit">
                                <el-button type="text" size="small"
                                           @click="editGoodsExchange(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="delGoodsExchange(scope.$index, scope.row)">删除</el-button>
                            </div>
                            <div v-else>
                                <el-button type="text" size="small" v-if="scope.row.itemName"
                                           @click="saveEditExchange(scope.$index, scope.row)">保存</el-button>
                                <el-button type="text" size="small"
                                           @click="cancelEditExchange(scope.$index, scope.row)">取消</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="width: 100%; margin-top: 16px; margin-bottom: 8px; border: 1px dashed #909399;"
                           icon="el-icon-plus" @click="addGoodsExchange">新增兑换道具</el-button>
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
    import app from '@/api/app/app'
    import channel from '@/api/app/channel'
    import game from '@/api/hallgame/game'

    import goods from '@/api/pyq/goods'
    import box from '@/api/pyq/box'

    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        gameId:'',
        channelId:'',
        orderId : 1,
        goodsStatus : 0,
        exchangeType : 1,
        discountStatus : 2,
        exchangeTimes:-1,
        goodsGain: [],
        goodsExchange:[],
        level1:0,
        level2:0,
        level3:0,
        level4:0,
        level5:0,
        level6:0
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
                goodsImg:'',
                searchGame:'',
                searchChannel:'',
                searchPn:'',
                searchStatus: '-1',
                disabled:false,

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

                searchChannels:[],
                searchAppInfos:[],
                games:[],
                channels:[],
                appInfos : [],
                goodsImgFiles : [], // 商品图标
                gainItems:[],
                exchangeItems:[],
                rules: {
                    pn : [
                        { required: true, message: '请输入应用全称', trigger: 'change' }
                    ],
                    goodsName : [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ]

                },

                currentGoodsGain: {},
                currentGoodsExchange: {}
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
            gainItemsMap () {
                if (this.gainItems.length > 0) {
                    const gainItemsMap = new Map()
                    for (const gain of this.gainItems) {
                        gainItemsMap.set(gain.itemId, gain.itemName)
                    }
                    return gainItemsMap
                }
            },

            exchangeItemsMap () {
                if (this.exchangeItems.length > 0) {
                    const exchangeItemsMap = new Map()
                    for (const exchange of this.exchangeItems) {
                        exchangeItemsMap.set(exchange.itemIndex, exchange.itemName)
                    }
                    return exchangeItemsMap
                }
            },

            levelDesc() {
                if (this.currentData && this.currentData.exchangeType == 1) {
                    return "个人中心兑换vip等级配置"
                } else if (this.currentData && this.currentData.exchangeType == 2) {
                    return "俱乐部中心兑换vip等级配置"
                }
            }
        },
        watch: {
            'currentData.goodsName' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdate = newValue !== this.selectData.goodsName
                } else {
                    // 新增的时候，
                    this.isUpdate = newValue && newValue.trim().length > 0
                }
            },

            'currentData.goodsPn' (newValue, oldValue) {
                if (this.currentDialogType === this.dialogType.EDIT) {
                    // 修改的时候，判断当前值和原来的值是否一样
                    this.isUpdate = newValue !== this.selectData.goodsPn
                } else {
                    // 新增的时候，
                    this.isUpdate = newValue && newValue.trim().length > 0
                }
            },

            'currentData.gameId' (newValue, oldValue) {
                this.getGameToChannel(newValue)
                this.getTotalApps()
            },

            'currentData.channelId' () {
                this.getTotalApps()
            },

            'searchGame' (newValue, oldValue) {
                this.getGameToSearchChannel(newValue);
                this.getSearchApps(newValue, "");
            },

            'searchChannel' (newValue, oldValue) {
                this.getSearchApps(this.searchGame, newValue);
            }
        },
        created () {
            this.getGoodsConfigsPage()
            this.getLimitMainGames()
            this.getLimitChannels()
            this.getGainItems()
            this.getExchangeItems()
        },

        methods: {
            async getGoodsConfigsPage () {
                const self = this
                self.listLoading = true

                goods.getGoodsConfigsPage(self.currentPage, self.pageSize, self.searchStatus, self.searchPn).then(result => {
                    self.listLoading = false
                    self.tableDates = result.data.rows
                    self.listTotal = result.data.total
                }, result => {
                    this.$Message.error(result.message)
                    self.listLoading = false
                    self.tableDates = []
                })
            },

            async getLimitMainGames () {
                const res = await game.getLimitMainGames()
                this.games = res.data
            },

            async getLimitChannels () {
                const res = await channel.getLimitChannels()
                this.channels = res.data
            },

            async getGameToChannel (gameId) {
                const res = await channel.getGameToChannel(gameId)
                this.channels = res.data
            },

            async getTotalApps () {
                const res = await app.getTotalApps(this.currentData.gameId, this.currentData.channelId)
                this.appInfos = res.data
            },

            async getGameToSearchChannel (gameId) {
                const res = await channel.getGameToChannel(gameId)
                this.searchChannels = res.data
                if (this.searchChannels && this.searchChannels.length > 0) {
                    this.searchChannel = this.searchChannels[0].channelId
                } else {
                    this.searchChannel = ''
                }
            },
            async getSearchApps (game, channel) {
                const res = await app.getTotalApps(game, channel)
                this.searchAppInfos = res.data
                if (this.searchAppInfos && this.searchAppInfos.length > 0) {
                    this.searchPn = this.searchAppInfos[0].pn
                } else {
                    this.searchPn = ''
                }
            },

            async getGainItems() {
                const res = await goods.getItems()
                this.gainItems = res.data
            },

            async getExchangeItems() {
                const res = await box.getBoxItems()
                this.exchangeItems = res.data
            },

            handleSelectChange (row) {
                const self = this
                self.selectData = deepClone(row)
            },

            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
            },

            handleAddGoods () {
                this.currentData = deepClone(Object.assign({}, defaultData))

                this.currentDialogType = this.dialogType.NEW
                this.dialogVisible = true
            },

            async handleEditGoods () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择商品!'
                    })
                    return
                }
                // 重置保存状态
                self.isUpdate = false
                self.goodsImg = self.currentData.goodsImg

                const res = await goods.getGoodsGain(self.currentData.autoId)
                const gainItems = []
                for (const res of res.data) {
                    const item = {}
                    self.$set(item, 'itemId', res['gainItem'])
                    self.$set(item, 'itemNum', res['gainNum'])
                    self.$set(item, 'itemType', res['goodsType'])
                    self.$set(item, 'autoId', res['autoId'])
                    self.$set(item, 'itemName', self.gainItemsMap.get(item.itemId))
                    gainItems.push(item)
                }
                self.$set(self.currentData, 'goodsGain', gainItems)

                const res1 = await goods.getGoodsExchange(self.currentData.autoId)
                const exchangeItems = []
                for (const res1 of res1.data) {
                    const item1 = {}
                    self.$set(item1, 'itemIndex', res1['exchangeItem'])
                    self.$set(item1, 'itemNum', res1['exchangeNum'])
                    self.$set(item1, 'autoId', res1['autoId'])
                    self.$set(item1, 'itemName', self.exchangeItemsMap.get(item1.itemIndex))
                    exchangeItems.push(item1)
                }
                self.$set(self.currentData, 'goodsExchange', exchangeItems)

                const res2 = await goods.getGoodsVip(self.currentData.autoId)
                for (const item of res2.data) {
                    for (const key in item) {
                        self.$set(self.currentData, 'level'+key, item[key])
                    }
                }

                self.currentDialogType = this.dialogType.EDIT
                self.dialogVisible = true
            },

            /**
             * 删除
             * @param $index
             * @param row
             */
            handleDelGoods () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择商品!'
                    })
                    return
                }

                self.$confirm(`确认删除商品“${self.currentData.goodsName}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append('operate', 2)
                    form.append('goods_autoId', self.currentData.autoId)

                    goods.configItem(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '商品删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.autoId != self.currentData.autoId
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
                            this.updateGoods()
                        } else {
                            this.addGoods()
                        }
                    } else {
                        return false;
                    }
                });
            },
            updateGoods () {
                const self = this

                self.currentData.goodsGain.forEach(item => {
                    self.$delete(item,'edit')
                    item.itemName = self.gainItemsMap.get(item.itemId)
                })

                self.currentData.goodsExchange.forEach(item => {
                    self.$delete(item,'edit')
                    item.itemName = self.exchangeItemsMap.get(item.itemIndex)
                })

                let form = new FormData();
                form.append('operate', 1)
                form.append('goods_autoId', self.currentData.autoId)
                form.append('goods_orderId', self.currentData.orderId)
                form.append('goods_name', self.currentData.goodsName)
                form.append('goods_name_zh_tw', self.currentData.goodsNameZhtw)
                form.append('goods_name_en_us', self.currentData.goodsNameEnus)
                form.append('goods_pnId', self.currentData.pn)
                form.append('goods_img', self.currentData.goodsImg)
                form.append('goods_stocks', "")
                form.append('goods_status', self.currentData.goodsStatus)
                form.append('exchange_type', self.currentData.exchangeType)
                form.append('goods_level', self.currentData.goodsLevel)
                form.append('goods_desc', self.currentData.goodsDesc)
                form.append('goods_desc_zh_tw', self.currentData.goodsDescZhtw)
                form.append('goods_desc_en_us', self.currentData.goodsDescEnus)
                form.append('exchange_times', self.currentData.exchangeTimes)
                form.append('discount_status', self.currentData.discountStatus)
                form.append('level1', self.currentData.level1)
                form.append('level2', self.currentData.level2)
                form.append('level3', self.currentData.level3)
                form.append('level4', self.currentData.level4)
                form.append('level5', self.currentData.level5)
                form.append('level6', self.currentData.level6)

                for (let i = 0; i < self.currentData.goodsGain.length; i++) {
                    form.append(`gainItemList`, JSON.stringify(self.currentData.goodsGain[i]))
                }

                for (let i = 0; i < self.currentData.goodsExchange.length; i++) {
                    form.append(`exchangeItemList`, JSON.stringify(self.currentData.goodsExchange[i]))
                }


                goods.configItem(form).then(result => {
                    self.dialogVisible = false

                    self.selectData = deepClone(self.currentData)

                    self.goodsImg = ""
                    self.currentGoodsGain = {}
                    self.currentGoodsExchange = {}

                    self.$message({
                        type: 'success',
                        message: '修改商品信息成功'
                    })
                    self.getGoodsConfigsPage()
                }).catch((error) => {
                })
            },
            addGoods () {
                const self = this
                self.currentData.goodsGain.forEach(item => {
                    self.$delete(item,'edit')
                    item.itemName = self.gainItemsMap.get(item.itemId)
                })

                self.currentData.goodsExchange.forEach(item => {
                    self.$delete(item,'edit')
                    item.itemName = self.exchangeItemsMap.get(item.itemIndex)
                })

                let form = new FormData();
                form.append('operate', 0)
                form.append('goods_autoId', 0)
                form.append('goods_orderId', self.currentData.orderId)
                form.append('goods_name', self.currentData.goodsName)
                form.append('goods_name_zh_tw', self.currentData.goodsNameZhtw)
                form.append('goods_name_en_us', self.currentData.goodsNameEnus)
                form.append('goods_pnId', self.currentData.pn)
                form.append('goods_img', self.currentData.goodsImg)
                form.append('goods_stocks', "")
                form.append('goods_status', self.currentData.goodsStatus)
                form.append('exchange_type', self.currentData.exchangeType)
                form.append('goods_level', self.currentData.goodsLevel)
                form.append('goods_desc', self.currentData.goodsDesc)
                form.append('goods_desc_zh_tw', self.currentData.goodsDescZhtw)
                form.append('goods_desc_en_us', self.currentData.goodsDescEnus)
                form.append('exchange_times', self.currentData.exchangeTimes)
                form.append('discount_status', self.currentData.discountStatus)
                form.append('level1', self.currentData.level1)
                form.append('level2', self.currentData.level2)
                form.append('level3', self.currentData.level3)
                form.append('level4', self.currentData.level4)
                form.append('level5', self.currentData.level5)
                form.append('level6', self.currentData.level6)

                for (let i = 0; i < self.currentData.goodsGain.length; i++) {
                    form.append(`gainItemList`, JSON.stringify(self.currentData.goodsGain[i]))
                }

                for (let i = 0; i < self.currentData.goodsExchange.length; i++) {
                    form.append(`exchangeItemList`, JSON.stringify(self.currentData.goodsExchange[i]))
                }

                goods.configItem(form).then(result => {
                    const data = result.data
                    self.dialogVisible = false
                    self.goodsImg = ''
                    self.$message({
                        type: 'success',
                        message: '新增商品成功'
                    })
                    self.getGoodsConfigsPage()
                }).catch(error => {
                })
            },

            resetQueryParam () {
                this.searchAppName = ""
                this.getGoodsConfigsPage()
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
                    this.getGoodsConfigsPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getGoodsConfigsPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getGoodsConfigsPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getGoodsConfigsPage()
            },

            handleUploadSuccess(res,file) {
                if (ResultCode.SUCCESS.code === res.code) {
                    this.$Message.success('上传成功')
                    this.goodsImg = URL.createObjectURL(file.raw)
                    this.currentData.goodsImg = res.data[0].fileurl
                } else {
                    this.$Message.error('上传失败')
                }
            },

            handleUploadError() {
                this.$Message.error('上传失败')
            },

            addGoodsGain() {
                this.currentData.goodsGain.push({
                    itemId: 0,
                    itemNum: '',
                    itemType: 0,
                    edit: true
                })
                this.currentGoodsGain = {
                    itemId: 0,
                    itemNum: '',
                    itemType: 0,
                    edit: true
                }
            },
            editGoodsGain(index, row) {
                debugger
                this.$set(row, 'edit', true)
                this.currentGoodsGain = deepClone(row)
            },
            saveEditGain(index, row) {
                const self = this
                let form = new FormData()
                form.append("operate", 1)
                form.append("autoId", row.autoId)
                form.append("goodsId", self.currentData.autoId)
                form.append("gain_item_id", row.itemId)
                form.append("gain_item_num", row.itemNum)
                form.append("gain_item_type", row.itemType)

                goods.configGainItem(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    this.$set(row, "edit", false)
                    this.$set(this.currentGoodsGain, "edit", false)
                }).catch(error => {
                })
            },
            cancelEditGain(index, row) {
                this.$set(row, "edit", false)
                this.$set(this.currentGoodsGain, "edit", false)
                if (this.currentGoodsGain.itemName) {
                    row = this.currentGoodsGain
                    this.$set(this.currentData.goodsGain,index,row)
                } else{
                    this.currentData.goodsGain.splice(index, 1);
                }
                this.currentGoodsGain = {}
            },

            delGoodsGain(index, row) {
                this.currentData.goodsGain.splice(index, 1);
            },

            addGoodsExchange() {
                this.currentData.goodsExchange.push({
                    itemIndex: 0,
                    itemNum: '',
                    edit: true
                })
                this.currentGoodsExchange = {
                    itemIndex: 0,
                    itemNum: '',
                    edit: true
                }
            },
            editGoodsExchange(index, row) {
                this.$set(row, 'edit', true)
                this.$set(this.currentData.goodsExchange,index,row)
                this.currentGoodsExchange = deepClone(row)
            },

            saveEditExchange(index, row) {
                const self = this
                let form = new FormData()
                form.append("operate", 1)
                form.append("autoId", row.autoId)
                form.append("goodsId", self.currentData.autoId)
                form.append("exchange_item_id", row.itemIndex)
                form.append("exchange_item_num", row.itemNum)

                goods.configExchangeItem(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    this.$set(row, "edit", false)
                    this.$set(this.currentGoodsExchange, "edit", false)
                }).catch(error => {
                })
            },

            cancelEditExchange(index, row) {
                this.$set(row, "edit", false)
                this.$set(this.currentGoodsExchange, "edit", false)
                if (this.currentGoodsExchange.itemName) {
                    row = this.currentGoodsExchange
                    this.$set(this.currentData.goodsExchange,index,row)
                } else{
                    this.currentData.goodsExchange.splice(index, 1);
                }
                this.currentGoodsExchange = {}
            },

            delGoodsExchange(index, row) {
                this.currentData.goodsExchange.splice(index, 1);
            },

            handleUp() {
                const self = this
                debugger
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择商品!'
                    })
                    return
                }

                if (self.selectData.index === 0) {
                    self.$message({
                        type: 'error',
                        message: '无法上移!'
                    })
                    return
                }

                let form = new FormData()
                form.append('operate', 3)
                form.append('goods_autoId', self.currentData.autoId)
                form.append('goods_pnId', self.currentData.pn)
                goods.configItem(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '上移成功!'
                    })
                    this.getGoodsConfigsPage()
                }, result => {
                })
            },

            handleDown() {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.autoId) {
                    self.$message({
                        type: 'error',
                        message: '请选择商品!'
                    })
                    return
                }

                if (self.selectData.index === self.tableDates.length - 1) {
                    self.$message({
                        type: 'error',
                        message: '无法下移!'
                    })
                    return
                }

                let form = new FormData()
                form.append('operate', 4)
                form.append('goods_autoId', self.currentData.autoId)
                form.append('goods_pnId', self.currentData.pn)
                goods.configItem(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '下移成功!'
                    })
                    this.getGoodsConfigsPage()
                }, result => {
                })
            },

            formateItemType (value) {
                if (value == 0) {
                    return "实物奖励"
                } else if (value == 1) {
                    return "虚拟奖励(手动)"
                } else if (value == 2) {
                    return "虚拟奖励(自动)"
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
