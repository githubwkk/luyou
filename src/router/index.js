import { createRouter, createWebHashHistory } from 'vue-router'

import redirect from '@/router/adminModules/redirect'
import error from '@/router/adminModules/error'
import login from '@/router/adminModules/login'
import lock from '@/router/adminModules/lock'
import home from '@/router/adminModules/home'
import system from '@/router/adminModules/system'
import hotel from '@/router/adminModules/hotel.js'
import travel from '@/router/adminModules/travel.js'
import article from '@/router/adminModules/article.js'
import order from '@/router/adminModules/order.js'
import coupon from '@/router/adminModules/coupon.js'
import Article from '@/router/homeModules/Article.js'
import index from '@/views/index.vue'
import Tourist from '@/router/homeModules/Tourist.js'
import PersonCenter from '@/router/homeModules/PersonCenter.js'
import Hotel from '@/router/homeModules/hotel.js'
import Coupon from '@/router/homeModules/Coupon.js'

// 固定菜单
export const fixedRoutes = [...home]
// 动态菜单（根据角色权限）（先添加所有路由到界面，再给menu.js使用（删除所有，再根据权限添加））
export const asyncRoutes = [
  ...system,
  ...hotel,
  ...travel,
  ...article,
  ...order,
  ...coupon
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: index,
      name: 'index'
    },
    ...Coupon,
    ...Hotel,
    ...Tourist,
    ...Article,
    ...PersonCenter,
    ...redirect, // 统一的重定向配置
    ...login,
    ...lock,
    ...fixedRoutes,
    ...error
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  }
})

export default router
