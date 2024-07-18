import coupon from '@/views/coupon/coupon.vue'
import Layout from '@/layout/index.vue'
import couponReceived from '@/views/coupon/couponReceived.vue'
import i18n from '@/i18n'

export default [
    {
        path: '/couponPage',
        component: Layout,
        name: 'couponPage',
        meta: {
            title: i18n.global.t('menu.CouponManagement')
        },
        icon: 'Postcard',
        children: [
            {
                path: '/couponManagement',
                name: 'coupon',
                component: coupon,
                meta: {
                    title: i18n.global.t('menu.CouponManagement'),
                    hidden: false
                }
            },
            {
                path: '/couponReceived',
                name: 'couponReceived',
                component: couponReceived,
                meta: {
                    title: i18n.global.t('menu.CouponPickList'),
                    hidden: false
                }
            }
        ]
    }
]
