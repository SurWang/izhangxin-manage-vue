import { hasPermission } from '@/store/modules/permission.js'

export default {
    inserted (el, binding, vnode) {
        const { value } = binding
        if (!value) {
            throw new Error(`need roles! Like v-permission="123"`)
        }
        if (!hasPermission(value)) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}
