<template>
    <transition :name="transitionName">
        <div v-show="visible" :style="customStyle" class="back-to-ceiling" @click="backToTop">
            <svg width="16" height="16" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg"
                 class="Icon Icon--backToTopArrow" aria-hidden="true" style="height:16px;width:16px">
                <path
                    d="M12.036 15.59a1 1 0 0 1-.997.995H5.032a.996.996 0 0 1-.997-.996V8.584H1.03c-1.1 0-1.36-.633-.578-1.416L7.33.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.004z"/>
            </svg>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'BackToTop',
        props: {
            selector: {
                type: String,
                default: ''
            },
            visibilityHeight: {
                type: Number,
                default: 400
            },
            backPosition: {
                type: Number,
                default: 0
            },
            customStyle: {
                type: Object,
                default: function () {
                    return {
                        right: '50px',
                        bottom: '50px',
                        width: '40px',
                        height: '40px',
                        'border-radius': '4px',
                        'line-height': '45px',
                        background: '#e7eaf1'
                    }
                }
            },
            transitionName: {
                type: String,
                default: 'fade'
            }
        },
        data () {
            return {
                visible: false,
                interval: null,
                isMoving: false,
                scroll: null
            }
        },
        watch: {
            selector () {
                this.initScroll()
            }
        },
        mounted () {
            this.initScroll()
        },
        beforeDestroy () {
            if (this.scroll) {
                this.scroll.removeEventListener('scroll', this.handleScroll)
            }
            if (this.interval) {
                clearInterval(this.interval)
            }
        },
        methods: {
            initScroll () {
                if (this.selector) {
                    try {
                        this.scroll = document.querySelector(this.selector)
                    } catch (e) {
                        console.error('dom对象不存在')
                    }
                } else {
                    this.scroll = window
                }
                if (!this.scroll) {
                    return
                }
                this.scroll.addEventListener('scroll', this.handleScroll)
            },
            handleScroll () {
                const scrollTop = this.scroll.pageYOffset || this.scroll.scrollTop
                this.visible = scrollTop > this.visibilityHeight
            },
            backToTop () {
                if (this.isMoving) return
                const start = this.scroll.pageYOffset || this.scroll.scrollTop
                let i = 0
                this.isMoving = true
                this.interval = setInterval(() => {
                    const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
                    if (next <= this.backPosition) {
                        // window.scrollTo(0, this.backPosition)
                        this.setScrollTop(this.backPosition)
                        clearInterval(this.interval)
                        this.isMoving = false
                    } else {
                        // window.scrollTo(0, next)
                        this.setScrollTop(next)
                    }
                    i++
                }, 16.7)
            },
            easeInOutQuad (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b
                return -c / 2 * (--t * (t - 2) - 1) + b
            },
            setScrollTop (top) {
                if (this.scroll.scrollTop) {
                    this.scroll.scrollTop = top
                } else {
                    this.scroll.scrollTo(0, top)
                }
            }
        }
    }
</script>

<style scoped>
    .back-to-ceiling {
        position: fixed;
        display: inline-block;
        text-align: center;
        cursor: pointer;
    }

    .back-to-ceiling:hover {
        background: #d5dbe7;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0
    }

    .back-to-ceiling .Icon {
        fill: #9aaabf;
        background: none;
    }
</style>
