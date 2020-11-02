<template>
    <x-item v-bind="Object.assign({}, {
        'prop': _xGetName()
    }, $attrs)">
        <el-date-picker
            v-bind="Object.assign({
                'value': value
            }, calcAttr, $attrs)"
            v-on="Object.assign({}, {
                    input (v) {
                        _xSetValue(v)
                    }
                }, $listeners)"
            >
        </el-date-picker>
    </x-item>
</template>

<script>
    import XItem from './XItem'
    import XItemMethod from './XItemMethod'
    export default {
        name: 'XDatePicker',
        components: { XItem },
        mixins: [XItemMethod],

        created() {
            let typeOption = {
                'year': {
                    'format': 'yyyy 年',
                    'value-format': 'yyyy',
                    'placeholder': '选择年份'
                },
                'month': {
                    'format': 'yyyy 年 MM 月',
                    'value-format': 'yyyy-MM',
                    'placeholder': '选择年月'
                },
                'daterange': {
                    'type': 'daterange',
                    'range-separator':  '至',
                    'start-placeholder': '开始日期',
                    'end-placeholder': '结束日期',
                 },
                'datetime': {
                    'format': 'yyyy-MM-dd HH:mm:ss',
                    'value-format': 'yyyy-MM-dd HH:mm:ss',
                    'placeholder': '选择日期时间',

                }
            }
            let DEFAULT = {
                'type': 'date',
                'format': 'yyyy 年 MM 月 dd 日',
                'value-format': 'yyyy-MM-dd',
                'placeholder': '选择日期',
                'unlink-panels': true
            }
            this.calcAttr =  Object.assign(DEFAULT, typeOption[this.$attrs.type])
        },

        data () {
            return {
                value: '',
                // 根据传参, 计算出一些常用属性
                calcAttr: {},
            }
        }
    }
</script>

<style scoped>

</style>
