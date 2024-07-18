import touristAttractionsType from '@/views/travel/touristAttractionsType.vue'
import touristAttractions from '@/views/travel/touristAttractions.vue'
import i18n from '@/i18n'

const Layout = () => import('@/layout/index.vue')

export default [
    {
        path: '/travel',
        component: Layout,
        name: 'travel',
        meta: {
            title: i18n.global.t('menu.AttractionManagement')
        },
        icon: 'icon-mountains',
        children: [
            {
                path: '/tat',
                name: 'tat',
                component: touristAttractionsType,
                meta: {
                    title: i18n.global.t('menu.AttractionManagement')
                },
                hidden: false
            },
            {
                path: '/ta',
                name: 'ta',
                component: touristAttractions,
                meta: {
                    title: i18n.global.t('menu.TypeManagement')
                },
                hidden: false
            }
        ]
    }
]
