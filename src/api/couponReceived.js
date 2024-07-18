import request from '@/utils/request'

const api_name = '/admin/couponReceived'
//分页查询
export const GetCouponReceivedList = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}
//单个删除
export const DeleteCouponReceivedById = id => {
  return request({
    url: `${api_name}/delete/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteCouponReceivedBatchIds = ids => {
  return request({
    url: `${api_name}/deleteBatchIds`,
    method: 'delete',
    data: ids
  })
}
