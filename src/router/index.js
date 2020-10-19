import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)
export let indexRouters=[
  
  {
    path:'menu',
    name:'菜单管理',
    component:()=>import('../page/menu/menu.vue')
  },
  {
    path:'role',
    name:'角色管理',
    component:()=>import('../page/role/role.vue')
  },
  {
    path:'manage',
    name:'管理员管理',
    component:()=>import('../page/manage/manage.vue')
  },
  {
    path:'member',
    name:'会员管理',
    component:()=>import('../page/member/member.vue')
  },
  {
    path:'cate',
    name:'商品分类',
    component:()=>import('../page/cate/cate.vue')
  },
  {
    path:'specs',
    name:'商品价格',
    component:()=>import('../page/specs/specs.vue')
  },
  {
    path:'banner',
    name:'轮播图管理',
    component:()=>import('../page/banner/banner.vue')
  },
  {
    path:'goods',
    name:'商品管理',
    component:()=>import('../page/goods/goods.vue')
  },
 
  {
    path:'seckill',
    name:'秒杀活动',
    component:()=>import('../page/seckill/seckill.vue')
  },
]

let router =new Router({
  routes: [
    {
      path:'/',
      component:()=>import('../page/index/index.vue'),
      children:[
        {
          path:'',
          component:()=>import('../page/home/home.vue')
        },
        ...indexRouters
      ]
    },
    {
      path:'/login',
      component:()=>import('../page/login/login.vue')
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path=='/login'){
    next()
    return
  }
  if(store.state.userInfo.token){
    next()
    return
  }
  next('/login')
})

export default router