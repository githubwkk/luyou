import request from '@/utils/request'

const api_name = '/admin/orderTourist'
// 分页列表
export const GetOrderTouristListByPage = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}

//单个删除
export const DeleteOrderTouristById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteOrderTouristBatchIds = ids => {
  return request({
    url: `${api_name}/deleteBatchIds`,
    method: 'delete',
    data: ids
  })
}

//添加
export const SaveOrderTourist = OrderTourist => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: OrderTourist
  })
}
//修改
export const updateOrderTourist = OrderTourist => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: OrderTourist
  })
}
