import request from '@/utils/request'

const api_name = '/api/coupon'
/*
 * 主页和api有关的接口都在这
 * */

//分页查询自己的优惠券领取记录
export const GetCouponReceivedList = (page, limit, uid) => {
  return request({
    url: `${api_name}/personalList/${page}/${limit}/${uid}`,
    method: 'get'
  })
}

//使用优惠券时的列表
export const GetCouponList = (page, limit) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get'
  })
}
//领取优惠券
export const ReceivedCoupon = (couponId, uid) => {
  return request({
    url: `${api_name}/receive/${couponId}/${uid}`,
    method: 'put'
  })
}
//查询用户已领取的优惠券列表
export const findPersonalCidList = uid => {
  return request({
    url: `${api_name}/personalCidList/${uid}`,
    method: 'get'
  })
}

//下单时查询可用的优惠券
export const GetUserOrderCoupon = (type, uid, priceAmount) => {
  return request({
    url: `${api_name}/userOrderCoupon/${type}/${uid}/${priceAmount}`,
    method: 'get'
  })
}
