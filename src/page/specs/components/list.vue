<template>
  <div>
    <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
      <el-table-column prop="id" label="规格编号" sortable width="180"></el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable width="180"></el-table-column>
      <el-table-column label="规格属性">
        <template slot-scope="scope" >
          <el-tag  v-for="item in scope.row.attrs" :key='item.id' >{{
            item
          }}</el-tag>
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
     list: "specs/list",
      total: "specs/total",
      size: "specs/size",
    }),
  },
  methods: {
    ...mapActions({
      reqSpecsList:"specs/reqSpecsList",
       changePageAction:"specs/changePageAction",
       reqTotal:'specs/reqTotal'
    }),
    changePage(e){
      this.changePageAction(e)
    },
    del(id) {
      console.log(id);
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "waring",
      })
        .then(() => {
          reqPost("/api/specsdelete", { id: id }).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.reqSpecsList();
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
    this.reqSpecsList();
  
   
  },
};
</script>
<style scoped>
</style>