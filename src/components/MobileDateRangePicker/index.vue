<template>
    <div>
        <el-input
            size="small"
            readonly
            prefix-icon="el-icon-date"
            placeholder="开始日期"
            v-model="startDateVal"
            @focus="handleStartFocus">
        </el-input>
        至
        <el-input
            size="small"
            readonly
            prefix-icon="el-icon-date"
            placeholder="结束日期"
            v-model="endDateVal"
            @focus="handleEndFocus">
        </el-input>
        <mt-datetime-picker
            ref="startDatetimePicker"
            type="date"
            :start-date="startMinDate"
            :end-date="startMaxDate"
            @confirm="handleStartConfirm">
        </mt-datetime-picker>
        <mt-datetime-picker
            ref="endDatetimePicker"
            type="date"
            :start-date="endMinDate"
            :end-date="endMaxDate"
            @confirm="handleEndConfirm">
        </mt-datetime-picker>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "index",
        props: {
            value: {
                default: function () {
                    return []
                }
            }
        },
        data: function () {
            return {
                date: [null, null],
                startDateVal: null,
                endDateVal: null
            }
        },
        computed: {
            startMinDate: function () {
                return new Date(1970, 0, 1)
            },
            startMaxDate: function () {
                if (this.endDateVal) {
                    const year = moment(this.date[1]).get('year')
                    const month = moment(this.date[1]).get('month')
                    const day = moment(this.date[1]).get('date')
                    return new Date(year, month, day)
                } else {
                    const year = moment().get('year')
                    return new Date(year + 100, 12, 31)
                }
            },
            endMinDate: function () {
                if (this.startDateVal) {
                    const year = moment(this.date[0]).get('year')
                    const month = moment(this.date[0]).get('month')
                    const day = moment(this.date[0]).get('date')
                    return new Date(year, month, day)
                } else {
                    return new Date(1970, 0, 1)
                }
            },
            endMaxDate: function () {
                const year = moment().get('year')
                return new Date(year + 100, 12, 31)
            }
        },
        methods: {
            handleStartConfirm: function (val) {
                this.startDateVal = moment(val).format('YYYY 年 MM 月 DD 日')
                this.date[0] = moment(val).format('YYYY-MM-DD')
                this.$emit('input', this.date)
            },
            handleEndConfirm: function (val) {
                this.endDateVal = moment(val).format('YYYY 年 MM 月 DD 日')
                this.date[1] = moment(val).format('YYYY-MM-DD')
                this.$emit('input', this.date)
            },
            handleStartFocus: function () {
                this.$refs.startDatetimePicker.open()
            },
            handleEndFocus: function () {
                this.$refs.endDatetimePicker.open()
            }
        }
    }
</script>

<style scoped>

</style>
