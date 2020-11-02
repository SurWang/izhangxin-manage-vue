<template>
    <!-- 移动端时，搜索面板会移动到隐藏到右侧，通过点击悬浮按钮展示和关闭 -->
    <div class="filter-container" :class="{'show': $isMobile && isShowFilterPanel}" @keyup.enter="search">
        <!-- 搜索面板遮罩 -->
        <div class="filter-mask" v-if="$isMobile" @click="handleFilterHandleButtonClick"> </div>
        <div class="filter-wrapper">
            <!-- 搜索面板展开关闭按钮 -->
            <div class="filter-handle-button" v-if="$isMobile" @click="handleFilterHandleButtonClick">
                <i class="el-icon-search" v-if="!isShowFilterPanel"></i>
                <i class="el-icon-close" v-else></i>
            </div>
            <div class="filter-header">
                <div class="filter-title">搜索</div>
            </div>
            <div class="filter-main">
                <div class="filter-left" :class="{'filter-form--open': isShowMoreSearch && isOpenSearch}">
                    <el-form
                        inline
                        @submit.native.prevent
                        class="filter-form"
                        label-width="6em">

                        <slot></slot>
                    </el-form>
                </div>
                <div class="filter-right">
                    <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索
                    </el-button>
                    <el-button size="small" icon="el-icon-refresh" @click="resetFilterForm">重置
                    </el-button>
                </div>
                <div class="filter-open-button" v-if="isShowMoreSearch" @click="handleOpenMoreSearchClick">
                    <template v-if="!isOpenSearch">
                        更多选项
                        <Icon type="ios-arrow-down"/>
                    </template>
                    <template v-else>
                        收起
                        <Icon type="ios-arrow-up"/>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'XSearch',
        data () {
            return {
                isShowMoreSearch: false, // 是否展示更多搜索按钮
                isOpenSearch: false, // 是否展开更多搜索
                isShowFilterPanel: false, // 控制面板展开和关闭
            }
        },
        created: function () {
            window.addEventListener('resize', this.handleResize)
        },

        mounted: function () {
            this.handleResize()
        },
        methods: {
            handleOpenMoreSearchClick: function () {
                this.isOpenSearch = !this.isOpenSearch
            },
            getParams () {
                let param = {}
                for (let vnode of this.$slots.default) {
                    if (vnode.componentInstance && vnode.componentInstance.isXItem) {
                        Object.assign(param, vnode.componentInstance._xGetData())
                    }
                }
                return param
            },
            search () {
                this.$emit('search', this.getParams())
            },
            resetFilterForm: function () {
                if (this.$slots.default) {
                    for (let vnode of this.$slots.default) {
                        let target = vnode.componentInstance
                        if (target && target.isXItem) {
                            target._xResetValue()
                        }
                    }
                }
                this.$emit('reset-form')
            },
            handleResize: function () {
                const filterFormEle = document.querySelector('.filter-form')
                if (!filterFormEle) {
                    return
                }
                const searchFormWidth = filterFormEle.offsetWidth
                let searchFormItemAllWidth = 0
                const searchFormItemEles = document.querySelectorAll('.filter-form-item')
                if (searchFormItemEles && searchFormItemEles.length > 0) {
                    for (const tempEle of searchFormItemEles) {
                        searchFormItemAllWidth += tempEle.offsetWidth
                    }
                    this.isShowMoreSearch = searchFormItemAllWidth > searchFormWidth
                } else {
                    this.isShowMoreSearch = false
                }
            },
            /**
             * 控制条件筛选面板显示隐藏
             */
            handleFilterHandleButtonClick: function () {
                this.isShowFilterPanel = !this.isShowFilterPanel
                this.$emit('toggle-panel', this.isShowFilterPanel)
            }
        }
    }
</script>

<style lang="scss">
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

    .filter-open-button {
        position: absolute;
        bottom: -22px;
        left: 50%;
        padding: 0 20px;
        border: 1px solid #EBEEF5;
        border-top-color: #fff;
        border-radius: 0 0 6px 6px;
        transform: translateX(-50%);
        /*margin-right: 10px;*/
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
    }

    .filter-open-button:hover {
        color: #48f;
    }

    .filter-date-picker {
        width: 199px;
    }

    .filter-form__button {
        font-size: 14px;
    }

    .filter-handle-button {
        position: absolute;
        top: 80px;
        left: -48px;
        width: 48px;
        height: 48px;
        background-color: #1ab394;
        border-radius: 6px 0 0 6px!important;
        font-size: 24px;
        line-height: 48px;
        color: #fff;
        text-align: center;
        cursor: pointer;
    }

    @media only screen and (max-width:1024px) {
        .filter-wrapper {
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

        .filter-mask {
            display: none;
            position: fixed;
            z-index: 99;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .6);
        }

        /** filter模块 **/
        .filter-container {
            position: relative;
            margin-bottom: 0;
            &.show {
                .filter-wrapper {
                    z-index: 999;
                    transform: translateX(0);
                }
                .filter-mask {
                    display: block;
                }
            }
        }

        .filter-header {
            flex-shrink: 0;
            background-color: transparent;
        }

        .filter-main {
            flex: auto;
            flex-direction: column;
            height: 0;
        }

        .filter-left {
            flex: auto;
            height: 0;
            margin-right: 0;
            overflow: auto;
        }

        .filter-right {
            justify-content: flex-end;
        }

        .filter-form {
            height: auto;
        }

        .filter-open-button {
            display: none;
        }

        .filter-form-item {
            width: 100%;

            .el-form-item__label {
                text-align: left;
            }
            .el-form-item__content {
                width: 100%;
            }
            .el-select {
                width: 100%;
            }
            .el-input {
                width: 100% !important;
            }
        }
    }
</style>
