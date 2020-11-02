export default {
    props: {
        name: {
            type: String
        },

    },

    computed: {
        xPlaceholder() {
            return this.$attrs.label ? '请输入' + this.$attrs.label : '请输入内容'
        }
    },

    inject: {
        pModalData: { default: 'pModalData' }
    },


    data () {
        return {
            isXItem: true,
            value: '',
            initValue: this._xGetValue()
        }
    },

    methods: {
        _xGetData () {
            const name = this._xGetName();
            const value = this._xGetValue();
            return {
                [name] : value
            }
        },
        _xGetName () {
            let name = this.name
            if (!name) {
                const modelExpress = this.$vnode.data.model && this.$vnode.data.model.expression
                if (modelExpress) {
                    const modelArray = modelExpress.split(".")
                    return modelArray.length == 1 ? modelArray[0] : modelArray[1]
                }

                console.error('this component not set name or v-model',this)
            }
            return name
        },
        _xGetValue () {
            // 如果是外部传入v-model
            if (Object.keys(this.$attrs).includes('value')) {
                return this.$attrs.value
            }
            return this.value
        },
        _xSetValue (v) {
            // 如果是外部传入v-model
            if (Object.keys(this.$attrs).includes('value')) {
                this.$emit('input', v)
                return
            }
            this.value = v
            if (this.pModalData && this.pModalData.modalData) {
                this.$set(this.pModalData.modalData, this.name, this.value)
            }

        },
        _xResetValue() {
            this._xSetValue(this.initValue)
        }
    },
}
