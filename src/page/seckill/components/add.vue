<template>
  <div>
    <el-dialog
      @opened="open"
      @closed="close"
      :title="info.isAdd ? '添加商品':'修改商品'"
      :visible.sync="info.isshow"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTime"
            ></el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="一级菜单">
          <el-select v-model="form.first_cateid" @change="changeFirst">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级菜单">
          <el-select v-model="form.second_cateid" @change="changegoods" placeholder="请选择">
            <el-option
              v-for="item in secondList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="form.goodsid" placeholder="请选择">
            <el-option
              v-for="item in goodsAList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
import E from "wangeditor";
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import { successAlert, waringAlert } from "../../../utils/alert";
import { reqGet, reqPost, reqFile } from "../../../utils/request";

export default {
  props: ["info"],
  components: {},
  data() {
    return {
      value1: "",

      secondList: [],
      goodsAList: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      specsList: "specs/list",
      cateList: "cate/list",
      goodsList: "goods/list",
    }),
  },
  methods: {
    ...mapActions({
      // reqMenuList: "menu/reqList",
      reqCateList: "cate/reqList",
      reqSpecsList: "specs/reqSpecsList",
      reqGoodsList: "goods/reqGoodsList",
      reqSeckillList: "seckill/reqList",
    }),
    open() {
      this.editor = new E("#box");
      this.editor.create();
      this.editor.txt.html(this.form.description);
    },

    add() {
      reqPost("/api/seckadd", this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqSeckillList();
        } else {
          waringAlert(res.data.msg);
        }
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.secondList = [];
      this.goodAttrList = [];
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
    },
    onSubmit() {
      console.log("submit!");
    },
    getFile(e) {
      let file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        waringAlert("文件不能超过2M");
      }
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    changeTime() {
      this.form.begintime = Number(this.value1[0].getTime());
      this.form.endtime = Number(this.value1[0].getTime());
    },

    look(id) {
      reqGet("/api/seckinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.value1 = [
            new Date(parseInt(this.form.begintime)),
            new Date(parseInt(this.form.endtime))
          ];
          this.form.id = id;
          this.getSecondList();
          this.getGoodsList();
        } else {
          waringAlert(res.data.msg);
        }
      });
    },

    getSecondList() {
      reqGet("/api/catelist", { pid: this.form.first_cateid }).then((res) => {
        this.secondList = res.data.list;
      });
    },
    changeFirst() {
      this.form.second_cateid = "";
      this.getSecondList();
    },

    changegoods() {
      this.getGoodsList();
    },

    getGoodsList() {
      reqGet("/api/goodslist", {
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        this.goodsAList = res.data.list;
      });
    },

    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },

    // changeSpecs() {
    //   this.form.specsattr = [];
    //   this.getArrtsArr();
    // },
    // getArrtsArr() {
    //   let obj = this.specsList.find((item) => item.id == this.form.specsid);
    //   this.goodAttrList = obj.attrs;
    // },

    updata() {
      reqPost("/api/seckedit", this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqSeckillList();
        } else {
          successAlert(res.data.msg);
        }
      });
    },
  },

  mounted() {
    // if (this.menulist.length == 0) {
    //   // this.reqMenuList();
    // }
    this.reqCateList();
    this.reqSpecsList(true);
  },
};
</script>
<style scoped>
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}
.my-upload h3 {
  text-align: center;
  line-height: 150px;
  font-size: 30px;
  font-weight: 400;
}
.my-upload .my-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  opacity: 0;
}
.my-upload .img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>