<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="商品编号">
      </el-table-column>
      <el-table-column prop="goodsname" label="商品名称"> </el-table-column>
      <el-table-column label="商品价格">
        <template slot-scope="scope">
          <span>{{ scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre + scope.row.img" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="是否新品">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isnew == 1" type="primary">是</el-button>
          <el-button v-else type="danger">否</el-button>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.ishot == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作"  sortable width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
         <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePage"

    >
    </el-pagination>
  </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";
import { successAlert,warningAlert } from '../../../utils/alert';
import { waringAlert } from '../../../utils/alert';
import { reqPost } from '../../../utils/request';

export default {
  props: [],
  components: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      list: "goods/list",
      size: "goods/size",
      total: "goods/total",
      
    }),
    
  },
  
  methods: {
    ...mapActions({
        reqGoodList:'goods/reqGoodsList',
        changePage:'goods/changePageAction',
        reqTotal:'goods/reqTotal'
    }),
    del(id){
        this.$confirm('你确定要删除吗？','删除提示',{
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'waring'
        })
        .then(()=>{
           reqPost('/api/goodsdelete',{id:id}).then(res=>{
               if(res.data.code==200){
                   successAlert(res.data.msg)
                   this.reqGoodList()

               }else{
                   waringAlert(res.data.msg)
               }
           })
       
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    edit(id){
        this.$emit('edit',id)
    }
  },
  mounted() {
     this.reqGoodList()
     this.reqTotal()
  },
};
</script>
<style scoped>
img {
  width: 50px;
  height: 50px;
}
</style>