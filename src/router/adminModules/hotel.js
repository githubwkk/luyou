import hotel from '@/views/hotel/hotel.vue'
import room from '@/views/hotel/room.vue'
import i18n from '@/i18n'

const Layout = () => import('@/layout/index.vue')
const brand = () => import('@/views/hotel/brand.vue')
export default [
    {
        path: '/hotel',
        component: Layout,
        name: 'hotel',
        meta: {
            title: i18n.global.t('menu.HospitalityManagement')
        },
        icon: 'icon-hotel',
        children: [
            {
                path: '/brand',
                name: 'brand',
                component: brand,
                meta: {
                    title: i18n.global.t('menu.BrandManagement')
                },
                hidden: false
            },
            {
                path: '/hotels',
                name: 'hotels',
                component: hotel,
                meta: {
                    title: i18n.global.t('menu.HospitalityManagement')
                },
                hidden: false
            },
            {
                path: '/room',
                name: 'room',
                component: room,
                meta: {
                    title: i18n.global.t('menu.roomManagement')
                },
                hidden: false
            }
        ]
    }
]
