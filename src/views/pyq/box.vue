<template>
    <div class="app-container manage-container">

        <div class="filter-container">
            <!-- 搜索面板遮罩 -->
            <div class="filter-wrapper">
                <!-- 搜索面板展开关闭按钮 -->
                <div class="filter-header">
                    <div class="filter-title">搜索</div>
                </div>
                <div class="filter-main " >
                    <div class="filter-left filter-form--open">
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
                                    popper-class="role-select-dropdown"
                                    style="width: 200px"

                                >
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

                            <el-form-item class="filter-form-item" label="应用">
                                <el-select
                                    size="small"
                                    v-model="searchPn"
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
                            <el-form-item class="filter-form-item" label="商品分类">
                                <el-select
                                    size="small"
                                    v-model="searchType"
                                    popper-class="role-select-dropdown"
                                    style="width: 200px"
                                    clearable
                                >
                                    <el-option class="role-select-dropdown__item" value="0" label="普通宝箱">普通宝箱</el-option>
                                    <el-option class="role-select-dropdown__item" value="1" label="俱乐部VIP">俱乐部VIP</el-option>
                                    <el-option class="role-select-dropdown__item" value="2" label="俱乐部基金">俱乐部基金</el-option>
                                    <el-option class="role-select-dropdown__item" value="3" label="俱乐部喇叭">俱乐部喇叭</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="filter-form-item" label="是否短代">
                                <el-select
                                    size="small"
                                    v-model="searchSp"
                                    popper-class="role-select-dropdown"
                                    style="width: 200px"
                                >
                                    <el-option class="role-select-dropdown__item" value="-1" label="全部">全部</el-option>
                                    <el-option class="role-select-dropdown__item" value="1" label="是">是</el-option>
                                    <el-option class="role-select-dropdown__item" value="0" label="否">否</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="filter-form-item" label="是否首冲">
                                <el-select
                                    size="small"
                                    v-model="searchDouble"
                                    popper-class="role-select-dropdown"
                                    style="width: 200px"
                                >
                                    <el-option class="role-select-dropdown__item" value="-1" label="全部">全部</el-option>
                                    <el-option class="role-select-dropdown__item" value="1" label="是">是</el-option>
                                    <el-option class="role-select-dropdown__item" value="0" label="否">否</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="filter-form-item" label="商品状态">
                                <el-select
                                    size="small"
                                    v-model="searchStatus"
                                    popper-class="role-select-dropdown"
                                    style="width: 200px"
                                >
                                    <el-option class="role-select-dropdown__item" value="-1" label="全部">全部</el-option>
                                    <el-option class="role-select-dropdown__item" value="1" label="停用">停用</el-option>
                                    <el-option class="role-select-dropdown__item" value="0" label="启用">启用</el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="filter-right">
                        <el-button type="primary" size="small" icon="el-icon-search" @click="getBoxConfigsPage">搜索
                        </el-button>
                        <el-button type="primary" size="small" icon="el-icon-search" @click="delCache(30001)">刷新缓存
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

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
                @click="handleEdit">
                编辑
            </el-button>

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-md-person-add"
                @click="handleAddDetail">
                配置道具
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

            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-add"
                @click="exportBoxConfig">
                导出
            </el-button>

            <el-upload
                ref="importUpload"
                action="/api/import/box/config/import"
                :headers="this.$authInfo"
                :limit="1"
                :before-upload="onBeforeUpload"
                :data="{
                    pn : this.searchPn
                }"
                :on-success="importSuccess"
                :show-file-list="false">
                <el-button
                    class="operate-button"
                    type="primary"
                    size="small"
                    icon="ivu-icon ivu-icon-add">
                    导入
                </el-button>
            </el-upload>


            <el-button
                class="operate-button"
                type="primary"
                size="small"
                icon="ivu-icon ivu-icon-add"
                @click="handleCopyBoxConfig">
                复制
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
                    <el-table-column align="center" label="商品名称(简体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.box_name }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品名称(繁体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.boxNameZhtw }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品名称(英文)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.boxNameEnus }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="消费类型" width="200">
                        <template slot-scope="scope">
                            {{ formatCusType(scope.row.box_custype) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品分类" width="200">
                        <template slot-scope="scope">
                            {{ fomatBoxType(scope.row.box_type) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="销售价格(元)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.box_price }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品描述(简体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.box_desc }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品描述(繁体)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.boxDescZhtw }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品描述(英文)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.boxDescEnus }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品图标" width="200">
                        <template slot-scope="scope">
                            <img :src="scope.row.box_icon" style="width:50px;height:50px;"/>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="角标" width="200">
                        <template slot-scope="scope" >
                            <img :src="scope.row.box_jiaoimg" style="width:50px;height:50px;"/>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="支付方式" width="200">
                        <template slot-scope="scope">
                            {{ formatPayMethod(scope.row.bsList) }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="是否支持短代" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.box_sp == 1 ? "是" : "否"}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="是否首充加成" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.box_firstdouble  == 1 ? "是" : "否"}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="首充加成比例(%)" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.box_firstratio }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品状态" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.box_status == 1 ? "停用" : "启用" }}
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
            width="1100px"
            :before-close="handleBeforeCloseEdit"
            @close="handleClose">
            <el-form ref="ruleForm" :model="currentData" label-width="120px"
                     label-position="right" :inline="true" :rules="rules">

                <el-form-item label="名称(简体)" prop="box_name" >
                    <el-input v-model="currentData.box_name" placeholder="商品名称" size="medium"/>
                </el-form-item>

                <el-form-item label="名称(繁体)" >
                    <el-input v-model="currentData.boxNameZhtw" placeholder="商品名称" size="medium"/>
                </el-form-item>

                <el-form-item label="名称(英文)" >
                    <el-input v-model="currentData.boxNameEnus" placeholder="商品名称" size="medium"/>
                </el-form-item>

                <el-form-item label="分类">
                    <el-select
                        v-model="currentData.box_type"
                        placeholder="分类"
                        popper-class="role-select-dropdown"
                        size="medium"
                        style="width: 202px">
                        <el-option :value="0" label="普通宝箱">普通宝箱</el-option>
                        <el-option :value="1" label="俱乐部VIP">俱乐部VIP</el-option>
                        <el-option :value="2" label="俱乐部基金">俱乐部基金</el-option>
                        <el-option :value="3" label="俱乐部喇叭">俱乐部喇叭</el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="应用" prop="box_pn">
                    <el-select
                        v-model="currentData.box_pn"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        filterable
                        size="medium"
                        style="width: 202px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in appInfos"
                            :key="item.pn"
                            :label="item.aiName"
                            :value="item.pn">
                            {{ item.aiName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="销售价格" prop="box_price">
                    <el-input v-model="currentData.box_price" placeholder="销售价格" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

                <el-form-item label="商品价值" prop="box_value">
                    <el-input v-model="currentData.box_value" placeholder="商品价值" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

                <el-form-item label="描述(简体)" >
                    <el-input type="textarea" style="width: 202px" v-model="currentData.box_desc" placeholder="商品描述" size="medium"/>
                </el-form-item>

                <el-form-item label="描述(繁体)" >
                    <el-input type="textarea" style="width: 202px" v-model="currentData.boxDescZhtw" placeholder="商品描述" size="medium"/>
                </el-form-item>

                <el-form-item label="描述(英文)" >
                    <el-input type="textarea" style="width: 202px" v-model="currentData.boxDescEnus" placeholder="商品描述" size="medium"/>
                </el-form-item>

                <el-form-item label="消费类型">
                    <el-select
                        v-model="currentData.box_custype"
                        placeholder="消费类型"
                        popper-class="role-select-dropdown"
                        size="medium"
                        style="width: 202px">
                        <el-option :value="1" label="消费型">消费型</el-option>
                        <el-option :value="2" label="非消费型">非消费型</el-option>
                        <el-option :value="3" label="订阅型">订阅型</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品语言">
                    <el-select
                        v-model="currentData.box_language"
                        placeholder="商品语言"
                        popper-class="role-select-dropdown"
                        size="medium"
                        style="width: 202px">
                        <el-option value="cn" label="中文">中文</el-option>
                        <el-option value="en" label="英文">英文</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="默认支付方式" prop="default_pm">
                    <el-select
                        v-model="currentData.default_pm"
                        placeholder="请选择支付方式"
                        popper-class="role-select-dropdown"
                        size="medium"
                        filterable
                        style="width: 200px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in payMethods"
                            :key="item.mid"
                            :label="item.name"
                            :value="item.mid">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品图片" >
                    <el-upload
                        class="img-uploader"
                        style="width: 202px"
                        action=""
                        :http-request="uploadImage"
                        :headers="this.$authInfo"
                        :show-file-list="false"
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError">
                        <img v-if="currentData.box_icon" :src="currentData.box_icon" class="img-info">
                        <el-button v-else size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="角标图片" prop="goodsImg">
                    <el-upload
                        class="img-uploader"
                        action="/api/newupload/save"
                        :headers="this.$authInfo"
                        :show-file-list="false"
                        style="width: 202px"
                        :on-success="handleUpload1Success"
                        :on-error="handleUpload1Error">
                        <img v-if="currentData.box_jiaoimg" :src="currentData.box_jiaoimg" class="img-info">
                        <el-button v-else size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="支持短代">
                    <el-radio-group v-model="currentData.box_sp" style="width: 202px">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="日限金额">
                    <el-input v-model="currentData.box_daylimit" placeholder="日限金额" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>
                <el-form-item label="月限金额">
                    <el-input v-model="currentData.box_monthlimit" placeholder="月限金额" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

                <el-form-item label="首冲加成比例">
                    <el-input v-model="currentData.box_firstratio" placeholder="首冲加成比例" size="medium" readonly/>
                </el-form-item>

                <el-form-item label="首冲加成">
                    <el-radio-group v-model="currentData.box_firstdouble" style="width: 202px">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="补足限制道具">
                    <el-select
                        v-model="currentData.box_limitItemIndex"
                        placeholder="请选择道具"
                        popper-class="role-select-dropdown"
                        size="medium"
                        style="width: 202px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in boxItems"
                            :key="item.itemIndex"
                            :label="item.itemName"
                            :value="item.itemIndex">
                            {{ item.itemName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="道具数量">
                    <el-input v-model="currentData.box_limitItemNum" placeholder="道具数量" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

                <el-form-item label="商品状态">
                    <el-radio-group v-model="currentData.box_status" style="width: 202px">
                        <el-radio :label="1" >停用</el-radio>
                        <el-radio :label="0" >启用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>

            <div>
                <el-divider><span>第三方序列号</span></el-divider>
                <el-table
                    class="manage-table"
                    header-row-class-name="manage-table-header"
                    border
                    fit
                    highlight-current-row
                    :data="currentData.bdList"
                    >
                    <el-table-column align="center" label="道具">
                        <template slot-scope="scope">
                            <template >
                                <el-select
                                    v-model="scope.row.payMid"
                                    placeholder="请选择"
                                    filterable
                                >
                                    <el-option
                                        class="role-select-dropdown__item"
                                        v-for="item in payMethods"
                                        :key="item.mid"
                                        :label="item.name"
                                        :value="item.mid">
                                        {{ item.name }}
                                    </el-option>
                                </el-select>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="第三方序列号">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.serialno" class="edit-input"
                                      size="small" />
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="详细配置" width="400">
                        <template slot-scope="scope">
                            <el-table
                                :data="scope.row.detail"
                                align="center"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                    align="center"
                                    prop="itemname"
                                    label="道具">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="普通点数">
                                    <template slot-scope="scope1">
                                        <el-input v-model="scope1.row.item_num" class="edit-input"
                                                  size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="特殊点数">
                                    <template slot-scope="scope1">
                                        <el-input v-model="scope1.row.special_num" class="edit-input"
                                                  size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" >
                                    <template  slot-scope="scope1" >
                                        <div >
                                            <el-button type="text" size="small"
                                                       @click="editDetail(scope1.row)">修改</el-button>
                                            <el-button type="text" size="small" @click="delDetail(scope.row, scope1.row)">删除</el-button>
                                        </div>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" >
                        <template  slot-scope="scope" >
                            <div v-if="currentDialogType == dialogType.EDIT">
                                <el-button type="text" size="small"
                                           @click="editGoodsExchange(scope.$index, scope.row)">修改</el-button>
                                <el-button type="text" size="small" @click="delGoodsExchange(scope.$index, scope.row)">删除</el-button>
                            </div>
                            <div v-else>
                                <el-button type="text" size="small"
                                           @click="cancelEditExchange(scope.$index, scope.row)">取消</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="width: 100%; margin-top: 16px; margin-bottom: 8px; border: 1px dashed #909399;"
                           icon="el-icon-plus" @click="addGoodsExchange">新增支付方式</el-button>
            </div>

            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="confirm">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible1"
            title="配置商品详细数据"
            width="800px">
            <el-form ref="ruleFormDetail" :model="currentData" label-width="120px"
                     label-position="right" >

                <el-form-item label="应用" >
                    <el-select
                        v-model="currentData.detail_box_appid"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        filterable
                        size="medium"
                        style="width: 202px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in appInfos"
                            :key="item.aiId"
                            :label="item.aiName"
                            :value="item.aiId">
                            {{ item.aiName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品" >
                    <el-select
                        v-model="currentData.detail_box_id"
                        placeholder="请选择商品"
                        popper-class="role-select-dropdown"
                        filterable
                        size="medium"
                        style="width: 202px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in boxConfigs"
                            :key="item.box_id"
                            :label="item.box_name"
                            :value="item.box_id">
                            {{ item.box_name }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="支付方式" prop="default_pm">
                    <el-select
                        v-model="currentData.detail_pay_method"
                        placeholder="请选择支付方式"
                        popper-class="role-select-dropdown"
                        size="medium"
                        style="width: 200px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in detailPayMethods"
                            :key="item.autoid"
                            :label="item.mname"
                            :value="item.autoid">
                            {{ item.mname }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择道具">
                    <el-select
                        v-model="currentData.detail_box_item"
                        placeholder="请选择道具"
                        popper-class="role-select-dropdown"
                        size="medium"
                        style="width: 202px">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in boxItems"
                            :key="item.itemIndex"
                            :label="item.itemName"
                            :value="item.itemIndex">
                            {{ item.itemName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="普通购买点数">
                    <el-input v-model="currentData.detail_item_num" placeholder="普通购买点数" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

                <el-form-item label="特殊购买点数">
                    <el-input v-model="currentData.detail_special_num" placeholder="特殊购买点数" size="medium"
                              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible1=false">取消</el-button>
                <el-button type="primary" @click="saveBoxDetail">保存</el-button>
            </div>
        </el-dialog>


        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible2"
            title="复制商品"
            width="600px">
            <el-form label-width="120px" label-position="right" >

                <el-form-item label="应用" >
                    <el-select
                        v-model="copyPn"
                        placeholder="请选择应用"
                        popper-class="role-select-dropdown"
                        filterable
                        size="medium">
                        <el-option
                            class="role-select-dropdown__item"
                            v-for="item in appInfos"
                            :key="item.pn"
                            :label="item.aiName"
                            :value="item.pn">
                            {{ item.aiName }}
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible2=false">取消</el-button>
                <el-button type="primary" @click="copyBoxConfig">复制</el-button>
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
        boxNameZhtw:"",
        boxNameEnus:"",
        box_desc:"",
        boxDescZhtw:"",
        boxDescEnus:"",
        box_type : 0,
        box_custype:1,
        box_language:"cn",
        box_icon:"",
        box_jiaoimg:"",
        box_sp:0,
        box_daylimit:0,
        box_monthlimit:0,
        box_firstdouble:0,
        box_firstratio : 0,
        box_status:0,
        bdList:[],
        box_limitItemNum:0,
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
                searchPn:'',
                searchGame: '',
                searchChannel:'',
                searchType:'0',
                searchSp:'-1',
                searchDouble:'-1',
                searchStatus: '-1',
                disabled:false,

                currentData: Object.assign({}, defaultData),
                tableDates: [],
                listTotal: 0,
                currentPage: 1,
                pageSize: 20,

                dialogVisible: false,
                dialogVisible1:false,
                dialogVisible2:false,
                dialogType: DialogType,

                dialogSubVisible : false,

                currentDialogType: DialogType.NEW,
                selectData: {}, // 当前选中的信息

                searchAppInfos:[],
                games:[],
                channels:[],
                appInfos : [],
                boxItems:[],
                payMethods:[], //支付方式
                defaultPayMethod:[],
                rules: {
                    box_name : [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    box_pn : [
                        { required: true, message: '请输入应用名称', trigger: 'change' }
                    ],
                    box_price: [
                        { required: true, message: '请输入销售价格', trigger: 'blur' }
                    ],
                    box_value: [
                        { required: true, message: '请输入商品价值', trigger: 'blur' }
                    ],

                    default_pm: [
                        { required: true, message: '请输入默认支付方式', trigger: 'change' }
                    ],

                },

                currentGoodsGain: {},
                currentGoodsExchange: {},

                boxConfigs:[],
                detailPayMethods:[],
                copyPn:''
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

            'currentData.box_firstdouble' (newValue, oldValue) {
                if (newValue == 1) {
                    this.currentData.box_firstratio = 100
                } else {
                    this.currentData.box_firstratio = 0
                }
            },

            'searchGame' (newValue, oldValue) {
                this.getGameToChannel(newValue);
                this.getTotalApps(newValue, "");
            },

            'searchChannel' (newValue, oldValue) {
                this.getTotalApps(this.searchGame, newValue);
            },

            'currentData.detail_box_appid' (newValue, oldValue) {
                if (newValue) {
                    this.loadBoxConfigByAppid(newValue)
                }
            },

            'currentData.detail_box_id' (newValue, oldValue) {
                if (newValue) {
                    this.loadPayMethodByBoxId(newValue)
                }
            }
        },
        created () {
            this.getBoxConfigsPage()
            this.getLimitMainGames()
            this.getLimitChannels()
            this.getBoxItems()
            this.getAllApps()
            this.getPayMethods()
        },

        methods: {
            async getBoxConfigsPage () {
                const self = this
                self.listLoading = true
                box.getBoxConfigsPage(self.currentPage, self.pageSize, self.searchPn, self.searchType, self.searchSp,
                    self.searchDouble, self.searchStatus).then(result => {
                    self.listLoading = false
                    if (result.data.rows) {
                        self.tableDates = result.data.rows
                    } else {
                        self.tableDates = []
                    }
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
                if (this.games && this.games.length > 0) {
                    this.searchGame = this.games[0].gameId
                } else {
                    this.searchGame = ''
                }
            },

            async getLimitChannels () {
                const res = await channel.getLimitChannels()
                this.channels = res.data
            },

            async getGameToChannel (gameId) {
                const res = await channel.getGameToChannel(gameId)
                this.channels = res.data
                if (this.channels && this.channels.length > 0) {
                    this.searchChannel = this.channels[0].channelId
                } else {
                    this.searchChannel = ''
                }
            },

            async getTotalApps (game, channel) {
                const res = await app.getTotalApps(game, channel)
                this.searchAppInfos = res.data
                if (this.searchAppInfos && this.searchAppInfos.length > 0) {
                    this.searchPn = this.searchAppInfos[0].pn
                } else {
                    this.searchPn = ''
                }
            },

            async loadBoxConfigByAppid (appId) {
                const res = await box.getBoxConfigList(appId)
                this.boxConfigs = res.data
            },

            async loadPayMethodByBoxId (boxId) {
                const res = await box.getBoxPayMethodList(boxId)
                this.detailPayMethods = res.data
            },

            async getAllApps () {
                const res = await app.getApps("", "")
                this.appInfos = res.data
            },

            async getPayMethods() {
                const res = await box.getPayMethod()
                this.payMethods = res.data
            },

            async getGainItems() {
                const res = await goods.getItems()
                this.gainItems = res.data
            },

            async getBoxItems() {
                const res = await box.getBoxItems()
                this.boxItems = res.data
                this.boxItems.unshift({itemIndex:-1,itemName:'无限制道具'})
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

            async handleEdit () {
                const self = this
                if (!self.selectData.box_id) {
                    self.$message({
                        type: 'error',
                        message: '请选择商品!'
                    })
                    return
                }
                // 重置保存状态
                self.isUpdate = false
                self.defaultPayMethod = [{
                    serialno:"",
                    mname : "请选择默认支付方式"
                }]

                const res = await box.getBoxConfig(self.selectData.box_id)
                self.currentData = deepClone(res.data)
                for (const item of self.currentData.bdList) {
                    const data = new Map()
                    data.serialno = item.serialno
                    data.mname = item.mname
                    self.defaultPayMethod.push(data)
                    if (self.currentData.box_serial == item.serialno) {
                        self.currentData.default_pm = item.payMid
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
            handleDel () {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.box_id) {
                    self.$message({
                        type: 'error',
                        message: '请选择商品!'
                    })
                    return
                }

                self.$confirm(`确认删除商品“${self.currentData.box_name}”?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append('boxid', self.currentData.box_id)

                    box.deleteItem(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '商品删除成功!'
                        })
                        self.tableDates = self.tableDates.filter(item => {
                            return item.box_id != self.currentData.box_id
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

                if (!self.currentData.bdList || self.currentData.bdList.length <= 0) {
                    self.$message({
                        type: 'error',
                        message: '请至少填写一个第三方支付序列号'
                    })
                    return
                }
                const payMids = self.currentData.bdList.filter(item => {
                    return item.payMid == self.currentData.default_pm
                })
                if (!payMids || payMids.length <= 0) {
                    self.$message({
                        type: 'error',
                        message: '默认第三方支付序列号必须填写'
                    })
                    return
                }

                let form = new FormData();
                form.append('box_id', self.currentData.box_id)
                form.append('box_name', self.currentData.box_name)
                form.append('box_name_zh_tw', self.currentData.boxNameZhtw)
                form.append('box_name_en_us', self.currentData.boxNameEnus)
                form.append('box_custype', self.currentData.box_custype)
                form.append('box_desc', self.currentData.box_desc)
                form.append('box_desc_zh_tw', self.currentData.boxDescZhtw)
                form.append('box_desc_en_us', self.currentData.boxDescEnus)

                for (const item of self.appInfos) {
                    if (self.currentData.box_pn == item.pn){
                        form.append('box_appid', item.aiId)
                    }
                }

                form.append('box_item', "")
                form.append('box_type', self.currentData.box_type)
                form.append('box_price', self.currentData.box_price)
                form.append('box', self.currentData.box_icon)
                form.append('box_language', self.currentData.box_language)
                form.append('default_pm', self.currentData.default_pm)
                form.append('box_sp', self.currentData.box_monthlimit)
                form.append('box_daylimit', self.currentData.box_daylimit)
                form.append('box_monthlimit', self.currentData.box_monthlimit)
                form.append('box_firstdouble', self.currentData.box_firstdouble)
                form.append('box_firstratio', self.currentData.box_firstratio)
                form.append('box_value', self.currentData.box_value)
                form.append('box_limitItemIndex', self.currentData.box_limitItemIndex)
                form.append('box_limitItemNum', self.currentData.box_limitItemNum)
                form.append('box_status', self.currentData.box_status)


                for (const item of self.currentData.bdList) {
                    form.append(`serial_`+item.payMid, item.serialno);
                }


                box.executeBoxConfig(form).then(result => {
                    self.dialogVisible = false

                    self.selectData = deepClone(self.currentData)

                    self.$message({
                        type: 'success',
                        message: '修改商品信息成功'
                    })
                    self.getBoxConfigsPage()
                }).catch((error) => {
                })
            },
            addGoods () {
                const self = this
                if (!self.currentData.bdList ||  self.currentData.bdList.length <= 0) {
                    self.$message({
                        type: 'error',
                        message: '请至少填写一个第三方支付序列号'
                    })
                    return
                }
                const payMids = self.currentData.bdList.filter(item => {
                    return item.payMid == self.currentData.default_pm
                })
                if (!payMids || payMids.length <= 0) {
                    self.$message({
                        type: 'error',
                        message: '默认第三方支付序列号必须填写'
                    })
                    return
                }

                let form = new FormData();
                form.append('box_id', -1)
                form.append('box_name', self.currentData.box_name)
                form.append('box_name_zh_tw', self.currentData.boxNameZhtw)
                form.append('box_name_en_us', self.currentData.boxNameEnus)
                form.append('box_custype', self.currentData.box_custype)
                form.append('box_desc', self.currentData.box_desc)
                form.append('box_desc_zh_tw', self.currentData.boxDescZhtw)
                form.append('box_desc_en_us', self.currentData.boxDescEnus)

                for (const item of self.appInfos) {
                    if (self.currentData.box_pn == item.pn){
                        form.append('box_appid', item.aiId)
                    }
                }

                form.append('box_item', "")
                form.append('box_type', self.currentData.box_type)
                form.append('box_price', self.currentData.box_price)
                form.append('box', self.currentData.box_icon)
                form.append('box_language', self.currentData.box_language)
                form.append('default_pm', self.currentData.default_pm)
                form.append('box_sp', self.currentData.box_monthlimit)
                form.append('box_daylimit', self.currentData.box_daylimit)
                form.append('box_monthlimit', self.currentData.box_monthlimit)
                form.append('box_firstdouble', self.currentData.box_firstdouble)
                form.append('box_firstratio', self.currentData.box_firstratio)
                form.append('box_value', self.currentData.box_value)
                form.append('box_limitItemIndex', self.currentData.box_limitItemIndex)
                form.append('box_limitItemNum', self.currentData.box_limitItemNum)
                form.append('box_status', self.currentData.box_status)

                for (const item1 of self.currentData.bdList) {
                    form.append(`serial_`+item1.payMid, item1.serialno);
                }

                box.executeBoxConfig(form).then(result => {
                    const data = result.data

                    self.dialogVisible = false
                    self.$message({
                        type: 'success',
                        message: '新增商品成功'
                    })
                    this.getBoxConfigsPage()
                }).catch(error => {
                })
            },

            resetQueryParam () {
                this.searchAppName = ""
                this.getBoxConfigsPage()
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
                    this.getBoxConfigsPage()
                }
            },
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            },

            handlePagination (params) {
                this.getBoxConfigsPage()
            },

            handleSizeChange (pageSize) {
                this.pageSize = pageSize
                this.getBoxConfigsPage()
            },

            handleCurrentChange (page) {
                this.currentPage = page
                this.getBoxConfigsPage()
            },

            handleUploadSuccess(res,file) {
                if (ResultCode.SUCCESS.code === res.code) {
                    this.$Message.success('商品图片上传成功')
                    this.currentData.box_icon = res.data[0].fileurl
                } else {
                    this.$Message.error('商品图片上传失败')
                }
            },

            handleUploadError() {
                this.$Message.error('上传失败')
            },

            handleUpload1Success(res,file) {
                if (ResultCode.SUCCESS.code === res.code) {
                    this.$Message.success('角标图片上传成功')
                    this.currentData.box_jiaoimg = res.data[0].ImgUrl
                } else {
                    this.$Message.error('角标图片上传失败')
                }
            },

            handleUpload1Error() {
                this.$Message.error('上传失败')
            },

            addGoodsExchange() {
                this.currentData.bdList.push({
                    payMid: 1,
                    serialno: ''
                })
            },
            editGoodsExchange(index, row) {
                const self= this
                self.$confirm(`确认修改该支付方式?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append('aid', row.pmid)
                    form.append('serialno', row.serialno)
                    form.append('boxid', self.currentData.box_id)
                    form.append('pmc', row.payMid)

                    box.uptSerialno(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '修改成功!'
                        })
                    }, result => {
                    })
                }).catch(err => {
                })
            },
            cancelEditExchange(index, row) {
                this.currentData.bdList.splice(index, 1);
            },

            delGoodsExchange(index, row) {
                const self= this
                self.$confirm(`确认删除该支付方式?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let form = new FormData()
                    form.append('aid', row.pmid)
                    form.append('boxid', self.currentData.box_id)

                    box.delSerialno(form).then(result => {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.currentData.bdList.splice(index, 1);
                    }, result => {
                    })
                }).catch(err => {
                })

            },

            handleUp() {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.box_id) {
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


                const tempOption = self.tableDates[self.currentData.index - 1];
                let form = new FormData()
                form.append('sct_box_id', self.currentData.box_id)
                form.append('to_box_id', tempOption.box_id)

                box.moveUpAndDown(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '上移成功!'
                    })
                    debugger
                    self.$set(self.selectData, 'index', self.selectData.index - 1)
                    this.getBoxConfigsPage()
                }, result => {
                })
            },

            handleDown() {
                const self = this
                self.currentData = deepClone(self.selectData)
                if (!self.selectData.box_id) {
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

                const tempOption = self.tableDates[self.currentData.index + 1];
                let form = new FormData()
                form.append('sct_box_id', self.currentData.box_id)
                form.append('to_box_id', tempOption.box_id)


                box.moveUpAndDown(form).then(result => {
                    self.$message({
                        type: 'success',
                        message: '下移成功!'
                    })
                    self.$set(self.selectData, 'index', self.selectData.index + 1)
                    this.getBoxConfigsPage()
                }, result => {
                })
            },

            formatPayMethod(list){
                var str="";
                if(list!=null&&list.length>0){
                    var len = list.length;
                    for(var i=0;i<len;i++){
                        var obj = list[i];
                        str += obj.mname;
                        if(i+1<len){
                            str +=",";
                        }
                    }
                }
                return str;
            },

            formatCusType(ct){
                var ct_name ="未知类型";
                switch(ct){
                    case 1:
                        ct_name="消费型";
                        break;
                    case 2:
                        ct_name="非消费型";
                        break;
                    case 3:
                        ct_name="订阅型";
                        break;
                    default:
                        ct_name="未知类型";
                }
                return ct_name;
            },
            fomatBoxType(value){
                var name ="未知类型";
                switch(value){
                    case 0:
                        name ="普通宝箱";
                        break;
                    case 1:
                        name ="VIP";
                        break;
                    case 2:
                        name ="促销礼包";
                        break;
                    case 3:
                        name ="道具";
                        break;
                    case 4:
                        name ="至尊月卡";
                        break;
                    case 5:
                        name ="特惠礼包";
                        break;
                    case 6:
                        name ="单机宝箱";
                        break;
                    case 7:
                        name ="一次宝箱";
                        break;
                    case 8:
                        name ="特惠月卡";
                        break;
                    case 9:
                        name ="优惠卷宝箱";
                        break;
                    case 10:
                        name ="娃娃币";
                        break;
                    case 11:
                        name ="补足宝箱";
                        break;
                    default:
                        name="未知类型";
                }
                return name;
            },

            uploadImage(param){
                let formData = new FormData()
                formData.append('boxFile', param.file)
                box.uploadImage(formData).then(res => {
                    if (ResultCode.SUCCESS.code === res.code) {
                        this.$Message.success('商品图片上传成功')
                        this.currentData.box_icon = res.data[0].fileurl
                    } else {
                        this.$Message.error('商品图片上传失败')
                    }
                }).catch(response => {
                })
            },

            delCache(code){
                let form = new FormData()
                form.append("code",code)
                form.append("arg0",this.searchPn)
                form.append("arg1",this.searchType)
                box.refreshCache(form).then(res => {
                    this.$Message.success('刷新成功')
                }).catch(response => {
                })
            },
            handleAddDetail () {
                this.currentData = deepClone(Object.assign({}, defaultData))
                this.dialogVisible1 = true
            },

            saveBoxDetail() {
                const self = this

                let form = new FormData();
                form.append('detail_box_id', self.currentData.detail_box_id)
                form.append('detail_pay_method', self.currentData.detail_pay_method)
                form.append('detail_item_num', self.currentData.detail_item_num)
                form.append('detail_box_item', self.currentData.detail_box_item)
                form.append('detail_box_appid', self.currentData.detail_box_appid)
                form.append('detail_special_num', self.currentData.detail_special_num)

                box.executeBoxDetail(form).then(result => {
                    const data = result.data
                    if(data==0){
                        self.dialogVisible1 = false
                        self.$message({
                            type: 'success',
                            message: '新增商品成功'
                        })
                        self.delCache(30003)
                    }else if(data==1){
                        self.$message({
                            type: 'success',
                            message: '更新成功'
                        })
                    }else {
                        self.$message({
                            type: 'error',
                            message: '保存失败，请确认是否已经存在该道具'
                        })
                    }
                }).catch(error => {
                })
            },

            editDetail (row) {
                const self = this
                let form = new FormData();
                form.append('did', row.detail_id)
                form.append('num', row.item_num)
                form.append('special', row.special_num)

                box.updateBoxDetail(form).then(result => {
                    const data = result.data
                    if(data==0) {
                        self.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        self.delCache(30003)
                    }
                }).catch(error => {
                })

            },
            delDetail (row, row1) {
                const self = this
                debugger
                let form = new FormData();
                form.append('dtid', row1.detail_id)
                form.append('boxid', self.currentData.box_id)

                box.delBoxDetail(form).then(result => {
                    const data = result.data
                    if(data==0) {
                        self.$message({
                            type: 'success',
                            message: '删除成功'
                        })

                        row.detail = row.detail.filter(item => {
                            return item.detail_id != row1.detail_id
                        })
                        self.delCache(30003)
                    }
                }).catch(error => {
                })
            },

            exportBoxConfig() {
                const self = this
                if (!self.searchPn) {
                    self.$message.error("请输入应用")
                    return
                }

                self.$ajax.get('/api/import/box/config/export', {
                    params: {pn:self.searchPn},
                    responseType: 'blob',
                    headers: this.$authInfo
                }).then(res => {
                    debugger
                    let fileName = self.searchPn + ".xls"
                    if (window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(res.data, fileName)
                    } else {
                        const link = document.createElement('a')
                        link.href = window.URL.createObjectURL(res.data)
                        link.download = fileName
                        link.click()
                        window.URL.revokeObjectURL(link.href)
                    }
                })


            },

            importBoxConfig() {

            },

            handleCopyBoxConfig() {
                this.dialogVisible2 = true
                this.copyPn = ''
            },

            copyBoxConfig () {
                const self = this
                if (!self.copyPn) {
                    self.$message({
                        type: 'error',
                        message: '请选择需要复制至的应用包'
                    })
                    return
                }

                if (self.copyPn == self.searchPn) {
                    self.$message({
                        type: 'error',
                        message: '不能复制到本身应用包'
                    })
                    return
                }

                let form = new FormData()
                form.append("pn", self.searchPn)
                form.append("toPn", self.copyPn)

                box.copyBox(form).then(result => {
                    self.dialogVisible2 = false
                    const data = result.data
                    if(data==0) {
                        self.$message({
                            type: 'success',
                            message: '复制成功'
                        })
                        self.delCache(30003)
                        self.getBoxConfigsPage()
                    } else {
                        self.$message({
                            type: 'error',
                            message: '复制失败'
                        })
                    }
                }).catch(error => {
                })
            },
            onBeforeUpload () {
                if (this.searchPn) {
                    return true
                } else {
                    this.$message({
                        type: 'error',
                        message: '请选择应用'
                    })
                    return false
                }
            },
            importSuccess (resp,file) {
                if (resp.code === 200 && resp.data.ret === 0) {
                    this.$Message.success(resp.data.msg)
                } else {
                    this.$Message.error(resp.data.msg)
                }
                this.$refs.importUpload.clearFiles();
                this.getBoxConfigsPage()
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
    .filter-container {
        margin-bottom: 10px;
    }

    .filter-container + .manage-main {
        margin-top: 20px;
    }

    .filter-form {
        overflow: hidden;
    }

    .filter-form-item {
        margin-bottom: 10px;
    }

    .filter-wrapper {
        border: 1px solid #EBEEF5;
        border-radius: 4px;
    }

    .filter-header {
        background-color: rgba(245, 245, 245, 1);
    }

    .filter-title {
        padding: 6px 10px;
        font-weight: bold;
        font-size: 14px;
        color: #000;
    }

    .filter-main {
        display: flex;
        position: relative;
        padding: 9px 10px 0 10px;
    }

    .filter-left {
        height: 50px;
        margin-right: 20px;
        overflow: hidden;
    }

    .filter-right {
        display: flex;
        align-items: center;
        height: 42px;
    }

    .filter-form {
    //height: 51px;
    }

    .filter-form--open {
        height: auto;
    }
</style>
