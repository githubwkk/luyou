import request from '@/utils/request.js'

//景点地址
export const GetTouristLocationJson = () => {
  return request({
    url: `/api/statistics/getTouristLocation`,
    method: 'get'
  })
}
//瀑布流图片
export const GetWaterfallImg = (page, limit) => {
  return request({
    url: `/api/tourist/waterFall/${page}/${limit}`,
    method: 'get'
  })
}
