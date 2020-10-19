<template>
  <div class="login">
    <div class="box">
   <h3 class="center">登录</h3>
      <div class="line">
        <el-input v-model="form.username" clearable placeholder="请输入用户名"></el-input>
      </div>
      <div class="line">
        <el-input v-model="form.password" class="line" show-password clearable placeholder="请输入密码"></el-input>
      </div>
    <div class="line center">
        <el-button type="primary" @click="login">登录</el-button>
    </div>
    </div>
  </div>
</template>
<script>
import { successAlert, waringAlert } from '../../utils/alert';
import { reqPost } from '../../utils/request';
import { mapGetters, mapActions } from "vuex";
// import {reqGet,reqPost} from '../utils/request'
// import {mapGetters,mapActions} from "vuex"
export default {
  props: [],
  components: {},
  data() {
    return {
      form:{
        username:'',
        password:''
      }
    };
  },
  computed: {
    // ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      changeuserInfo:'changeuserInfo'
    }),
    login(){
      console.log('111')
      reqPost('/api/userlogin',this.form).then(res=>{
        if(res.data.code==200){
          successAlert('登陆成功')
          this.changeuserInfo(res.data.list)
           this.$router.push("/")
        }
        else{
          waringAlert(res.data.msg)
        }
      })
    }
  },
  mounted() {},
};
</script>
<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #553443, #303d60);
  position: relative;
}
.box {
  width: 400px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 20px;
}
.center {
  text-align: center;
}
.line {
  margin-top: 20px;
}
</style>