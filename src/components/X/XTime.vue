<template>
    <x-item v-bind="Object.assign({}, {
        'prop': _xGetName()
    }, $attrs)">
        <el-time-picker
            ref="timer"
            v-bind="Object.assign({}, {
                    'clearable': true,
                    'placeholder': xPlaceholder,
                    'picker-options': {
                        selectableRange: '00:00:00 - 23:59:59'
                    },
                    'value-format': 'HH:mm:ss',
                    'value': value
                } , $attrs)"
            v-on="Object.assign({}, {
                    input (v) {
                        _xSetValue(v)
                    }
                }, $listeners)"
            >
        </el-time-picker>
    </x-item>
</template>

<script>
    import XItem from './XItem'
    import XItemMethod from './XItemMethod'
    export default {
        name: 'XTime',
        components: { XItem },
        mixins: [XItemMethod]
    }
</script>

<style scoped>

</style>
