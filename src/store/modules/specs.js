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
    reqSpecsList(context,bool){
        let params = bool ? {} : { page: context.state.page, size: context.state.size }
        reqGet('/api/specslist',params).then(res=>{
            let list = res.data.list ? res.data.list : []
            if(context.state.page>1&&list.length==0){
                context.commit("changePage",context.state.page-1)
                context.dispatch("reqSpecsList")
                return;
            }
            
            // console.log(list[0].attrs);
            list.forEach(item => {
                    console.log(item)
                item.attrs = JSON.parse(item.attrs)
                
            })
            // console.log(list[0].attrs,typeof(list[0].attrs));
            context.commit("changeList", list)
        })
    },
    reqTotal(context){
        reqGet('/api/specscount').then(res=>{
            context.commit('changeTotal',res.data.list[0].total)
        })
        
    },
     //组件修改了页码
     changePageAction(context,page){
        //修改页码
        context.commit("changePage",page)
        //发起list请求

        context.dispatch('reqSpecsList')
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