<template>
  <div>
    <el-dialog @closed="close" :title="info.isAdd ? '添加角色':'修改角色'" :visible.sync="info.isshow">
      <el-form ref="form" :model="form" label-width="80px">

      

        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <div class="my-upload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt="" />
            <input  class="my-input" type="file" @change="getFile">
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
import { reqFile, reqGet, reqPost } from "../../../utils/request";

export default {
  props: ["info"],
  components: {},
  data() {
    return {
      isshow: true,
      imgUrl: "",
      form: {
      title:'',
       img:null,
       status:1
      },
    };
  },
  computed: {
    ...mapGetters({
    // list:'cate/list'
    }),
  },
  methods: {
    ...mapActions({
     reqList:'banner/reqList'
       
    }),

    add() {
   
      reqFile("/api/banneradd",this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
         this.reqList()
        } else {
          waringAlert(res.data.msg);
        }
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this. imgUrl='',
      this.form = {
       title:'',
       img:null,
       status:1
      };
    this.imgUrl=''
    },

    onSubmit() {
      console.log("submit!");
    },
    look(id) {
      reqGet("/api/bannerinfo", { id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
         this.imgUrl=this.$imgPre+this.form.img
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
      console.log(this.form);
      reqFile("/api/banneredit",this.form).then((res) => {
        console.log(999);
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqList()
        } else {
          successAlert(res.data.msg);
        }
      });
    },
    getFile(e){
      let file =e.target.files[0]
     
      if(file.size>2*1024*1024){
        waringAlert('文件不能超过2M')
        return 
      }
      let imgExtArr=['.jpg','.png','.jpeg','.gft']
      let extname=file.name.slice(file.name.lastIndexOf('.'))
      if(!imgExtArr.some(item=>item==extname)){
        waringAlert('文件格式不正确')
        return
      }
      this.imgUrl=URL.createObjectURL(file)
      this.form.img=file;
    },
  
     close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    
  },

  mounted() {
    // this.reqList()
   
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