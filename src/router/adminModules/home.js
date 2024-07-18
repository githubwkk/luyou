import i18n from '@/i18n'
import moreData from "@/views/system/moreData.vue"

const Layout = () => import('@/layout/index.vue')
const Home = () => import('@/views/system/index.vue')
//----------------------------------------------------------------------------------
//---------------------------···固定的菜单Pinia······---------------------------------
//----------------------------------------------------------------------------------
export default [
    {
        path: '/home',
        component: Layout,
        name: 'Dashboard',
        meta: {
            title: i18n.global.t('menu.dashboard')
        },
        icon: 'House',
        children: [
            {
                path: '',
                name: 'home',
                component: Home,
                meta: {
                    // title: ctx.$t('menu.homepage'),
                    title: i18n.global.t('menu.dashboard'),
                    affix: false
                }
            }
        ]
    },
    {
        path: '/moreData',
        component: Layout,
        name: 'moreData',
        meta: {
            title: i18n.global.t('menu.moreData')
        },
        icon: 'PieChart',
        children: [
            {
                path: '',
                name: 'moreData',
                component: moreData,
                meta: {
                    title: i18n.global.t('menu.moreData'),
                    affix: false
                }
            }
        ]
    }
]
