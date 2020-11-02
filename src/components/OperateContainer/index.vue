<template>
    <div class="operate-container" :class="{'show': $isMobile && isShowOperatePanel}">
        <div class="operate-mask"></div>
        <div class="operate-wrapper">
            <!-- 搜索面板展开关闭按钮 -->
            <div class="operate-handle-button" v-if="$isMobile" @click="handleOperateHandleButtonClick">
                <i class="el-icon-menu" v-if="!isShowOperatePanel"></i>
                <i class="el-icon-close" v-else></i>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'OperateContainer',
        data: function () {
            return {
                isShowOperatePanel: false
            }
        },
        methods: {
            handleOperateHandleButtonClick: function () {
                this.isShowOperatePanel = !this.isShowOperatePanel
            }
        }
    }
</script>

<style lang="scss">
    .operate-container + .manage-table-column-checkbox {
        margin-top: 0;
    }

    .operate-container {
        height: 33px;
        margin-bottom: 10px;
    }

    .operate-wrapper {
        display: flex;
    }

    .operate-handle-button {
        position: absolute;
        top: 138px;
        left: -48px;
        width: 48px;
        height: 48px;
        background-color: #f56c6c;
        border-radius: 6px 0 0 6px!important;
        font-size: 24px;
        line-height: 48px;
        color: #fff;
        text-align: center;
        cursor: pointer;
    }

    @media only screen and (max-width: 1024px) {
        .operate-container + .manage-table-column-checkbox {
            margin-top: 46px;
        }

        .operate-wrapper {
            display: flex;
            flex-direction: column;
            position: fixed;
            z-index: 100;
            top: 0;
            right: 0;
            width: 260px;
            height: 100%;
            background-color: #fff;
            border: none;
            border-radius: 0;
            transition: all .25s cubic-bezier(.7,.3,.1,1);
            transform: translateX(100%);
        }

        .operate-mask {
            display: none;
            position: fixed;
            z-index: 99;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .6);
        }

        /** 操作按钮面板 **/
        .operate-container {
            margin-bottom: 0;
            &.show {
                .operate-wrapper {
                    transform: translateX(0);
                    z-index: 999;
                }
                .operate-mask {
                    display: block;
                }
            }
        }

        .operate-mask {
            position: fixed;
        }

        .operate-wrapper {
            position: fixed;
            top: 0;
            right: 0;
            width: 260px;
            padding: 20px;
            background-color: #fff;
        }

        .operate-button {
            margin-bottom: 10px;
        }

        .operate-button + .operate-button {
            margin-left: 0;
        }
    }
</style>
