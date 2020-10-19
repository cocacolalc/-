<template>
  <div>
    <el-dialog @closed="close" :title="info.isAdd ? '添加角色':'修改角色'" :visible.sync="info.isshow">
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label='所属角色'>
          <el-select v-model="form.roleid" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.rolename"
      :value="item.id">
    </el-option>
  </el-select>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="updata()" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import { successAlert, waringAlert } from "../../../utils/alert";
import { reqGet, reqPost } from "../../../utils/request";

export default {
  props: ["info"],
  components: {},
  data() {
    return {
      isshow:true,
      form: {
        roleid:'',
        username: "",
        password: '',
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
     roleList:'role/list',
      manageList: "manage/list",
    }),
  },
  methods: {
    ...mapActions({
      reqRoleListAction:'role/reqList',
      
      reqManageList:'manage/reqManageList',
       reqTotal:'manage/reqTotal'
    }),

    add() {
      // this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqPost("/api/useradd",this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
           this.reqTotal()
          this.reqManageList();
        } else {
          waringAlert(res.data.msg);
        }
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.form = {
       roleid:'',
        username: "",
        password: '',
        status: 1,
      };
    
    },

    onSubmit() {
      console.log("submit!");
    },
    look(uid) {
      reqGet("/api/userinfo", { uid: uid }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.uid = uid;
          this.form.password=''
        } else {
          waringAlert(res.data.msg);
        }
      });
    },
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    updata() {
      reqPost("/api/useredit", this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqManageList();
           this.form.password=''
        } else {
          successAlert(res.data.msg);
        }
      });
    },
  },

  mounted() {
    if (this.roleList.length == 0) {
      this.reqRoleListAction();
    }
  },
};
</script>
<style scoped>
</style>