import request from '@/utils/request'

const api_name = '/admin/orderHotel'
// 分页列表
export const GetOrderHotelListByPage = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}

//单个删除
export const DeleteOrderHotelById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteOrderHotelBatchIds = ids => {
  return request({
    url: `${api_name}/deleteBatchIds`,
    method: 'delete',
    data: ids
  })
}
//退房
export const CheckOut = id => {
  return request({
    url: `${api_name}/checkOut/${id}`,
    method: 'put'
  })
}
