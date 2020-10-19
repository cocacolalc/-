<template>
  <div>
    <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
      <el-table-column prop="roleid" label="用户编号" sortable width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="180"></el-table-column>

      <el-table-column prop="type" label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.uid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  @current-change="changePage" background layout="prev, pager, next" :total="total" :page-size="size"
   
    >
    </el-pagination>
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
      list: "manage/list",
      total:'manage/total',
      size:'manage/size'
    }),
  },
  methods: {
    ...mapActions({
      reqManageList: "manage/reqManageList",
       changePageAction:"manage/changePageAction",
       reqTotal:'manage/reqTotal'
    }),
    changePage(e){
      this.changePageAction(e)
    },
    del(id) {
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "waring",
      })
        .then(() => {
          reqPost("/api/userdelete", { uid: id }).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.reqManageList();
               this.reqTotal()
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
     this.reqTotal()
    this.reqManageList();
   
  },
};
</script>
<style scoped>
</style>