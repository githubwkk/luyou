import personalInformation from '@/views/home/personCenter/personalInformation.vue'
import index from '@/views/home/personCenter/index.vue'
import HotelOrder from '@/views/home/personCenter/HotelOrder.vue'
import TouristOrder from '@/views/home/personCenter/TouristOrder.vue'
import myCoupon from '@/views/home/personCenter/MyCoupon.vue'
import myArticle from '@/views/home/personCenter/myArticle.vue'
import myAccount from '@/views/home/personCenter/myAccount.vue'

export default [
  {
    path: '/personCenter',
    name: 'PersonCenter',
    component: index,
    redirect: '/personalInformation',
    children: [
      {
        path: '/personalInformation',
        name: 'personalInformation',
        component: personalInformation
      },
      {
        path: '/hotelOrder',
        name: 'HotelOrder',
        component: HotelOrder
      },
      {
        path: '/touristOrder',
        name: 'TouristOrder',
        component: TouristOrder
      },
      {
        path: '/myCoupon',
        name: 'myCoupon',
        component: myCoupon
      },
      {
        path: '/myArticleCenter',
        name: 'myArticleCenter',
        component: myArticle
      },
      {
        path: '/myAccount',
        name: 'myAccount',
        component: myAccount
      }
    ]
  }
]
