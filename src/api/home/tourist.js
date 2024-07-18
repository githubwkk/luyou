import request from '@/utils/request'

const api_name = '/api/tourist'

export const GetTAList = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}
export const GetOneTA = id => {
  return request({
    url: `${api_name}/getOne/${id}`,
    method: 'get'
  })
}

//获取我的订单
export const GetUserTAOrderList = (page, limit, uid) => {
  return request({
    url: `${api_name}/getOrder/${page}/${limit}/${uid}`,
    method: 'get'
  })
}
//删除我的订单
export const DeleteTAOrderById = id => {
  return request({
    url: `${api_name}/deleteOrder/${id}`,
    method: 'delete'
  })
}
//预定订单
export const OrderTA = order => {
  return request({
    url: `${api_name}/orderTourist`,
    method: 'post',
    data: order
  })
}
