import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import GoodsList from '../components/goods/List'
import Add from '../components/goods/Add'
import Report from '../components/report/Reports'
import Order from '../components/order/Order'
import Home2 from '../components/compoments/Home'
Vue.use(Router)

const router=new Router({
  routes: [
    // 重定向的路由规则
    {
      path: '/',
      redirect:'/Login'
    },
    {
      path:'/Login',
      name: 'Login',
      component: Login
    },
    {
      path:'/Home2',
      name:'Home2',
      component:Home2
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        // 定义子路由
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to 将要访问的路径
  // from 代表从哪个路径跳转的
  // next s是一个函数 表示方行
  // next() 方行 next('/login') 强制跳转

  if(to.path == '/login') return next()
  // 获取token
  const token=sessionStorage.getItem('token')
  // 如果token不存在 则进行跳转到login
  if(!token) return next('/login')
  // 否则方行
  next()

})
// 把router给暴露出去
export default router 
