// 导入组件
import i18n from '@/i18n'
import sysOperLog from '@/views/system/sysOperLog.vue'

const Layout = () => import('@/layout/index.vue')
const sysRole = () => import('@/views/system/sysRole.vue')
const sysUser = () => import('@/views/system/sysUser.vue')
const sysMenu = () => import('@/views/system/sysMenu.vue')
// 导出该组件
export default [
  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: {
      title: i18n.global.t('menu.SystemManagement')
    },
    icon: 'setting',
    children: [
      {
        path: '/sysRole',
        name: 'sysRole',
        component: sysRole,
        meta: {
          title: i18n.global.t('menu.RoleManagement')
        },
        hidden: false
      },
      {
        path: '/sysUser',
        name: 'sysUser',
        component: sysUser,
        meta: {
          title: i18n.global.t('menu.UserManagement')
        },
        hidden: false
      },
      {
        path: '/menu',
        name: 'sysMenu',
        component: sysMenu,
        meta: {
          title: i18n.global.t('menu.MenuManagement')
        },
        hidden: false
      },
      {
        path: '/log',
        name: 'log',
        component: sysOperLog,
        meta: {
          title: i18n.global.t('menu.LogMangement')
        },
        hidden: false
      }
    ]
  }
]
