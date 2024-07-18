const Lock = () => import('@/views/lock/index.vue')
import i18n from '@/i18n'
export default [
  {
    path: '/lock',
    name: 'lock',
    component: Lock,
    meta: {
      title: i18n.global.t('topbar.lock-locked')
    }
  }
]
