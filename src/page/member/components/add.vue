<template>
  <div>
    <el-dialog title="会员编辑" :visible.sync="info.isshow">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>

        <el-button type="primary" @click="updata()">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import { successAlert, waringAlert } from '../../../utils/alert';
import { reqGet, reqPost } from '../../../utils/request';
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      formData: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
        reqList:'member/reqList'
    }),
    updata() {
        reqPost('/api/memberedit',this.form).then(res=>{
            if(res.data.code==200){
                successAlert(res.data.msg)
                this.reqList()
                this.cancel()
            }else{
                waringAlert(res.data.msg)
            }
        })
    },
    cancel() {
        this.info.isshow=false
    },
    look(uid) {
        reqGet('/api/memberinfo',{uid:uid}).then(res=>{
            this.form=res.data.list
            this.form.id=uid
        })
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>