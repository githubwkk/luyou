import TouristList from '@/views/home/TouristList.vue'
import waterfallContainer from '@/views/home/waterfallContainer.vue'
import singleTourist from '@/views/home/single/singleTourist.vue'

export default [
  {
    path: '/TouristListHome',
    name: 'TouristListHome',
    component: TouristList
  },
  {
    path: '/singleTourist',
    name: 'singleTourist',
    component: singleTourist
  },
  {
    path: '/photoWaterFall',
    name: 'photoWaterFall',
    component: waterfallContainer
  }
]
