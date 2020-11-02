<template>
        <el-form-item
            v-if="getForm()"
            v-bind="Object.assign({}, {}, $attrs)"
            v-on="$listeners">
            <slot/>
        </el-form-item>

    <div
        v-else
    >
        <label class="el-form-item__label" :style="{width: labelWidthComputed}">
            {{$attrs.label}}
        </label>
        <div :style="{marginLeft: labelWidthComputed}">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'XItem',

        methods: {
            getForm() {
                const elFormTag = "ElForm"
                if (this.$parent.$vnode.tag.indexOf(elFormTag) != -1) {
                    return this.$parent
                }
                if ( this.$parent.$parent.$vnode.tag.indexOf(elFormTag) != -1) {
                    return this.$parent.$parent
                }
                return false
            }
        },

        props: {
            labelWidth: {
                type: String,
                default: '12em'
            }
        },

        computed: {
            labelWidthComputed() {
                const form = this.getForm()
                if (form && form.labelWidth) {
                    return form.labelWidth
                }
                return this.labelWidth
            }
        }
    }
</script>

<style scoped>

</style>
