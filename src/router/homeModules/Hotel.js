import HotelList from '@/views/home/HotelList.vue'
import singleHotel from '@/views/home/single/singleHotel.vue'

export default [
  {
    path: '/HotelListHome',
    name: 'HotelListHome',
    component: HotelList
  },
  {
    path: '/singleHotel',
    name: 'singleHotel',
    component: singleHotel
  }
]
