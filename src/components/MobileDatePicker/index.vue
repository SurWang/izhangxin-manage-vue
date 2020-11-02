<template>
    <div>
        <el-input
            size="small"
            readonly
            prefix-icon="el-icon-date"
            v-model="date"
            @focus="handleFocus">
        </el-input>
        <mt-datetime-picker
            ref="datetimePicker"
            type="date"
            :start-date="startDate"
            :end-date="endDate"
            @confirm="handleConfirm">
        </mt-datetime-picker>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "MobileDatePicker",
        props: {
            value: null,
            startDate: {
                type: Date,
                default: function () {
                    return new Date(1970, 0, 1)
                }
            },
            endDate: {
                type: Date,
                default: function () {
                    return new Date()
                }
            },
            format: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                date: null
            }
        },
        methods: {
            handleFocus: function () {
                this.$refs.datetimePicker.open()
            },
            handleConfirm: function (val) {
                this.date = moment(val).format('YYYY 年 MM 月 DD 日')
                if (this.format) {
                    this.$emit('input', moment(val).format(this.format))
                } else {
                    this.$emit('input', val)
                }
            }
        }
    }
</script>

<style scoped>

</style>
