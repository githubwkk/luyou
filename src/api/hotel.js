import request from '@/utils/request'

const api_name = '/admin/hotel'
// 分页列表
export const GetHotelListByPage = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/list/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}

//（根据地区）查询酒店名字列表
export const GetHotelNameList = regionDto => {
  return request({
    url: `${api_name}/nameList`,
    method: 'get',
    params: regionDto
  })
}

//单个删除
export const DeleteHotelById = id => {
  return request({
    url: `${api_name}/deleteHotelById/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteHotelBatchIds = ids => {
  return request({
    url: `${api_name}/deleteHotelBatchIds`,
    method: 'delete',
    data: ids
  })
}

//添加
export const SaveHotel = hotel => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: hotel
  })
}
//修改
export const updateHotel = hotel => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: hotel
  })
}
