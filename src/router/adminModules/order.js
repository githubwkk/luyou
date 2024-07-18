import orderTourist from '@/views/order/orderTourist.vue'
import orderHotel from '@/views/order/orderHotel.vue'
import i18n from '@/i18n'

const Layout = () => import('@/layout/index.vue')

export default [
    {
        path: '/order',
        component: Layout,
        name: 'order',
        meta: {
            title: i18n.global.t('order.OrderManagement')
        },
        icon: 'List',
        children: [
            {
                path: '/orderTourist',
                name: 'orderTourist',
                component: orderTourist,
                meta: {
                    title: i18n.global.t('order.AttractionOrders')
                },
                hidden: false
            },
            {
                path: '/orderHotel',
                name: 'orderHotel',
                component: orderHotel,
                meta: {
                    title: i18n.global.t('order.HotelReservations')
                },
                hidden: false
            }
        ]
    }
]
