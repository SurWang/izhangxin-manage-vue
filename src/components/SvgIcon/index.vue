<template>
  <svg :class="svgClass" aria-hidden="true" :style="iconSizeStyle" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
      type: {
        type: String
      },
      size: {
        type: String
      },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
      iconSizeStyle() {
        let pxSize = '', result = {}
        if (this.size) {
            if ((this.size + '').indexOf('px') == -1){
                pxSize =  this.size + 'px'
            }
            result['font-size'] = pxSize
        }
        if (this.type) {
            let color = {
                primary: '#409EFF',
                success: '#67C23A',
                warning: '#E6A23C',
                danger: '#F56C6C',
                info: '#909399'
            };

            result['color'] = color[this.type.toString().toLocaleLowerCase()]
        }
        return result;
      }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
