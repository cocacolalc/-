<template>
  <div>
    <!-- <el-button type="primary" @click="willAdd">添加</el-button> -->

    <v-list @change="edit"></v-list>
    <v-add :info="info" ref="chlidern"></v-add>
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
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    
    edit(uid){
      this.info.isshow=true
      this.info.isAdd=false
      this.$refs.chlidern.look(uid)
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>