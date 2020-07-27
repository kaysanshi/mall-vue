<template>
  <div class="login_container">
    <div class="login_box">
        <div class="icon">
            <img src="../assets/logo.png">
        </div>
        <!---登录表单 使用阿里的图标 使用前需要使用 iconfont 前缀
        数据绑定 需要使用 v-model属性，这里的form当做一个对象，这个对象直接可以提交
        v-rules是一个验证的规则 使用prop属性为其设置验证规则其中加的位置是在item项的
        status-icon 属性为输入框添加了表示校验结果的反馈图标
        ref 一般写在el-form中 以作为验证表单使用
        -->
        <el-form ref="formref" :model="LoginForm" status-icon :rules="rules"  label-width="80px" class="login_form">
            <el-form-item label="用户名"  prop="username">
                <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-user" ></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop="password">
                <el-input v-model="LoginForm.password" prefix-icon="iconfont icon-3702mima" type="password" prop="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="resetForm">重置</el-button>
                <el-button type="primary" @click="onSubmit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
     return {
         //自定义一个数据绑定的对象，然后将属性绑定这个对象中
        LoginForm: {
          username: '',
          password: ''
        },
        // 定义一个验证规则对象
        rules:{
            password: [{
                requierd:true,message:"请输入用户密码",trigger: 'blur' 
            },{
                min:3,max:20,message:"长度在3到15个字符",trigger:"blur"
            }],
            username:[{
                requierd:true,message:"请输入登录名称",trigger: 'blur' 
            },{
                min:3,max:20,message:"长度在3到15个字符",trigger:"blur"
            }]

        }
     }
  },
   methods: {
      onSubmit() {
        console.log('submit!');
        // 表单提交前进行预验证返回一个boolean值如果验证结果为true则进行发起请求
        this.$refs.formref.validate(async valid=>{
            
            if (!valid) return;
            console.log(valid)
            // 为true则进行发起请求 await 只能用于 async修饰的方法内部
            // 把返回的data 重命名为res
            const {data:res}=await this.$http.post("login",this.LoginForm);
            if (res.meta.status!="200"){
                return this.$message.error('登录失败！')
            }else {
                console.log("登录成功")
                this.$message.success("登录成功")
                // 1.将登录陈功后保存token到sessionStorage中 (sessionStorage是当前会话中，而不是localStorage)
                window.sessionStorage.setItem("token",res.data.token)   
                // 2.通过编程式的导航到跳转后台主页中 /home
                this.$router.push("/home")
            }
        })
      },
      // 重置登录按钮
      resetForm() {
          console.log('reset!')
          // 表单重置 时需要在form中添加ref属性对项
          this.$refs.formref.resetFields()

      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width:450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    
}
.icon{
    display:inline-block;
    margin-right:5px;
    border-radius:60px; /* 圆形边缘弧度 */
    width:120px; /* 宽度 */
    height:120px; /* 高度 */
    background-size: 120px 120px;
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    padding :2px;
    box-shadow: 0 0 10px #ddd;
    border: 1px solid #eeee;
    background-color: #eee;
    img{
        width:120px; /* 宽度 */
        height:120px; /* 高度 */
        border-radius:60px;
        background-color: #eee;
    }
}
.login_form{
    position: absolute;
    bottom: 0px;
    box-sizing: border-box;
    width: 95%;
}
</style>