<template>
    <div>
        <el-dialog title="重新登录" :show-close="false" :visible.sync="dialogVisible" class="login-dialog" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" @keyup.enter.native="login()"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password" @keyup.enter.native="login()"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="login()">登 录</el-button>
            </span>
        </el-dialog>
        <div v-if="$route.name === 'login'">
            <div class="pageWrapper">
                <router-view></router-view>
            </div>
        </div>
        <div v-else>
            <el-container class="bg-yellow-100" style="min-width: 1200px;height: 100vh;">
                <el-header class="bg-white"><head-top ></head-top></el-header>
                <el-container class="m-t-10">
                    <el-main>
                        <div class="pageWrapper">
                            <router-view></router-view>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script>
    import headTop from './components/headTop/headTop.vue'
    import slider from './components/slider/slider.vue'
    import efooter from './components/footer/footer.vue'
    import bus from './components/common/bus/bus'

    export default{
        components: {
            headTop,
            slider,
            efooter
        },
        data(){
            return  {
                dialogVisible:false,
                form: {
                    userName: (localStorage.getItem('isRememberMe') == 'on')?localStorage.getItem('userName'):'',
                    password: (localStorage.getItem('isRememberMe') == 'on')?localStorage.getItem('password'):''
                },
                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            bus.$on('loginDialog', (show) => {
                this.dialogVisible = show;
            });
        },
        methods:{
            login(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //已经md5加密过
                        let pwd = this.form.password
                        //未加密
                        if(localStorage.getItem('password') != this.form.password){
                            pwd = this.md5(this.form.password)
                        }
                        let data = {
                            userName: this.form.userName,
                            password: pwd,
                            isRememberMe: (localStorage.getItem('isRememberMe')?localStorage.getItem('isRememberMe'):'off')
                        };
                        data.sign = this.signData(data)
                        this.axios.post('/api/login/login',data).then((res) => {

                            bus.$emit('userName', this.form.userName);
                            localStorage.setItem('userName',this.form.userName)
                            localStorage.setItem('userId',res.data.data.userId)
                            localStorage.setItem('roleId',res.data.data.roleId)
                            localStorage.setItem('departmentId',res.data.data.departmentId)
                            this.dialogVisible = false;
                            this.$router.go(0)
                        },(res) => {
                            this.$message.error(res.data.resMsg);
                        })
                    } else {
                        return false;
                    }
                });
            }
        }

    }
</script>.