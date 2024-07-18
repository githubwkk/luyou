import request from '@/utils/request'

const api_name = '/api/statistics'
export const GetHotelMap = () => {
  return request({
    url: `${api_name}/getHotelMap`,
    method: 'get'
  })
}

export const GetTouristLine = year => {
  return request({
    url: `${api_name}/getTouristLine/${year}`,
    method: 'get'
  })
}
export const GetPieData = year => {
  return request({
    url: `${api_name}/getPieData/${year}`,
    method: 'get'
  })
}
//今日数据
export const GetTodayInfo = () => {
  return request({
    url: `${api_name}/getToDayInfo`,
    method: 'get'
  })
}
//品牌排名数据
export const GetBrandRank = day => {
  return request({
    url: `${api_name}/getBrandRank/${day}`,
    method: 'get'
  })
}
//获取开关fromRedis
export const GetSwitch = () => {
  return request({
    url: `${api_name}/getSwitch`,
    method: 'get'
  })
}

//设置开关值
export const SetSwitch = name => {
  return request({
    url: `${api_name}/setSwitch/${name}`,
    method: 'get'
  })
}

//黑蓝数据分析
export const GetDark=()=>{
  return request({
    url: `${api_name}/getDarkAll`,
    method: 'get'
  })
}
