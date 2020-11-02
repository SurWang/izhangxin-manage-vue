<template>

    <el-dialog
        class="x-dialog"
        :custom-class="dialogClass"
        v-bind:visible="value"
        v-on:update:visible="$emit('input', $event)"
        v-bind="Object.assign({}, {
                    'title': '编辑',
                    'width': '600px',
                    'append-to-body': true
                } , $attrs)"
        v-on="Object.assign({}, {

                }, $listeners)"
        >

        <template v-if="data">
            <el-form
                ref="xForm"
                :model="modalData"
                @submit.native.prevent
                :label-width="labelWidth || '12em'">
                <slot />
            </el-form>
        </template>
        <template v-else>
            <slot/>
        </template>


        <span slot="footer">
            <template v-if="isShowOk">
                <el-button @click="$emit('input', false)">取 消</el-button>
                <el-button v-show="showConfirm" type="primary" @click="ok"><b>确 定</b></el-button>
            </template>
            <template v-else>
                <el-button @click="$emit('input', false)">关 闭</el-button>
            </template>
        </span>
    </el-dialog>
</template>


<!--这里改为v-model-->

<script>
    import XItem from './XItem'
    import qs from 'qs'
    export default {
        name: 'XDialog',
        components: { XItem },
        // emit: ok, response
        props: {
            // 用作显示隐藏
            value: {
                type: Boolean
            },
            // data值, 当传入时 当前dialog认定为form, 否则为自定义
            data: {
                type: Object,
                default: undefined
            },

            labelWidth: {
                type: String
            },

            showOk: {
                default: true
            },

            url: {
                type: String,
                default: 'SYSTEM'
            },

            requestType: {
                type: String,
                default: 'post'
            },

            headers: {
                type: Object
            },
            params: {
                type: Object
            },

            beforeSubmit: {
                type: Function
            },

            showConfirm: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                // 这里的modalData只是为了支持校验添加的属性
                modalData: {

                }
            }
        },
        provide () {
            return {
                pModalData: this.$data
            }
        },
        computed: {
            isShowOk () {
                return this.showOk === true || this.showOk === 'true'
            },
            dialogClass () {
                return this.data ? 'x-dialog-body-form' : 'x-dialog-body-common'
            }
        },

        methods: {
            getParam () {
                let param = {}
                if (this.$slots.default) {
                    for (let vnode of this.$slots.default) {
                        if (vnode.componentInstance && vnode.componentInstance.isXItem) {
                            Object.assign(param, vnode.componentInstance._xGetData())
                        }
                    }
                }
                return param
            },
            async ok () {

                if (this.$refs.xForm) {

                    // validate()
                    const v = () => {
                        return new Promise((resolve, reject) => {
                            this.$refs.xForm.validate(res => {
                                resolve(res)
                            })
                        })
                    }
                    const result = await v()
                    if (!result) {
                        return
                    }

                }
                // 校验参数


                // 处理param
                let mergeParams = Object.assign({}, this.getParam(), this.params)

                if (typeof this.beforeSubmit === 'function') {
                    mergeParams = this.beforeSubmit(mergeParams)
                    if (!mergeParams) {
                        return
                    }
                }


                if (this.url == 'SYSTEM') {
                    this.$emit('ok', mergeParams)
                    return
                }
                // 当用get需要放到params
                if (this.requestType.toLowerCase() === 'get') {
                    mergeParams = {
                        params: mergeParams
                    }
                }


                // 处理headers
                let DEFAULT_HEADER = {}
                let requestType = this.requestType
                // legacy post
                if (this.requestType.toLowerCase() === 'lpost') {
                    DEFAULT_HEADER['Content-Type'] = 'application/x-www-form-urlencoded'
                    requestType = 'post'
                    mergeParams = qs.stringify(mergeParams)
                }
                let mergeHeader = Object.assign({}, DEFAULT_HEADER, this.headers)


                this.$ajax[requestType](this.url, mergeParams, {
                    headers: mergeHeader
                }).then(res => {

                    // 如果调用者没有处理, 默认提示操作成功
                    if (!this.$listeners.ok) {
                        this.$emit('input', false)
                        this.$message.success('操作成功')
                        return
                    }
                    this.$emit('ok', res)
                }).catch(res => {
                    if (!this.$listeners.error) {
                        // this.$message.error('操作失败'), 现在失败的提示全由ajax处理
                        console.warn(res)
                        return
                    }
                    this.emit('error', res)
                })
            }
        },

        watch: {
            // 当显示隐藏动作时 重新赋值
            value: {
                handler (val, oldVal) {
                    // 显示
                    if (val && this.data) {
                        this.modalData = Object.assign({}, this.data)
                        this.$nextTick(() => {
                            if (this.$slots.default) {
                                for (let vnode of this.$slots.default) {
                                    let target = vnode.componentInstance
                                    if (target && target.isXItem) {
                                       target._xSetValue(this.modalData[target._xGetName()])
                                    }
                                }
                            }
                            // 后面可优化用 标识 input的validateEvent属性来不校验

                            this.$nextTick(() => {
                                this.$refs.xForm.clearValidate()
                            })
                        })
                    }
                },
                // 立即执行一次
                immediate: true
            }
        }
    }
</script>

<style scoped>

</style>
