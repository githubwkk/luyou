import request from '@/utils/request'
//发送验证码
export const SendSmsCode = phone => {
  return request({
    url: `/api/user/login/sendCode/${phone}`,
    method: 'get'
  })
}

//注册接口
export const Register = data => {
  return request({
    url: '/api/user/login/register',
    method: 'post',
    data
  })
}
// 登录接口
export const Login = data => {
  return request({
    url: '/api/user/login/login',
    method: 'post',
    data
  })
}

// 获取登录用户信息
export const GetUserinfo = () => {
  return request({
    url: '/admin/system/index/getUserinfo',
    method: 'get'
  })
}

// 获取验证码
export const GetValidateCode = () => {
  return request({
    url: '/api/user/login/getValidateCode',
    method: 'get'
  })
}

// 退出登录
export const Logout = () => {
  return request({
    url: '/admin/system/index/logout',
    method: 'get'
  })
}
