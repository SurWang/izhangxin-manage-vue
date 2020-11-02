<template>
    <div class="app-container manage-container">

        <div class="manage-main">
            <div class="manage-main-body">
                <el-form ref="ruleForm" :model="currentData" label-width="100px"
                         label-position="left" :rules="rules" style="margin-left: 100px">
                    <el-form-item label="类型" >
                        <el-radio-group v-model="currentData.type">
                            <el-radio label="files">文件</el-radio>
                            <el-radio label="image">图片</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="游戏" prop="gameId">
                        <el-select
                            v-model="currentData.gameId"
                            placeholder="请选择游戏"
                            popper-class="role-select-dropdown"
                            style="width: 202px"
                            >
                            <el-option
                                class="role-select-dropdown__item"
                                v-for="item in games"
                                :key="item.gameId"
                                :label="item.gameName"
                                :value="item.gameId">
                                {{ item.gameName }}
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>

                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="this.$authInfo"
                    action=""
                    :file-list="fileList"
                    :auto-upload="false"
                    :multiple="true"
                    :before-upload="onBeforeUpload"
                    :http-request="handleUpload"
                    :on-remove="handleRemove"
                    :on-change="fileChange"
                    :limit="2">
                    <el-button style="margin-left: 100px;" slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                </el-upload>
            </div>
            <span style="font-size: 20px">
                fileUrl:{{fileUrl}}
            </span>


        </div>
    </div>
</template>

<script>
    import FilterContainer from '@/components/FilterContainer'
    import OperateContainer from '@/components/OperateContainer'
    import Pagination from '@/components/Pagination'
    import UploadImg from '@/components/UploadImg'


    import { deepClone } from '@/utils'
    import game from '@/api/hallgame/game'
    import create from '@/api/operate/create'
    import waves from '@/directive/waves'
    import {ResultCode} from '@/api/ResultCode'
    import moment from "moment";


    const DialogType = {
        NEW: 'new',
        EDIT: 'edit'
    }
    const defaultData = {
        type:"files"
    }

    export default {
        directives: { waves },
        components: {
            Pagination,
            FilterContainer,
            OperateContainer,
            UploadImg
        },
        data () {
            return {
                listLoading: false,
                isUpdate: false,
                isShowFilterPanel: false,
                isShowOperatePanel: false,
                disabled:false,

                currentData: Object.assign({}, defaultData),
                games:[],

                fileData: '',  // 文件上传数据（多文件合一）
                fileList:[],
                files:[],
                fileUrl:"",
                rules: {
                    gameId : [
                        { required: true, message: '请输入游戏', trigger: 'change' }
                    ]
                }
            }
        },
        computed: {

        },
        watch: {

        },
        created () {
            this.getGames()
        },

        methods: {

            async getGames () {
                const res = await game.getGames("", 1)
                this.games = res.data.games
            },

            submitUpload() {
                const self = this
                debugger
                self.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let form= new FormData()
                        form.append('gameId', self.currentData.gameId);
                        form.append('fileType', self.currentData.type);

                        create.isExist(form).then(result => {
                            if(result.data!=null && result.data==0){
                                this.$refs.upload.submit();  // 提交调用uploadFile函数

                                let form1 = new FormData();
                                form1.append('gameId', self.currentData.gameId);
                                form1.append('fileType', self.currentData.type);

                                self.files.forEach(file => {
                                    form1.append("file", file, file.name);
                                });
                                create.uploadApkFile(form1).then(result => {
                                    self.files = []
                                    self.fileUrl = result.data[0].fileUrl
                                    self.$message({
                                        type: 'success',
                                        message: '上传成功'
                                    })
                                },error=>{
                                    self.files = []
                                })

                            }else{
                                this.$Message.error("该上传类型的游戏文件夹不存在")
                            }
                        }, error => {
                        })
                    } else {
                        return false;
                    }
                })

            },

            onBeforeUpload () {
            },

            handleUpload (row) {
                this.files.push(row.file);
            },

            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            }
        }
    }
</script>
<style>
    .role-select-dropdown__item {
        display: flex;
        padding-left: 30px;
    }

    .role-select-dropdown.is-multiple .role-select-dropdown__item.selected::after {
        left: 10px;
    }

    .role-select-dropdown__item .group-label {
        margin-left: auto;
        font-size: 12px;
        color: #c1c1c1;
    }
    .img-info {
        width: 60px;
        height: 60px;
        display: block;
    }
</style>
