<template>
  <div>
    <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
      <el-table-column prop="id" label="分类编号" sortable width="180"></el-table-column>
      <el-table-column prop="catename" label="分类名称" sortable width="180"></el-table-column>

      <el-table-column prop="img" label="图片" sortable width="180">
          <template slot-scope="scope">
          <img v-if="scope.row.pid!=0" :src="$imgPre+scope.row.img" alt="">
        </template>
      </el-table-column>

      <el-table-column prop="type" label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  
  </div>
  
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { waringAlert } from "../../../utils/alert";
import { reqPost } from "../../../utils/request";

export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
    list:'cate/list'
    }),
  },
  methods: {
    ...mapActions({
        reqList:'cate/reqList'
    }),
   
    del(id) {
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "waring",
      })
        .then(() => {
          reqPost("/api/catedelete", { id: id }).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.reqList()
             
            } else {
              waringAlert(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(uid) {
      this.$emit("edit", uid);
    },
  },
  mounted() {
   this.reqList()
    
   console.log(111);
  },
};
</script>
<style scoped>
img{
  width: 100px;
  height: 100px;
}
</style>