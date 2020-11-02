<template>
    <div class="success-panel" >
        <i class="el-icon-success"></i>
        <span class="txt">提交成功</span>
    </div>
</template>

<script>
    export default {
        name: 'SuccessPage'
    }
</script>

<style scoped>

    .success-panel {
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-top: 100px;
        background-color: #fff;
        font-size: 16px;
        text-align: center;
    }

    .success-panel .el-icon-success {
        margin-right: 10px;
        font-size: 24px;
        color: #67c23a;
        vertical-align: middle;
    }

    .success-panel .txt {
        display: inline-block;
        vertical-align: middle;
    }

</style>
