<template>
    <section class="app-main">
        <el-button v-if="fullScreen" class="exit-full-screen" type="text" icon="el-icon-back" @click="handleExitFullScreen"></el-button>
        <transition name="fade-transform" mode="out-in">
            <router-view v-if="isRouterAlive" :key="key"/>
        </transition>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',

        data () {
            return {
                isRouterAlive: true
            }
        },

        computed: {
            key() {
                return this.$route.fullPath
            },
            fullScreen () {
                return this.$store.state.app.fullScreen
            }
        },
        methods: {
            handleExitFullScreen: function () {
                this.$store.commit('app/SET_FULL_SCREEN', false)
            },
            reload () {
                this.isRouterAlive = false
                this.$nextTick(() => (this.isRouterAlive = true))
            }
        }
    }
</script>

<style scoped>
    .app-main {
        /*50 = navbar  */
        min-height: calc(100vh - 50px);
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .fixed-header + .app-main {
        padding-top: 70px;
        height: 100vh;
        overflow: auto;
    }

    .full-screen.app-main {
        height: 100vh;
        overflow: auto;
    }

    .exit-full-screen {
        position: absolute;
        z-index: 5;
        top: 20px;
        left: 20px;
        padding: 0;
        font-size: 20px;
        color: #000;
    }
</style>
