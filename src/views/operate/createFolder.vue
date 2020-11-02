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

                    <el-form-item label="文件夹名称" style="width: 300px" prop="folderName">
                        <el-input v-model="currentData.folderName" placeholder="文件夹名称" />
                    </el-form-item>

                </el-form>
                <el-button
                    class="operate-button"
                    type="primary"
                    size="small"
                    icon="ivu-icon ivu-icon-md-person-add"
                    style="margin-left: 100px"
                    @click="handleAdd">
                    创建文件夹
                </el-button>

            </div>

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

                rules: {
                    gameId : [
                        { required: true, message: '请输入游戏', trigger: 'change' }
                    ],
                    folderName:[
                        { required: true, message: '请输入文件夹名称', trigger: 'blur' }
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

            async handleAdd () {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.add()
                    } else {
                        return false;
                    }
                });
            },
            add () {
                const self = this
                let form = new FormData()
                form.append('gameId',self.currentData.gameId)
                form.append('type',self.currentData.type)
                form.append('folderName',self.currentData.folderName)
                create.addFolder(form).then(result => {
                    self.dialogVisible = false

                    if(result.data!=null&&result.data==0){
                        self.$message({
                            type: 'success',
                            message: '新增成功'
                        })
                        self.currentData = deepClone(defaultData)
                    }else if(result.data==-1){
                        self.$message({
                            type: 'error',
                            message: '该游戏已存在该类型文件夹!'
                        })
                    }else{
                        self.$message({
                            type: 'error',
                            message: '创建文件夹失败!'
                        })
                    }


                }).catch(error => {
                })
            },
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
