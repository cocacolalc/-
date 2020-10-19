<template>
  <div>
    <h1>首页管理</h1>
    <div class="box" id="main"></div>
  </div>
</template>
<script>
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
    }),  
  },
  watch: {
    list: {
      handler() {
        if (this.list.length > 0) {
          var myChart = echarts.init(document.getElementById("main"));
          var option = {
            title: {
              text: "商品分类",
            },
            tooltip: {},
            legend: {
              data: ["下级商品数量"],
            },
            xAxis: {
              data: this.list.map(item=>item.catename),
            },
            yAxis: {},
            series: [
              {
                name: "下级商品数量",
                type: "bar",
                data: this.list.map(item=>item.children.length),
              },
            ],
          };

          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        }
      },
    },
  },
  mounted() {
    this.reqList();
  },
};
</script>
<style scoped>
.box {
  width: 80%;
  height: 400px;
  border: 1px solid #ccc;
}
</style>