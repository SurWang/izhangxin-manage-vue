<template>
    <div class="card-upload-wrapper">
        <div class="card-upload-body">
            <el-upload
                v-loading="uploadLoading"
                v-if="edit"
                class="card-upload"
                v-bind:action="uploadAction"
                v-bind:header="header"
                v-bind:show-file-list="false"
                v-bind:before-upload="handleBeforeUpload"
                v-bind:before-remove="handleBeforeRemove"
                v-bind:on-progress="handleProgress"
                v-bind:on-success="handleSuccess"
                v-bind:on-error="handleError"
                v-bind:list-type="1"
                list-type="picture-card">
                <template v-if="!uploadLoading">
                    <img v-if="imgUrl" v-bind:src="imgUrl" v-bind:alt="imgUrl" class="card-upload-img" />
                    <i v-else class="el-icon-plus"></i>
                </template>
            </el-upload>
            <div v-else class="card-view">
                <img
                    v-if="imgUrl"
                    v-viewer
                    class="card-view-img"
                    v-bind:src="imgUrl"
                    v-bind:alt="imgUrl"
                />
                <p v-else class="card-view-tip">暂无图片</p>
            </div>
        </div>
        <div class="card-upload-footer">
            <span class="card-upload-title">{{ title }}</span>
            <el-button
                v-if="edit && imgUrl && deleteAction"
                class="btn-delete"
                type="text"
                size="small"
                icon="el-icon-delete"
                v-on:click="handleDelete">
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UploadImg",
        props: {
            uploadAction: {
                type: String,
                required: true
            },
            deleteAction: {
                type: String,
                default: ''
            },
            header: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            title: {
                type: String,
                default: ''
            },
            imgUrl: {
                type: String,
                default: ''
            },
            edit: {
                type: Boolean,
                default: false
            },
            beforeUpload: {
                type: Function,
                default: function() {
                    return true
                }
            },
            beforeRemove: {
                type: Function,
                default: function() {
                    return true
                }
            },
            onSuccess: {
                type: Function,
                default: function() {
                    return ''
                }
            },
            onError: {
                type: Function,
                default: function() {
                    return ''
                }
            },
            onDeleteImg: {
                type: Function,
                default: function() {
                    return ''
                }
            }
        },
        data() {
            return {
                uploadLoading: false // 上传图片loading
            }
        },
        methods: {
            handleBeforeUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isPNG = file.type === 'image/png'
                const isLt2M = file.size / 1024 / 1024 < 10
                if (!isJPG && !isPNG) {
                    this.$Message.error('上传图片只能是 JPG或PNG 格式!')
                    return false
                }
                if (!isLt2M) {
                    this.$Message.error('上传图片大小不能超过 10MB!')
                    return false
                }
                if (!this.beforeUpload(file)) {
                    return false
                }
                this.uploadLoading = true
                return true
            },

            handleBeforeRemove(file, fileList) {
                return this.beforeRemove(file, fileList)
            },

            handleProgress(event, file, fileList) {
                console.log(event)
            },

            handleSuccess(response, file, fileList) {
                this.uploadLoading = false
                this.onSuccess(response, file, fileList)
            },

            handleError(err, file, fileList) {
                this.uploadLoading = false
                this.onError(err, file, fileList)
            },

            handleDelete() {
                const self = this
                self.$Modal.confirm({
                    title: '确定',
                    content: '确定删除?',
                    onOk: () => {
                        // self.$ajax.delete(this.deleteAction).then(() => {
                        //     self.$Message.success('删除成功')
                        //     self.onDeleteImg()
                        // })
                        self.onDeleteImg()
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .card-upload-wrapper {
        position: relative;
    }

    .card-upload >>> .el-upload {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        overflow: hidden;
    }

    .card-upload-body {
        width: 194px;
        height: 148px;
    }

    .card-upload-footer {
        text-align: center;
    }

    .card-upload-footer .btn-delete {
        margin-left: 5px;
        font-size: 16px;
        color: #F56C6C;
        vertical-align: middle;
    }

    .card-upload-img {
        height: 100%;
    }

    .card-view {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        line-height: 1;
        overflow: hidden;
    }

    .card-view-img {
        width: 100%;
        vertical-align: top;
        cursor: pointer;
    }

    .card-view-tip {
        font-size: 12px;
        color: #6f6f6f;
    }

    .card-upload-title {
        display: inline-block;
        font-size: 16px;
        line-height: 2;
        vertical-align: middle;
    }
</style>
