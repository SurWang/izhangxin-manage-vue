<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
        <sidebar  @clickItem="clickItem" class="sidebar-container" />
        <div class="main-container" :class="{hasTagsView:needTagsView}">
            <div :class="{'fixed-header':fixedHeader}" v-if="!fullScreen">
                <navbar @updatepwd="openDialog" />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main ref="appMain" :class="{'full-screen': fullScreen}" />
        </div>

        <el-dialog
            custom-class="manage-dialog"
            :visible.sync="dialogVisible"
            title="修改密码"
            width="800px">
            <el-form ref="ruleForm" :model="currentData" label-width="85px"
                     label-position="left"  :rules="rules">

                <el-form-item label="旧密码" prop="oldPass">
                    <el-input type="password"  v-model="currentData.oldPass" placeholder="旧密码" />
                </el-form-item>

                <el-form-item label="新密码" prop="pass">
                    <el-input  type="password"  v-model="currentData.pass" placeholder="新密码" />
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="currentData.checkPass" placeholder="确认密码" />
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
    import { AppMain, Navbar, Sidebar, TagsView } from './components'
    import ResizeMixin from './mixin/ResizeHandler'
    import { updatePass } from '@/api/login/user'


    export default {
        name: 'Layout',
        components: {
            AppMain,
            Navbar,
            Sidebar,
            TagsView
        },

        mixins: [ResizeMixin],
        data () {
            var validatePass = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.currentData.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.currentData.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                lastUrl: '',
                dialogVisible: false,
                currentData: {},
                rules: {
                    oldPass: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' }
                    ],
                    pass: [
                        { required: true, validator:validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { required: true, validator: validatePass2, trigger: 'blur' }
                    ],
                }

            }
        },
        computed: {
            sidebar () {
                return this.$store.state.app.sidebar
            },
            device () {
                return this.$store.state.app.device
            },
            fixedHeader () {
                return this.$store.state.settings.fixedHeader
            },

            needTagsView () {
                return this.$store.state.settings.tagsView
            },

            classObj () {
                return {
                    hideSidebar: !this.sidebar.opened,
                    openSidebar: this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                }
            },
            fullScreen () {
                return this.$store.state.app.fullScreen
            }
        },
        created () {
            //this.$store.dispatch('organization/getOrganization')
            //this.$store.dispatch('config/getColumnConfig')
        },
        methods: {
            handleClickOutside () {
                this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
            },
            clickItem(url) {
                // 如果url相等 vue router不会跳转, 这里调用方法强制跳转
                if (this.lastUrl == url) {
                    this.$refs.appMain.reload()
                }
                this.lastUrl = url
            },
            openDialog() {
                this.dialogVisible = true
                if (this.$refs.ruleForm) {
                    this.$refs.ruleForm.resetFields()
                }
            },
            confirm() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        updatePass({ oldPass: this.currentData.oldPass.trim(),
                            pass: this.currentData.pass}).then(response => {
                                this.$message({
                                    type: 'success',
                                    message: '密码修改成功，请重新登录!'
                                })
                                this.$store.dispatch('user/logout')
                                this.$router.push(`/login`)

                        }).catch(error => {
                            reject(error)
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/styles/mixin.scss';
    @import '~@/styles/variables.scss';

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        overflow: hidden;

        &.mobile.openSidebar {
            position: fixed;
            top: 0;
        }
    }

    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }

    .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: calc(100% - #{$sideBarWidth});
        transition: width 0.28s;
    }

    .hideSidebar .fixed-header {
        width: calc(100% - 54px)
    }

    .mobile .fixed-header {
        width: 100%;
    }
</style>
