<template>
  <div>
    <el-dialog @opened='open' @closed="close" :title="info.isAdd ? '添加商品':'修改商品'" :visible.sync="info.isshow">
      <el-form ref="form" :model="form" label-width="80px">
       
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
          <el-select v-model="form.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secondList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>

        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>

        <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>

        <el-form-item label="图片" v-if="form.pid!=0">
          <div class="my-upload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt />
            <input v-if="info.isshow" class="my-input" type="file" @change="getFile" />
          </div>
        </el-form-item>

        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="changeSpecs" placeholder="请选择">
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品属性">
          <el-select v-model="form.specsattr" placeholder="请选择" multiple>
            <el-option v-for="item in goodAttrList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio :label="1" v-model="form.isnew">是</el-radio>
          <el-radio :label="2" v-model="form.isnew">否</el-radio>
        </el-form-item>

        <el-form-item label="是否热卖">
          <el-radio :label="1" v-model="form.ishot">是</el-radio>
          <el-radio :label="2" v-model="form.ishot">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>

      <el-form-item label='商品描述'>
        <div id="box" v-if="info.isshow"></div>
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
import E from 'wangeditor'
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import { successAlert, waringAlert } from "../../../utils/alert";
import { reqGet, reqPost,reqFile} from "../../../utils/request";

export default {
  props: ["info"],
  components: {},
  data() {
    return {
      imgUrl: "",
      secondList: [],
      goodAttrList: [],
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的 '[]',所以 记得在请求前 转换格式
        isnew: 1,
        ishot: 1,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      specsList: "specs/list",
      cateList: "cate/list",
     
    }),
  },
  methods: {
    ...mapActions({
      // reqMenuList: "menu/reqList",
      reqCateList: "cate/reqList",
      reqSpecsList: "specs/reqSpecsList",
      reqGoodsList: "goods/reqGoodsList",
       reqPage:'goods/reqTotal'
    }),
    open(){

      this.editor=new E('#box')
      this.editor.create()
    this.editor.txt.html(this.form.description)
    },

    add() {
        
      this.form.description=this.editor.txt.html()
      let data = {
        
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),

      };
      // console.log(22222,data.specsattr);
      reqFile("/api/goodsadd",data).then((res) => {

        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqGoodsList();
          this.reqPage()
        } else {
          waringAlert(res.data.msg);
        }
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
       this.imgUrl= "";
      this.secondList= [];
      this.goodAttrList= [];
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的 '[]',所以 记得在请求前 转换格式
        isnew: 1,
        ishot: 1,
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

    look(id) {
      reqGet("/api/goodsinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
         
          this.form.id = id;
          this.getSecondList()
          this.imgUrl = this.$imgPre + this.form.img;
        this.form.specsattr = JSON.parse(this.form.specsattr);
          this.getArrtsArr()
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
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },

    changeSpecs() {
      this.form.specsattr = [];
      this.getArrtsArr();
    },
    getArrtsArr() {
      let obj = this.specsList.find((item) => item.id == this.form.specsid);
      this.goodAttrList = obj.attrs;
    },

    updata() {
      this.form.description=this.editor.txt.html()
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),

      };
      reqFile("/api/goodsedit", data).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqGoodsList();
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