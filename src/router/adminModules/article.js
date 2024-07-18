import articleInsert from '@/views/article/articleInsert.vue'
import articleList from '@/views/article/articleList.vue'
import myArticle from '@/views/article/myArticle.vue'
import articleType from '@/views/article/articleType.vue'
import i18n from '@/i18n'

const Layout = () => import('@/layout/index.vue')

export default [
    {
        path: '/article',
        component: Layout,
        name: 'article',
        meta: {
            title: i18n.global.t('menu.ArticleManagement')
        },
        icon: 'Tickets',
        children: [
            {
                path: '/articleInsert',
                name: 'articleInsert',
                component: articleInsert,
                meta: {
                    title: i18n.global.t('menu.aaa')
                },
                hidden: false
            },
            {
                path: '/articleType',
                name: 'articleType',
                component: articleType,
                meta: {
                    title: i18n.global.t('menu.TypeManagement'),
                },
                hidden: false
            },
            {
                path: '/articleList',
                name: 'articleList',
                component: articleList,
                meta: {
                    title: i18n.global.t('menu.articlesList')
                },
                hidden: false
            },
            {
                path: '/myArticle',
                name: 'myArticle',
                component: myArticle,
                meta: {
                    title: i18n.global.t('menu.myArticle')
                },
                hidden: false
            }
        ]
    }
]
