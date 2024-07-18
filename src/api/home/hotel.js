import request from '@/utils/request'

const api_name = '/api/hotel'
//列表
export const GetHotelList = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}
//单个酒店
export const GetOneHotel = id => {
  return request({
    url: `${api_name}/getOneHotel/${id}`,
    method: 'get'
  })
}
//品牌列表
export const GetHotelBrandList = () => {
  return request({
    url: `${api_name}/selectBrandList`,
    method: 'get'
  })
}
//主页获取酒店列表展示
export const GetHotelHomeList = type => {
  return request({
    url: `${api_name}/homeList/${type}`,
    method: 'get'
  })
}

//获取我的订单
export const GetUserHotelOrderList = (page, limit, uid) => {
  return request({
    url: `${api_name}/getOrder/${page}/${limit}/${uid}`,
    method: 'get'
  })
}
//删除我的订单
export const DeleteUserHotelOrder = id => {
  return request({
    url: `${api_name}/deleteOrder/${id}`,
    method: 'delete'
  })
}
//获取酒店下的所有房间
export const GetHotelRoomList = hid => {
  return request({
    url: `${api_name}/selectRoomListByHid/${hid}`,
    method: 'get'
  })
}
//下单
export const OrderRoom = order => {
  return request({
    url: `${api_name}/order`,
    method: 'post',
    data: order
  })
}
