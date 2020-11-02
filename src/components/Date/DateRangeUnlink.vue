<template>
   <div>
        <el-date-picker
            :value="value[0]"
            v-bind="$attrs"
            @input="emit($event, 0)"
            :picker-options="pickerBeginDateBefore"
            placeholder="开始日期">
        </el-date-picker>
        至
        <el-date-picker
            :value="value[1]"
            v-bind="$attrs"
            @input="emit($event, 1)"
            :picker-options="pickerBeginDateAfter"
            placeholder="结束日期">
        </el-date-picker>
   </div>
</template>

<script>
    export default {
        name: 'DateRangeUnlink',
        data () {
            return {
                result: [],
                pickerBeginDateBefore: {
                    disabledDate: (time) => {
                        let beginDateVal = this.value[1]
                        if (beginDateVal) {
                            if (!(beginDateVal instanceof Date)) {
                                beginDateVal = new Date(beginDateVal)
                            }
                            return time.getTime() > beginDateVal.getTime()
                        }
                    }
                },
                pickerBeginDateAfter: {
                    disabledDate: (time) => {
                        let beginDateVal = this.value[0];
                        if (beginDateVal) {
                            if (!(beginDateVal instanceof Date)) {
                                beginDateVal = new Date(beginDateVal)
                            }
                            return time.getTime() < beginDateVal.getTime()
                        }
                    }
                }
            }
        },
        props: {
            value: {
                default: function() {
                    return []
                }
            },
        },

        methods: {
            emit(val, type) {
                this.$set(this.result, type, val)
                if (!this.result[0] && this.value[0]) {
                    this.$set(this.result, 0, this.value[0])
                }
                if (!this.result[1] && this.value[1]) {
                    this.$set(this.result, 1, this.value[1])
                }
                this.$emit('input', this.result)
            }
        }
    }
</script>

<style scoped>

</style>
