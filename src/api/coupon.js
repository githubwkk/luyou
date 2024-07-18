import request from '@/utils/request'

const api_name = '/admin/coupon'
export const GetCouponList = (page, limit) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get'
  })
}

//单个删除
export const DeleteCouponById = id => {
  return request({
    url: `${api_name}/delete/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteCouponBatchIds = ids => {
  return request({
    url: `${api_name}/deleteBatchIds`,
    method: 'delete',
    data: ids
  })
}

//添加
export const SaveCoupon = Coupon => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: Coupon
  })
}
//修改
export const updateCoupon = Coupon => {
  return request({
    url: `${api_name}/update`,
    method: 'put',
    data: Coupon
  })
}
