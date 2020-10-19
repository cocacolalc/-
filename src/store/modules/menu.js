import {reqPost,reqGet} from "../../utils/request"
const state = {
    // 菜单的list
    list:[]
}
const mutations = {
    //修改list
    changeList(state,arr){
        state.list=arr;
    }
}
const actions = {
    //页面请求
   reqList(context){
       reqGet('/api/menulist',{istree:true}).then(res=>{
           context.commit('changeList',res.data.list)
       })
   }
    
}

const getters = {
    list(state){
        return state.list
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true

}