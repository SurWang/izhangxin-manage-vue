<template>
    <div class="manage-table-column-checkbox">
        <el-button class="column-checkbox-button" size="mini" @click="dialogVisible = true">
            <i class="el-icon-menu"></i>
        </el-button>

        <el-dialog
            title="表格字段"
            width="800px"
            :visible.sync="dialogVisible">
            <div class="dialog-item">
                <div class="dialog-subtitle">已选字段</div>
                <div class="dialog-content">
                    <el-tag
                        class="dialog-tag"
                        closable
                        size="small"
                        v-for="(item, index) in selectedColumnList"
                        :key="item.type"
                        @close="handleTagClose(index)">
                        {{ item.name }}
                    </el-tag>
                </div>
            </div>
            <div class="dialog-item">
                <div class="dialog-subtitle">备选字段</div>
                <div class="dialog-content">
                    <el-tag
                        class="dialog-tag dialog-tag--pointer"
                        type="info"
                        size="small"
                        v-for="(item, index) in unSelectedColumnList"
                        :key="item.type"
                        @click="handleTagClick(index)">
                        {{ item.name }}
                    </el-tag>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: 'TableColumnCheckbox',
        props: {
            initSelectedColumnList: {
                type: Array,
                default: []
            },
            initAllColumnList: {
                type: Array,
                default: []
            }
        },
        data: function () {
            return {
                dialogVisible: false,
                allColumnList: this.initAllColumnList,
                selectedColumnList: JSON.parse(JSON.stringify(this.initSelectedColumnList))
            }
        },
        computed: {
            unSelectedColumnList: function () {
                return _.differenceBy(this.allColumnList, this.selectedColumnList, 'type')
            }
        },
        watch: {
            initSelectedColumnList: function () {
                this.selectedColumnList = JSON.parse(JSON.stringify(this.initSelectedColumnList))
            }
        },
        methods: {
            handleTagClose: function (index) {
                this.selectedColumnList.splice(index, 1)
            },

            handleTagClick: function (index) {
                this.selectedColumnList.push(this.unSelectedColumnList[index])
            },

            handleConfirm: function () {
                this.$emit('column-change', this.selectedColumnList)
                this.dialogVisible = false
            },

            handleCancel: function () {
                this.selectedColumnList = JSON.parse(JSON.stringify(this.initSelectedColumnList))
                this.dialogVisible = false
            }
        }
    }
</script>

<style scoped>
    .manage-table-column-checkbox {
        position: relative;
        height: 0;
    }

    .column-checkbox-button {
        position: absolute;
        right: 0;
        top: -46px;
        padding: 7px;
    }

    .column-checkbox-button [class*=el-icon-] {
        vertical-align: middle;
    }

    .column-checkbox-button .el-icon-menu {
        font-size: 20px;
    }

    .dialog-subtitle {
        height: 34px;
        margin-bottom: 10px;
        border-bottom: 1px solid #DCDFE6;
        font-weight: bold;
        font-size: 14px;
        line-height: 34px;
    }

    .dialog-tag {
        margin: 0 10px 10px 0;
    }

    .dialog-tag--pointer {
        cursor: pointer;
    }
</style>
