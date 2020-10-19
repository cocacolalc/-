import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import menu from './modules/menu'
import role from './modules/role'
import manage from './modules/manage'
import specs from './modules/specs'
import {state,getters,mutations} from './mutations'
import goods from './modules/goods'
import cate from './modules/cate'
import member from './modules/member'
import banner from './modules/banner'
import {actions} from './actions'
import seckill from './modules/seckill'
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        menu,
        role,
        manage,
        cate,
        specs,
        goods,
        member,
        banner,
        seckill
    }
})