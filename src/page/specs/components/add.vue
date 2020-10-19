<template>
  <div>
    <el-dialog @closed="close" :title="info.isAdd ? '添加角色':'修改角色'" :visible.sync="info.isshow">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>

        <el-form-item label="规格属性" v-for="(item, index) in attrArr" :key="index">
          <div class="con">
            <div class="input-wrap">
              <el-input v-model="item.value"></el-input>
            </div>
            <el-button type="primary" v-if="index == 0" @click="addAttr">新增规格属性</el-button>
            <el-button type="danger" v-else @click="dele(index)">删除</el-button>
          </div>
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
      attrArr: [{ value: "" }, { value: "" }],

      form: {
        specsname: "",
        attrs: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqSpecsList: "specs/reqSpecsList",

      reqTotal: "specs/reqTotal",
    }),

    add() {
      // console.log(this.attrArr);
      // console.log(this.form.attrs);
      if (!this.checkdData()) {
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      console.log(this.form.attrs);
      reqPost("/api/specsadd", this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqTotal();
          this.reqSpecsList();
        } else {
          waringAlert(res.data.msg);
        }
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.attrArr = [{ value: "" }, { value: "" }];
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
    },
    

    onSubmit() {
      console.log("submit!");
    },
    look(id) {
      reqGet("/api/specsinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list[0];
          this.attrArr = JSON.parse(this.form.attrs).map((item) => ({
            value: item,
          }));
        } else {
          waringAlert(res.data.msg);
        }
      });
    },
    checkdData() {
      if (this.form.specsname == "") {
        waringAlert("规格名不能为空");
        return false;
      }
      if (this.attrArr.some((item) => item.value == "")) {
        waringAlert("所有属性值必须填");
        return false
      }
      return true
    },
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    addAttr() {
      this.attrArr.push({ value: "" });
    },
    //删除规格属性
    dele(index) {
      this.attrArr.splice(index, 1);
    },
    updata() {
      if (!this.checkdData()) {
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqPost("/api/specsedit", this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqSpecsList();
        } else {
          successAlert(res.data.msg);
        }
      });
    },
  },

  mounted() {
    this.reqSpecsList();
  },
};
</script>
<style scoped>
.con {
  display: flex;
}
.input-wrap {
  flex: 1;
}
</style>