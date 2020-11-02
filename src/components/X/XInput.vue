<template>
    <x-item v-bind="Object.assign({}, {
        'prop': _xGetName()
    }, $attrs)">
        <el-input
            v-bind="Object.assign({}, {
                    'clearable': true,
                    'placeholder': xPlaceholder,
                    'value': value
                } , $attrs)"
            v-on="Object.assign({}, {
                    input (v) {
                        _xSetValue(v)
                    }
                }, $listeners)"
            >
        </el-input>
    </x-item>
</template>

<script>
    import XItem from './XItem'
    import XItemMethod from './XItemMethod'
    export default {
        name: 'XInput',
        components: { XItem },
        mixins: [XItemMethod],


    }
</script>

<style scoped>

</style>
