import {reqGet,reqPost} from '../../utils/request'

const state={
    list:[],
    size:2,
    page:1,
    total:0,
}

const mutations={
    changeList(state,arr){
        state.list=arr
        console.log('111',arr)
    },
    changeTotal(state,mun){
        state.total=mun
    },
    changePage(state,page){
        state.page=page
    }
}

const actions={
    reqGoodsList(context){
        reqGet('/api/goodslist',{size:context.state.size ,page:context.state.page}).then(res=>{
            let list = res.data.list ? res.data.list : []
            if(context.state.page>1&&list.length==0){
                context.commit('changePage',context.state.page-1)
                context.dispatch('reqGoodsList')
                return;
            }
            context.commit('changeList',list)
       
        })
    },
    reqTotal(context){
        reqGet('/api/goodscount').then(res=>{
            context.commit('changeTotal',res.data.list[0].total)
        })
    },
    changePageAction(context,page){
        context.commit('changePage',page)
        context.dispatch('reqGoodsList')
    }

}


const getters={
    list(state){
        return state.list
    },
    size(state){
        return state.size
    },
    total(state){
        return state.total
    }
}

export default{
    state,
    getters,
    mutations,
    actions,
    namespaced: true
}