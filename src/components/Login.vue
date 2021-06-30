<template>
    <div class="login-cantainer">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/avatar.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="LoginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules='loginFormrules'>
                <!-- 用户名 -->
                <el-form-item prop='username'>
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                 <el-form-item prop='password'>
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type='password'></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                  <el-form-item class="buts">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  created() {},
  props: {},
  data() {
    return {
        // 这是登录表单的数据绑定对象对象
        loginForm:{
            username:'admin',
            password:'123456'
        },
        loginFormrules:{
            //这是用户名验证规则
            username:[
                { required: true, message: '请输入用户名称', trigger: 'blur'},
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            //这是密码验证规则
            password:[
                { required: true, message: '请输入密码', trigger: 'blur'},
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
        }
    };
  },
  methods: {
      //点击重置按钮，重置登录表单
      resetLoginForm(){
        // console.log(this);
        this.$refs.LoginFormRef.resetFields()
      },
     //登陆表单预验证
    login(){
        this.$refs.LoginFormRef.validate(async valid=>{
           if(!valid) return;
           const {data: res}= await this.$http.post('login',this.loginForm)
           if(res.meta.status !== 200) return this.$message.error('登陆失败！')
           this.$message.success('登陆成功')

           //1.将登陆成功后的token 保存到客户端的 sessionStorage 中
           // 1.1 项目中除了登陆之外的其他APOI接口 必须登录后才能访问
           // 1.2 token 只应在当前网站打开期间生效 所以将token 保存在sessionStorage 中
           window.sessionStorage.setItem('token',res.data.token);
           // 2.通过编程式导航跳转到后太页面，路由地址是/home
          this.$router.push('/home')
        })
    }
  },
  components: {},
  computed: {},
};
</script>

<style scoped lang="less">
.login-cantainer {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.buts{
    display: flex;
    justify-content: flex-end;
}
</style>
