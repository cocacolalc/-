import {reqGet,reqPost} from '../../utils/request' 

const state={
    size:2,
    page:1,
    total:0,
    list:[]
}

const mutations={
    changeTotal(state,num){
        state.total=num;
    },
    changeList(state,arr){
        state.list=arr
    },
    changePage(state,page){
        state.page=page
    }
}

const actions={
    reqManageList(context){
        reqGet('/api/userlist',{size:context.state.size ,page:context.state.page}).then(res=>{
            let list = res.data.list ? res.data.list : []
            if(context.state.page>1&&list.length==0){
                context.commit("changePage",context.state.page-1)
                context.dispatch("reqManageList")
                return;
            }
           
            context.commit("changeList", list)
        })
    },
    reqTotal(context){
        reqGet('/api/usercount').then(res=>{
            context.commit('changeTotal',res.data.list[0].total)
        })
        
    },
     //组件修改了页码
     changePageAction(context,page){
        //修改页码
        context.commit("changePage",page)
        //发起list请求
        context.dispatch('reqManageList')
    }
}
const getters ={
    size(state){
        return state.size
    },
    list(state){
        
        return state.list
    },
    total(state){
        return state.total;
    }
}
export default{
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}