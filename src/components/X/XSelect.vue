<template>
    <x-item v-bind="Object.assign({}, {
        'prop': _xGetName()
    }, $attrs)">
        <el-select
            v-bind="Object.assign({}, {
                    'filterable': true,
//                    'multiple': true,
                    'clearable': true,
                    'placeholder': xPlaceholder,
                    'value': value
                } , $attrs)"

            v-on="Object.assign({}, {
                        input (v) {
                            _xSetValue(v)
                        }
                    }, $listeners, {
                        change: onChange
                    }
                )"
            >
            <el-option
                style="font-weight: bold"
                v-if="this.nullItem"
                :key="nullVal"
                :label="nullLabel"
                :value="nullVal"
            ></el-option>

            <template
                v-if="config && Object.keys(config).length > 0"
            >
                <el-option
                    v-for="(value, key) in config"
                    :key="key"
                    :label="key"
                    :value="value">
                </el-option>
            </template>
            <slot/>
        </el-select>
    </x-item>
</template>

<script>
    import XItem from './XItem'
    import XItemMethod from './XItemMethod'
    export default {
        name: 'XSelect',
        components: { XItem },
        mixins: [XItemMethod],
        props: {
            nullItem: Boolean,
            nullLabel: {
                type: String,
                default: '未填写'
            },
            nullVal: {
                default: '@NULL@'
            },
            // 标准 key-value (Object)
            config: {
                type: Object
            }

        },
        data () {
            return {
                value: [],
            }
        },
        computed: {
            xPlaceholder() {
                return this.$attrs.label ? '请选择' + this.$attrs.label : '请选择'
            }
        },
        methods: {
            onChange(val) {
                // 开启多选则选择了nullValue只保留nullItem
                if (this.nullItem && val && val.length > 0) {
                    if (this.$attrs.hasOwnProperty('multiple') && this.$attrs.multiple !== false) {
                        if (val[val.length - 1] === this.nullVal) {
                            val = [this.nullVal]
                        } else {
                            const index = val.indexOf(this.nullVal)
                            index > -1 && val.splice(index, 1)
                        }
                        this._xSetValue(val)
                        this.$emit('change', val)
                        return
                    }
                }
                this.$emit('change', val)

            }
        }
    }
</script>

<style scoped>

</style>
