import request from '@/utils/request'

// 分页查询角色数据
export const GetSysRoleListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: '/admin/system/sysRole/findByPage/' + pageNum + '/' + pageSize,
    method: 'post',
    params: queryDto
  })
}

// 添加角色请求方法
export const SaveSysRole = data => {
  return request({
    url: '/admin/system/sysRole/saveSysRole',
    method: 'post',
    data
  })
}

// 保存修改角色
export const UpdateSysRole = data => {
  return request({
    url: '/admin/system/sysRole/updateSysRole',
    method: 'put',
    data
  })
}

// 删除角色
export const DeleteSysRoleById = roleId => {
  return request({
    url: '/admin/system/sysRole/deleteById/' + roleId,
    method: 'delete'
  })
}

// 查询所有的角色数据和用户角色数据
export const GetAllRoleList = userId => {
  return request({
    url: '/admin/system/sysRole/findAllRoles/' + userId,
    method: 'get'
  })
}

// 查询指定角色所对应的菜单id
export const GetSysRoleMenuIds = roleId => {
  return request({
    url: '/admin/system/sysRole/findSysRoleMenuByRoleId/' + roleId,
    method: 'get'
  })
}

// 根据角色分配菜单请求方法
export const DoAssignMenuIdToSysRole = assignMenuDto => {
  return request({
    url: '/admin/system/sysRole/doAssign',
    method: 'post',
    data: assignMenuDto
  })
}
