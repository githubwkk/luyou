import request from '@/utils/request'

const api_name = '/admin/system'

// 分页查询
export const GetSysUserListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: `${api_name}/sysUser/findByPage/` + pageNum + '/' + pageSize,
    method: 'get',
    params: queryDto
  })
}

// 新增用户的方法
export const SaveSysUser = data => {
  return request({
    url: `${api_name}/sysUser/saveSysUser`,
    method: 'post',
    data
  })
}

// 修改用户
export const UpdateSysUser = sysUser => {
  return request({
    url: `${api_name}/sysUser/updateSysUser`,
    method: 'put',
    data: sysUser
  })
}

//修改密码
export const UpdatePassWord = passwordDto => {
  return request({
    url: `${api_name}/sysUser/updatePassWord`,
    method: 'put',
    data: passwordDto
  })
}
// 根据id删除用户
export const DeleteSysUserById = userId => {
  return request({
    url: `${api_name}/sysUser/deleteById/` + userId,
    method: 'delete'
  })
}

// 给用户分配角色请求
export const DoAssignRoleToUser = assginRoleVo => {
  return request({
    url: `${api_name}/sysUser/doAssign`,
    method: 'post',
    data: assginRoleVo
  })
}
