<template>
  <div>
    <el-dialog @closed="close" :title="info.isAdd ? '添加角色':'修改角色'" :visible.sync="info.isshow">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>

        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :data="menulist"
            show-checkbox
            node-key="id"
            :props="{children: 'children',label: 'title',}"
          ></el-tree>
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
      form: {
        rolename: "",
        menus: "[]",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      menulist: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      reqMenuList: "menu/reqList",
      reqList: "role/reqList",
    }),

    add() {
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqPost("/api/roleadd", this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqList();
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
        rolename: "",
        menus: "[]",
        status: 1,
      };
      this.$refs.tree.setCheckedKeys([]);
    },

    onSubmit() {
      console.log("submit!");
    },
    look(id) {
      
      reqGet("/api/roleinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
           this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus));
          this.form.id = id;
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
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqPost("/api/roleedit", this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqList();
        } else {
          successAlert(res.data.msg);
        }
      });
    },
  },
  
  mounted() {
    if (this.menulist.length == 0) {
      this.reqMenuList();
    }
  },
};
</script>
<style scoped>
</style>