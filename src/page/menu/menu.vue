<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list @edit='edit'></v-list>
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>
<script>
//import {reqGet,reqPost} from '../utils/request'
import { mapGetters, mapActions } from "vuex";
import vAdd from "./components/add";
import vList from "./components/list";
export default {
  props: [],
  components: {
    vAdd,
    vList,
  },
  data() {
    return {
      info: {
        isshow: false,
        isAdd:true
      },
    };
  },
  computed: {
    ...mapGetters({
      
    }),
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info.isshow = true;
    },
    edit(id){
      this.info.isshow=true
      this.info.isAdd=false
      this.$refs.add.look(id)
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>