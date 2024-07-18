// 修改用户
import request from '@/utils/request.js'

const api_name = '/api/user/login'
//发送验证码（改变信息）
export const SendSmsCodeOfUpdate = phone => {
  return request({
    url: `${api_name}/sendCodeOfUpdate/${phone}`,
    method: 'get'
  })
}

//验证验证码
export const ValidateCode = (phone, code) => {
  return request({
    url: `${api_name}/validateCode/${phone}/${code}`,
    method: 'get'
  })
}

export const UpdateUser = sysUser => {
  return request({
    url: `${api_name}/updateUser`,
    method: 'put',
    data: sysUser
  })
}

//修改密码
export const UpdateUserPassWord = passwordDto => {
  return request({
    url: `${api_name}/updatePassWord`,
    method: 'post',
    data: passwordDto
  })
}

//修改手机号
export const UpdateUserPhone = (id, phone) => {
  return request({
    url: `${api_name}/updatePhone/${id}/${phone}`,
    method: 'put'
  })
}
